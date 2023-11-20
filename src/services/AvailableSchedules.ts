import { IAvailableSchedule } from '../interfaces';
import ServiceClass from './ServiceClass';

interface ICreateAvailableSchedule {
date: string;
hours: number[]
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

 
  
}

export default new AvailableSchedulesService();
