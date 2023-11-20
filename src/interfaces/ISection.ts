import { ROUTES, Sections } from "../enums";

export interface ISection {
  path: Sections,
  name: string,
  Icon: any,
  children: ISectionChildren[]
}

export interface ISectionChildren {
  path: ROUTES,
  name: string
}