export interface Inventory {
  team: string;
  user: string;
  checkIn: number;
  checkOut: number;
  workTime: string;
  workState: string;
  homeWork: string;
  key: number;
}

export interface InventoryState {
  readonly loading: boolean;
  readonly data: Inventory[];
  readonly update: Inventory[];
  readonly errors?: string;
}

/** Type of action that can be sent */
export const FETCH_SUCCESS = '@@inventory/FETCH_SUCCESS';
export const FETCH_UPDATE = '@@inventory/FETCH_UPDATE';
export const FETCH_ERROR = '@@inventory/FETCH_ERROR';
