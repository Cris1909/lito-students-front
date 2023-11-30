export enum PaymentStatus {
  PENDING = 'pending',
  DENIED = 'denied',
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
}

export const PaymentStatusText = {
  [PaymentStatus.PENDING]: 'Pendiente',
  [PaymentStatus.DENIED]: 'Rechazado',
  [PaymentStatus.CONFIRMED]: 'Confirmado',
  [PaymentStatus.CANCELED]: 'Completado',
};
