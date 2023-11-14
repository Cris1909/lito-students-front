import ServiceClass from './ServiceClass';

import { ISubject } from '../interfaces';

interface CreateSubject {
  name: string;
  img: string;
}

class SubjectsService extends ServiceClass {
  private path = 'subjects';

  async createSubject(body: CreateSubject) {
    return super.post<ISubject>({
      path: `${this.path}/create`,
      body,
      hasToken: true
    });
  }
}

export default new SubjectsService();
