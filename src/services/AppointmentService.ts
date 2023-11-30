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
      hasToken: true
    });
  }

  async rejectAppointment(id: string, rejectMessage: string) {
    const body = { rejectMessage };
    return super.patch({
      path: `${this.path}/reject-appointment/${id}`,
      body,
      hasToken: true
    });
  }

  async acceptAppointment(id: string, value: number) {
    const body = { value };
    return super.post({
      path: `${this.path}/approve-appointment/${id}`,
      body,
      hasToken: true
    });
  }

  async getById(id: string) {
    return super.get<IAppointment>({
      path: `${this.path}/appointment-by-id/${id}`,
      hasToken: true,
      
    });
  }

  async confirmAppointment(id: string) {
    return super.post({
      path: `${this.path}/confirm-appointment/${id}`,
      hasToken: true
    });
  }
}

export default new AppointmentService();
