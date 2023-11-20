import { IAvailableSchedule } from '../interfaces';
import ServiceClass from './ServiceClass';

interface ICreateAvailableSchedule {
  date: string;
  hours: number[];
}

class AvailableSchedulesService extends ServiceClass {
  private path = 'available-schedules';

  async createAvailableSchedule(body: ICreateAvailableSchedule) {
    return super.post<IAvailableSchedule>({
      path: `${this.path}/create`,
      body,
      hasToken: true,
    });
  }

  async listByWeek(date: Date | string) {
    const params = { date };
    return super.get<IAvailableSchedule[]>({
      path: `${this.path}/list-by-week`,
      params,
    });
  }
}

export default new AvailableSchedulesService();
