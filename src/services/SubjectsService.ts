import ServiceClass from './ServiceClass';

import { ISubject } from '../interfaces';

interface ICreateSubject {
  name: string;
  img: string;
}

interface IUpdateSubject {
  _id: string;
  name?: string;
  img?: string;
  isActive: boolean;
}

class SubjectsService extends ServiceClass {
  private path = 'subjects';

  async createSubject(body: ICreateSubject) {
    return super.post<ISubject>({
      path: `${this.path}/create`,
      body,
      hasToken: true,
    });
  }

  async listAll() {
    return super.get<ISubject[]>({
      path: `${this.path}/list-all`,
      hasToken: true,
    });
  }

  async listActive() {
    return super.get<ISubject[]>({
      path: `${this.path}/list-active`,
      hasToken: true,
    });
  }

  async updateSubject({ _id, ...body }: IUpdateSubject) {
    return super.patch({
      path: `${this.path}/update/${_id}`,
      body,
      hasToken: true,
    });
  }
  
}

export default new SubjectsService();
