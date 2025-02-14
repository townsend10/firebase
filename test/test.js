// import { collection } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { createPacientMedic } from "../actions/create-pacient-medic";

// // Mock do Firebase
// jest.mock("firebase/firestore", () => ({
//   __esModule: true,
//   collection: jest.fn(() => ({
//     addDoc: jest.fn(),
//   })),
// }));

// // Mock do Firebase Auth
// jest.mock("firebase/auth", () => ({
//   __esModule: true,
//   getAuth: jest.fn(() => ({
//     currentUser: {
//       // Simular usuário conectado
//       email: "michael_townsend@hotmail.com",
//     },
//   })),
// }));

// // Teste

// describe("createPacientMedic function", () => {
//   it("deve criar um paciente no banco de dados", async () => {
//     // Dados de entrada para o teste
//     const inputData = {
//       name: "John Doe",
//       cpf: "12345678901",
//       email: "john.doe@example.com",
//       birthdayDate: "1990-01-01",
//       phone: "123456789",
//     };

//     // Mock do retorno da função addDoc
//     // collection().addDoc.mockResolvedValueOnce({});

//     // Chamar a função e obter o resultado
//     const result = await createPacientMedic(inputData);

//     // Verificar se a função retorna dados e não um erro
//     expect(result.error).toBeFalsy();

//     // Verificar se a função foi chamada com os dados corretos
//     expect(collection).toHaveBeenCalledWith(expect.anything(), "pacient");
//     // expect(collection().addDoc).toHaveBeenCalledWith({
//     //   name: inputData.name,
//     //   cpf: inputData.cpf,
//     //   email: inputData.email,
//     //   birthdayDate: inputData.birthdayDate,
//     //   phone: inputData.phone,
//     //   created_at: expect.any(String), // Verificar se created_at é uma string
//     // });
//   });
// });
