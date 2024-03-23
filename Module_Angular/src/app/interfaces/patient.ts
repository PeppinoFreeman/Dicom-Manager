export interface IPatient {
  name: string;
  surname: string;
  birthdate: Date;
  sex: Sex;
}

export enum Sex {
  F,
  M,
  O,
}
