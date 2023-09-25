import {Ref, ComputedRef} from 'vue';
import { FormFields } from './formFields.contract'
import { Form } from './store.contract';

export interface UseForm {
    refFormScheduler: Ref<HTMLElement | null>;
    refCustomer: Ref<HTMLElement | null>;
    form: ComputedRef<Form>;
    loading: ComputedRef<boolean>;
    updateModal: ComputedRef<boolean>;
    formFields: ComputedRef<FormFields>;
    isbound: ComputedRef<{ inbound: boolean; outbound: boolean }>;
}