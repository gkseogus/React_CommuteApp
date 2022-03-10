export interface Inventory {
  team: string;
  user: string;
  checkIn: number;
  checkOut: number;
  workTime: string;
  workState: string;
  working: string;
}

// 전송 가능한 액션 유형 (type은 const로 하는게 좋다)
export const FETCH_SUCCESS = "@@inventory/FETCH_SUCCESS"; // 성공적인 응답
export const FETCH_ERROR = "@@inventory/FETCH_ERROR"; // 에러
export const CHECK_IN = "@@inventory/CHECK_IN"; // 체크인
export const CHECK_OUT = "@@inventory/CHECK_OUT"; // 체크아웃

export interface InventoryState {
  readonly loading: boolean;
  readonly data: Inventory[];
  readonly errors?: string;
}
