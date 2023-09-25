import { reactive } from 'vue';
import {
    CargoStoreContract,
    FormContract,
    DelayListContract,
    PayloadContract,
    UseCargoStoreContract
} from '../contracts/cargo.contract';
/* A model for the delayList array. */
const modelDelay = [
    {
        code: '',
        hours: ''
    },
];
/* Creating a reactive object. */
const state = reactive<CargoStoreContract>({
    form: {
        inboundCargoTotalUldsUnloaded: '',
        inboundCargoBulkUnloaded: '',
        outboundCargoTotalUldsLoaded: '',
        outboundCargoBulkLoaded: '',
        cargoTotalKilosLoaded: '',
        cargoTotalKilosUnloaded: '',
    },
    delayList: [...modelDelay],
    delay: false,
});
/**
 * It returns an object with a bunch of functions that are used to get and set the state of the store.
 * @returns {UseCargoStoreContract} A function that returns an object.
 */
export default function cargoStore(): UseCargoStoreContract {
    /**
     * &gt; It returns the form property of the state object.
     * @returns {FormContract} The form object.
     */
    function getForm(): FormContract {
        return state.form;
    }
    /**
     * It takes a FormContract object and sets the state.form object to the values of the FormContract
     * object.
     * @param {FormContract} cargo - FormContract
     */
    function setForm(cargo: FormContract): void {
        state.form.inboundCargoTotalUldsUnloaded = cargo['inboundCargoTotalUldsUnloaded'] ? cargo['inboundCargoTotalUldsUnloaded'].toString() : '';
        state.form.inboundCargoBulkUnloaded = cargo['inboundCargoBulkUnloaded'] ? cargo['inboundCargoBulkUnloaded'].toString() : '';
        state.form.outboundCargoTotalUldsLoaded = cargo['outboundCargoTotalUldsLoaded'] ? cargo['outboundCargoTotalUldsLoaded'].toString() : '';
        state.form.outboundCargoBulkLoaded = cargo['outboundCargoBulkLoaded'] ? cargo['outboundCargoBulkLoaded'].toString() : '';
        state.form.cargoTotalKilosLoaded = cargo['cargoTotalKilosLoaded'] ? cargo['cargoTotalKilosLoaded'].toString() : '';
        state.form.cargoTotalKilosUnloaded = cargo['cargoTotalKilosUnloaded'] ? cargo['cargoTotalKilosUnloaded'].toString() : '';
    }
    /**
     * This function returns the delayList property of the state object.
     * @returns {DelayListContract} The delayList array.
     */
    function getDelayList(): DelayListContract[] {
        return state.delayList;
    }
    /**
     * If the delay array is empty, set the delayList to the modelDelay array, otherwise set the
     * delayList to the delay array.
     * @param {DelayListContract[]} data - DelayListContract[]
     * @returns the state.delayList.
     */
    function setDelayList(data: DelayListContract[]): void {
        const modelData: any = [{
            code: '',
            hours: ''
        }];
        const delay = data['delay'] || [];
        if (delay.length === 0) {
            state.delayList = [...modelData];
            return;
        }
        const validateDelay = delay.length > 0;
        setDelay(validateDelay);
        state.delayList = validateDelay
            ? delay
            : [...modelData];
    }
    /**
     * The function `getDelay` returns a boolean value.
     * @returns {boolean} The value of the delay property of the state object.
    */
    function getDelay(): boolean {
        return state.delay;
    }
    /**
     * This function takes a boolean value and sets the delay property of the state object to that
     * value.
     * @param {boolean} value - The value to set the delay to.
     */
    function setDelay(value: boolean): void {
        state.delay = value;
    }
    /**
     * It returns an object with two properties, one of which is an array of objects.
     * @returns {PayloadContract} The payload function is returning an object with two properties.
     */
    function payload(): PayloadContract {
        const delay = state.delay ? state.delayList.filter(items => {
            return items.code && items.hours
        }) : [];
        return {
            delay,
            cargo: state.form,
        }
    }
    /**
     * It resets the state of the form and delayList to their default values.
     */
    function reset(): void {
        state.form = {
            inboundCargoTotalUldsUnloaded: '',
            inboundCargoBulkUnloaded: '',
            outboundCargoTotalUldsLoaded: '',
            outboundCargoBulkLoaded: '',
            cargoTotalKilosLoaded: '',
            cargoTotalKilosUnloaded: '',
        };
        const delayModel = [
            {
                code: '',
                hours: ''
            },
        ]
        state.delayList = [...delayModel];
        state.delay = false;
    }
    return {
        getForm,
        setForm,
        getDelayList,
        setDelayList,
        getDelay,
        setDelay,
        reset,
        payload,
    }
}