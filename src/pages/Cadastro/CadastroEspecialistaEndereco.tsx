import { useForm } from "react-hook-form";
import {
  Button,
  Divisor,
  ErrorMessage,
  Fieldset,
  Form,
  FormContainer,
  Input,
  Label,
  Titulo,
  UploadDescription,
  UploadIcon,
  UploadInput,
  UploadLabel,
  UploadTitulo,
} from "../../components";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";

const esquemaCadastroEspecialista = z.object({
  endereco: z.object({
    cep: z.string().min(8, "Informe um CEP válido"),
    avatar: z.instanceof(FileList).transform((lista) => lista.item(0)!),
    rua: z.string().min(1, "Informe uma rua válida"),
    numero: z.coerce.number().min(1, "Informe um número válido"),
    bairro: z.string().min(1, "Informe um bairro válido"),
    localidade: z.string().min(1, "Informe uma localidade válida"),
  })
})

type FormCadastroEnderecoEspecialista = z.infer<
  typeof esquemaCadastroEspecialista>;

type EnderecoPros = {
  logradouro: string,
  bairro: string,
  localidade: string,
  uf: string
}

const CadastroEspecialistaEndereco = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<FormCadastroEnderecoEspecialista>({
    resolver: zodResolver(esquemaCadastroEspecialista),
    mode: "all",
    defaultValues: {
      endereco: {
        cep: "",
        avatar: new File([""], "dummy.jpg", { type: "image/jpeg" }),
        rua: "",
        numero: 0,
        bairro: "",
        localidade: "",
      },
    },
  });

  const aoSubmeter = (dados: FormCadastroEnderecoEspecialista) => {
    console.log(dados)
  }

  const handleSetDados = useCallback(async (dados: EnderecoPros) => {
    setValue('endereco.bairro', dados.bairro)
    setValue('endereco.rua', dados.logradouro)
    setValue('endereco.localidade', dados.localidade + ", " + dados.uf)
  }, [setValue]);

  const buscaEndereco = useCallback(async (cep: string) => {
    const result = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await result.json();
    handleSetDados(dados);
  }, [handleSetDados]);

  const codigoCep = watch('endereco.cep');

  useEffect(() => {
    if (codigoCep.length !== 8) return;
    buscaEndereco(codigoCep);
  }, [buscaEndereco, codigoCep])

  return (
    <>
      <Titulo className="titulo">Para finalizar, só alguns detalhes!</Titulo>
      <Form onSubmit={handleSubmit(aoSubmeter)}>
        <>
          <UploadTitulo>Sua foto</UploadTitulo>
          <UploadLabel htmlFor="campo-upload">
            <UploadIcon />
            <UploadDescription>Clique para enviar</UploadDescription>
            <UploadInput accept="image/*" id="campo-upload" type="file" {...register("endereco.avatar")} />
          </UploadLabel>
          {
            errors.endereco?.avatar &&
            <ErrorMessage>{errors.endereco?.avatar.message}</ErrorMessage>
          }
        </>
        <Divisor />
        <Fieldset>
          <Label htmlFor="campo-cep">CEP</Label>
          <Input id="campo-cep" placeholder="Insira seu CEP" type="text" {...register('endereco.cep')} />
          {
            errors.endereco?.cep &&
            <ErrorMessage>{errors.endereco?.cep.message}</ErrorMessage>
          }
        </Fieldset>
        <Fieldset>
          <Label htmlFor="campo-rua">Rua</Label>
          <Input id="campo-rua" placeholder="Rua Agarikov" type="text" {...register('endereco.rua')} />
          {
            errors.endereco?.rua &&
            <ErrorMessage>{errors.endereco?.rua?.message}</ErrorMessage>
          }
        </Fieldset>
        <FormContainer>
          <Fieldset>
            <Label htmlFor="campo-numero-rua">Número</Label>
            <Input id="campo-numero-rua" placeholder="Ex: 1440" type="text" {...register('endereco.numero')} />
            {
              errors.endereco?.numero &&
              <ErrorMessage>{errors.endereco?.numero.message}</ErrorMessage>
            }
          </Fieldset>
          <Fieldset>
            <Label htmlFor="campo-bairro">Bairro</Label>
            <Input id="campo-bairro" placeholder="Vila Mariana" type="text" {...register('endereco.bairro')} />
            {
              errors.endereco?.bairro &&
              <ErrorMessage>{errors.endereco?.bairro.message}</ErrorMessage>
            }
          </Fieldset>
        </FormContainer>
        <Fieldset>
          <Label htmlFor="campo-localidade">Localidade</Label>
          <Input
            id="campo-localidade"
            placeholder="São Paulo, SP"
            type="text"
            {...register('endereco.localidade')}
          />
          {
            errors.endereco?.localidade &&
            <ErrorMessage>{errors.endereco?.localidade.message}</ErrorMessage>
          }
        </Fieldset>
        <Button type="submit">Cadastrar</Button>
      </Form>
    </>
  );
};

export default CadastroEspecialistaEndereco;