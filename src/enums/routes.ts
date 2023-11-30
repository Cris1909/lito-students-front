import { Sections } from '.';

export enum ROUTES {
  SIGNIN = `/${Sections.AUTH}/signin`,
  SIGNUP = `/${Sections.AUTH}/signup`,
  DASHBOARD = `/${Sections.DASHBOARD}`,
  CREATE_SUBJECT = `/${Sections.SUBJECTS}/create`,
  LIST_SUBJECTS = `/${Sections.SUBJECTS}/list`,
  CREATE_AVAILABLE_SCHEDULES = `/${Sections.AVAILABLE_SCHEDULES}/create`,
  STATISTICS = `/${Sections.STATISTICS}/get`,
}
