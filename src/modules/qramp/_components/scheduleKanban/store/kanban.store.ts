import {reactive, computed, ComputedRef} from 'vue';
import moment, { Moment } from 'moment';
import {Columns, State} from '../contracts/kanbanStore.contract'
import { COMPANY_PASSENGER, COMPANY_RAMP } from '../../model/constants';
import qRampStore from 'src/modules/qramp/_store/qRampStore';


const state: State = reactive({
  selectedDate: moment().format('YYYY/MM/DD'),
  scheduleType: 'week-agenda',
  isDraggingCard: false,
  columns: [],
  loading: false,
  dragDate: '',
  isBlank: false,
  isAppOffline: false,
});

const isPassenger = computed(() => qRampStore().getIsPassenger());

const store: State = computed(() => ({
  get scheduleType(): string {
    return state.scheduleType;
  },
  set scheduleType(value: string) {
    state.scheduleType = value;
  },
  get isDraggingCard(): boolean {
    return state.isDraggingCard;
  },
  set isDraggingCard(value: boolean) {
    state.isDraggingCard = value;
  },
  get columns(): Columns[] {
    return state.columns;
  },
  set columns(value: Columns[]) {
    state.columns = value;
  },
  get loading(): boolean {
    return state.loading;
  },
  set loading(value: boolean) {
    state.loading = value;
  },
  get dragDate(): string {
    return state.dragDate;
  },
  set dragDate(value: string) {
    state.dragDate = value;
  },
  get isBlank(): boolean {
    return state.isBlank;
  },
  set isBlank(value: boolean) {
    state.isBlank = value;
  },
  get isAppOffline(): boolean {
    return state.isAppOffline;
  },
  set isAppOffline(value: boolean) {
    state.isAppOffline = value;
  },
  get filterCompany(): number {
    return isPassenger.value ? COMPANY_PASSENGER : COMPANY_RAMP;
  },
})).value;

export default store;
