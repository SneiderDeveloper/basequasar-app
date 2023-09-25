import moment, { Moment } from "moment";

export interface Columns {
  isDrag: boolean;
  date: Moment; // You can adjust the type to match your use case
  cards: any[]; // Replace 'any' with the actual card type
  page: number;
  loading: boolean;
  total: number;
  completed: number;
  uncompleted: number;
}

export interface State {
  scheduleType: string;
  isDraggingCard: boolean;
  columns: Columns[];
  loading: boolean;
  dragDate: string;
  isBlank: boolean;
  filterCompany?: number;
  isAppOffline: boolean;
}
