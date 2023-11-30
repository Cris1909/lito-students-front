import { IPayment, IUser, ISubject } from '.';
import { AppointmentStatus } from '../enums';

export interface IAppointment {
  _id: string;
  date: string | Date;
  hours: number[];
  description: string;
  teacher: IUser;
  user: IUser;
  subject: ISubject;
  status: AppointmentStatus;
  payment?: IPayment;
  data?: IDataAppointment[]
}

export interface IDataAppointment {
  text: string;
  url: string;
}
