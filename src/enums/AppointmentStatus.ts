export enum AppointmentStatus {
  SOLICITED = 'solicited',
  PENDING = 'pending',
  REJECTED = 'rejected',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
}

export const AppointmentStatusText = {
  [AppointmentStatus.SOLICITED]: 'Solicitado',
  [AppointmentStatus.PENDING]: 'Pendiente',
  [AppointmentStatus.REJECTED]: 'Rechazado',
  [AppointmentStatus.CONFIRMED]: 'Confirmado',
  [AppointmentStatus.COMPLETED]: 'Completado',
};
