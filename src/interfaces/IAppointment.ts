import { ISubject } from './ISubject';
import { IUser } from './IUser';
import { AppointmentStatus } from '../enums';

export interface IAppointment {
  _id: string,
  date: string | Date,
  hours: number[],
  description: string,
  teacher: IUser,
  user: IUser,
  subject: ISubject,
  status: AppointmentStatus
}