import { AppointmentStatus } from './AppointmentStatus';

export enum Colors {
  SUCCESS = '#219653',
  CREAM = '#FFF0C9',
  PRIMARY_950 = '#162450',
  DANGER = '#D34053',

  AVAILABLE = '#00cc66',
  UNAVAILABLE = '#808080',
}

export const AppointmentColors = {
  [AppointmentStatus.SOLICITED]: '#87CEEB',
  [AppointmentStatus.PENDING]: '#FFD700',
  [AppointmentStatus.REJECTED]: '#FF6347',
  [AppointmentStatus.CONFIRMED]: '#008000',
  [AppointmentStatus.COMPLETED]: '#800080',
};
