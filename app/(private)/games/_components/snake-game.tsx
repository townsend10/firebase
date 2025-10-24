"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z
  .object({
    name: z
      .string()
      .min(1, { message: "O nome é obrigatório." })
      .max(50, { message: "O nome deve ter no máximo 50 caracteres." }),
    email: z
      .string()
      .min(1, { message: "O e-mail é obrigatório." })
      .email({ message: "Formato de e-mail inválido." }),
    phone: z
      .string()
      .min(1, { message: "O telefone é obrigatório." })
      .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
        message: "Formato de telefone inválido. Ex: (XX) XXXXX-XXXX",
      }),
    password: z
      .string()
      .min(8, { message: "A senha deve ter no mínimo 8 caracteres." })
      .regex(/[0-9]/, { message: "A senha deve conter pelo menos um número." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "A senha deve conter pelo menos um caractere especial.",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "A confirmação de senha é obrigatória." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export const RegisterPage = () => {
  const {
    register,
    handleSubmit,

    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const onSubmit = (data: any) => {
    console.log("Dados do formulário:", data);
    // Aqui você faria a integração com o seu backend para cadastrar o usuário
    // Por exemplo, uma chamada API: api.registerUser(data);

    // Simula um cadastro bem-sucedido
    setRegistrationSuccess(true);
    reset(); // Limpa o formulário após o sucesso

    // Opcional: Esconde a mensagem de sucesso após alguns segundos
    setTimeout(() => {
      setRegistrationSuccess(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Cadastrar Usuário
        </h2>

        {registrationSuccess && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Sucesso!</strong>
            <span className="block sm:inline ml-2">
              Usuário cadastrado com sucesso.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nome
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Seu nome completo"
            />

            {errors.name?.message && (
              <p className="mt-1 text-sm text-red-600">
                {errors.name.message as string}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="seu.email@example.com"
            />
            {errors.email?.message && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message as string}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Telefone
            </label>
            <input
              id="phone"
              type="text"
              {...register("phone")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: (99) 99999-9999"
            />
            {errors.phone?.message && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message as string}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="********"
            />
            {errors.password?.message && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message as string}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="********"
            />
            {errors.confirmPassword?.message && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message as string}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
};
