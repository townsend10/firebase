"use client";

import { createPacientMedic } from "@/actions/create-pacient-medic";
import { CpfInput } from "@/components/cpf-input";
import { FormInput } from "@/components/form/form-input";
import { PhoneInput } from "@/components/phone-input";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const MedicForm = () => {
  const router = useRouter();

  // let yourDate = new Date();
  // const data = yourDate.toISOString().split("T")[0];

  const { execute, fieldErrors } = useAction(createPacientMedic, {
    onSuccess: (data) => {
      toast.success(`paciente foi  ${data.name} criado com sucesso`);
      router.push("/pacient");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;

    const birthdayDate = formData.get("birthdayDate") as string;
    const email = formData.get("email") as string;

    const cpf = formData.get("cpf") as string;
    const phone = formData.get("phone") as string;

    execute({ birthdayDate, cpf, email, name, phone });
  };

  return (
    // <div className="flex flex-grow  justify-center items-center">
    //   <form action={onSubmit}>
    //     <div className="mb-4">
    //       <FormInput
    //         id="name"
    //         type="name"
    //         className="mb-10"
    //         placeholder="Nome Completo"
    //         errors={fieldErrors}
    //       />
    //       <FormInput
    //         type="date"
    //         id="birthdayDate"
    //         className="mb-10"
    //         placeholder="Digite aniversario"
    //         errors={fieldErrors}
    //       />
    //       <FormInput
    //         type="name"
    //         id="email"
    //         className="mb-10"
    //         placeholder="e-mail"
    //         errors={fieldErrors}
    //       />
    //       {/* <FormInput type="name" id="cpf" className="mb-10" placeholder="CPF" /> */}
    //       <CpfInput
    //         type="name"
    //         id="cpf"
    //         className="mb-10"
    //         placeholder="CPF"
    //         errors={fieldErrors}
    //       />
    //       <PhoneInput
    //         type="tel"
    //         id="phone"
    //         className="mb-10"
    //         placeholder="Telefone"
    //       />
    //     </div>

    //     <div className="text-center">
    //       <Button size="lg" variant={"destructive"}>
    //         Cadastrar
    //       </Button>
    //     </div>
    //   </form>
    // </div>
    // <div className="flex flex-grow justify-center ">
    //   <form action={onSubmit} className=" shadow-lg rounded-2xl ">
    //     <h2 className="text-2xl font-semibold text-center mb-6 dark:text-white">
    //       Cadastrar Paciente
    //     </h2>
    //     <div className="space-y-4">
    //       <FormInput
    //         id="name"
    //         type="text"
    //         className="w-full"
    //         placeholder="Nome Completo"
    //         errors={fieldErrors}
    //       />
    //       <FormInput
    //         type="date"
    //         id="birthdayDate"
    //         className="w-full"
    //         placeholder="Data de Nascimento"
    //         errors={fieldErrors}
    //       />
    //       <FormInput
    //         type="email"
    //         id="email"
    //         className="w-full"
    //         placeholder="E-mail"
    //         errors={fieldErrors}
    //       />
    //       <CpfInput
    //         type="text"
    //         id="cpf"
    //         className="w-full"
    //         placeholder="CPF"
    //         errors={fieldErrors}
    //       />
    //       <PhoneInput
    //         type="tel"
    //         id="phone"
    //         className="w-full"
    //         placeholder="Telefone"
    //       />
    //     </div>
    //     <div className="text-center mt-6">
    //       <Button size="lg" variant="destructive" className="w-full">
    //         Cadastrar
    //       </Button>
    //     </div>
    //   </form>
    // </div>
    // <div className="flex flex-col flex-grow justify-center items-center p-4 min-h-screen">
    //   <form
    //     action={onSubmit}
    //     className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg h-1/2 flex flex-col justify-between border border-gray-200"
    //   >
    //     {" "}
    //     {/* max-w-lg e h-1/2 */}
    //     <div>
    //       {" "}
    //       {/* Novo div para envolver o título e inputs, permitindo o botão ficar no final */}
    //       <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
    //         Cadastro de Paciente
    //       </h2>
    //       <div className="space-y-5">
    //         <FormInput
    //           id="name"
    //           type="text"
    //           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
    //           placeholder="Nome Completo"
    //           errors={fieldErrors}
    //         />
    //         <FormInput
    //           type="date"
    //           id="birthdayDate"
    //           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
    //           placeholder="Data de Nascimento"
    //           errors={fieldErrors}
    //         />
    //         <FormInput
    //           type="email"
    //           id="email"
    //           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
    //           placeholder="E-mail"
    //           errors={fieldErrors}
    //         />
    //         <CpfInput
    //           type="text"
    //           id="cpf"
    //           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
    //           placeholder="CPF"
    //           errors={fieldErrors}
    //         />
    //         <PhoneInput
    //           type="tel"
    //           id="phone"
    //           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
    //           placeholder="Telefone"
    //         />
    //       </div>
    //     </div>
    //     <div className="text-center mt-8">
    //       <Button
    //         size="lg"
    //         variant="default"
    //         className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
    //       >
    //         Cadastrar
    //       </Button>
    //     </div>
    //   </form>
    // </div>

    <div className="flex flex-col flex-grow justify-center items-center min-h-screen p-4 ">
      <form
        action={onSubmit}
        className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg flex flex-col border border-gray-200"
      >
        <div className="flex-grow flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-center mb-10 text-gray-800 ">
            Cadastro de Paciente
          </h2>
          <div className="space-y-6">
            <FormInput
              id="name"
              type="text"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-lg"
              placeholder="Nome Completo"
              errors={fieldErrors}
              required
            />
            <FormInput
              type="date"
              id="birthdayDate"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-lg"
              placeholder="Data de Nascimento"
              required
              errors={fieldErrors}
            />
            <FormInput
              type="email"
              id="email"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-lg"
              placeholder="E-mail"
              errors={fieldErrors}
              max={2}
              required
            />

            <CpfInput
              type="text"
              id="cpf"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-lg"
              placeholder="CPF"
              required
              errors={fieldErrors}
            />

            <PhoneInput
              type="tel"
              id="phone"
              max={1}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-lg"
              placeholder="Telefone"
              required
            />
          </div>
        </div>
        <div className="text-center mt-10">
          <Button
            size="lg"
            variant="default"
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out text-xl"
          >
            Cadastrar
          </Button>
        </div>
      </form>
    </div>
  );
};
