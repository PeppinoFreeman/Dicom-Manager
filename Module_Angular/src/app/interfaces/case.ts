import { Sex } from './patient';

export interface ICase {
  id: string;
  name: string;
  surname: string;
  sex: Sex;
  birthdate: Date;
  dicomUrl: string[];
}
