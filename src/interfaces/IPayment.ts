import { PaymentStatus } from "../enums";

export interface IPayment {
  status: PaymentStatus;
  value: number;
  appointment: string;
}