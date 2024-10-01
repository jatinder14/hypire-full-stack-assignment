export interface IMenuItem {
  parent_id?: string | null;
  name: string;
  menu_id: string;
  depth: number;
  children: IMenuItem[];
}

export type ICreateMenuItemPayload = Omit<IMenuItem, "children">;
