export interface IAvailableSchedule {
  _id: string;
  teacherId: string;
  date: string | Date;
  hours: number[];
}
