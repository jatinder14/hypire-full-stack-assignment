export interface IMenuPayload {
  parent_id?: string;
  name: string;
  created_at: Date;
  menu_id: string;
  order: number;
  depth: number;
}
