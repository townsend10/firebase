export type Pacient = {
  id?: string;
  name: string;
  email: string;
  birthdayDate: string;
  phone: string;
  cpf: string;
};

export type User = {
  id?: string;
  name: string;
  phone: string;
};

export type Schedule = {
  id?: string;
  pacientId: string;
  date: string;
  hour: string;
  status: "confirm" | "waiting" | "cancelled" | "none";
};
