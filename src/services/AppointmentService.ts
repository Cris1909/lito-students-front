import ServiceClass from './ServiceClass';

import { IAppointment } from '../interfaces';

interface ICreateAppointment {
  date: string;
  hours: number[];
  description: string;
  teacher: string;
  subject: string;
}

class AppointmentService extends ServiceClass {
  private path = 'appointments';

  async createAppointment(body: ICreateAppointment) {
    return super.post<IAppointment>({
      path: `${this.path}/create`,
      body,
      hasToken: true,
    });
  }

  async listByWeek(date: Date | string) {
    const params = { date };
    return super.get<IAppointment[]>({
      path: `${this.path}/list-by-week`,
      params,
    });
  }

  async rejectAppointment(id: string, rejectMessage: string) {
   const body = {rejectMessage}
    return super.patch({
      path: `${this.path}/reject-appointment/${id}`,
      body
    });
  }

  async acceptAppointment(id: string, value: number) {
    const body = {value}
     return super.post({
       path: `${this.path}/approve-appointment/${id}`,
       body
     });
   }
}

export default new AppointmentService();
