import { ROUTES, Roles, Sections } from "../enums";

export interface ISection {
  path: Sections,
  name: string,
  Icon: any,
  children: ISectionChildren[],
  permissions: Roles[]
}

export interface ISectionChildren {
  path: ROUTES,
  name: string
}