import Vue, { computed, reactive, onMounted, ComputedRef, watch } from 'vue';
import qRampStore from '../../../_store/qRampStore.js'
import workOrderList from '../../../_store/actions/workOrderList';
import { FormState, FieldConfig } from '../contracts/customers.contract';

/**
 * Hook to manage customer fields in a form.
 *
 * @param {any} props - The component props containing the `dataForm` property.
 * @returns {Object} An object containing various functions and reactive state for managing customer fields.
 */
export default function useCustomerField(props: any) {
    const dataForm = computed(() => props.dataForm);
    const addNewOptions = computed(() => props.addNewOptions);
    const readonly = computed(() => props.readonly);
    // Reactive state for the form fields and additional data.
    const state = reactive<FormState>({
        newCustumerAdHoc: [],
        bannerMessage: null,
        customerName: '',
        selectCustomers: '',
    })

    // Computed property to generate the field configuration.
    const fields: ComputedRef<FieldConfig> = computed(() => ({
        // Banner field configuration
        banner: {
            type: "banner",
            props: {
                color: "info",
                icon: "fas fa-exclamation-triangle",
                message: state.bannerMessage,
            },
        },
        // Customer ID select field configuration
        customerId: {
            value: '',
            type: 'select',
            help: {
                description: 'You can add a new customer to the list if it\'s not available. Type the Customer Name and click on "Create new customer". The Work Order will be created as Ad-Hoc.'
            },
            props: {
                rules: [
                    val => !!val || Vue.prototype.$tr('isite.cms.message.fieldRequired')
                ],
                label: `*${Vue.prototype.$tr('ifly.cms.form.customer')}`,
                clearable: true,
                color: "primary",
                'hide-bottom-space': false,
                emitValue: false,
                options: state.newCustumerAdHoc,
                readonly: readonly.value
            },
            // Load options asynchronously using `workOrderList().getCustomerWithContract`.
            loadOptions: {
                delayed: workOrderList().getCustomerWithContract,
            },
            label: Vue.prototype.$tr('ifly.cms.form.customer'),
        }
    }))

    /**
     * Adds a new customer to the list.
     * If the `customerName` is not empty, it creates a new customer with the provided name.
     */
    function addCustumers(): void {
        // Add the new customer to the list if `customerName` is not empty.
        if (state.customerName !== "") {
            const id = `customer-${qRampStore().numberInRange(8000, 1000)}`;
            state.newCustumerAdHoc = [{ id, label: state.customerName, value: state.customerName }];
            state.bannerMessage = Vue.prototype.$tr("ifly.cms.message.requestNewCustomer");
            state.selectCustomers = {
                id,
                value: state.customerName,
                label: state.customerName,
            };
            if(addNewOptions.value) {
                dataForm.value.customCustomerName = state.customerName;
            }
            dataForm.value.customerId = null;
            dataForm.value.contractId = null;
            state.customerName = "";
            return;
        }
        // Show an error alert if `customerName` is empty.
        Vue.prototype.$alert.error({
            message: Vue.prototype.$tr("ifly.cms.message.orderaddNewrecord"),
        });
    }

    /**
     * Sets the customer based on the selected option in the customerId field.
     * Updates the reactive state and the dataForm.
     */
    function setCustomer(): void {
        // Get the selected customer object from the state.
        const selectCustomers: any =
            (state.selectCustomers === null
                || state.selectCustomers === undefined
                || state.selectCustomers === '')
                ? {} : state.selectCustomers;
        if(addNewOptions.value) {
            const customCustomerName = selectCustomers.label || null;
            // Set the custom customer name and customer ID in the dataForm.
            dataForm.value.customCustomerName = dataForm.value.customerId
                ? null
                : customCustomerName;
        }       
        
        dataForm.value.customerId = selectCustomers.id || null;
        dataForm.value.contractId = selectCustomers.contractId || null;
        let message = null;
        // Set the banner message based on whether a customer is selected or not.
        if (Object.keys(selectCustomers).length > 0) {
            message = dataForm.value.contractId
                ? `${Vue.prototype.$tr("ifly.cms.message.selectedCustomerWithContract")}`
                : Vue.prototype.$tr("ifly.cms.message.selectedCustomerWithoutContract");
        }

        state.bannerMessage =
            selectCustomers && !dataForm.value.contractId ? message : null;
    }

    /**
     * Sets the `customerName` in the state based on the query string.
     * @param {string} query - The query string representing the customer name.
     */
    function setCustomerName(query: string): void {
        state.customerName = query || "";
    }

    /**
     * Initializes the form with data for the selected customer (if any).
     * Retrieves customer details and sets them in the state and dataForm.
     */
    async function init(): Promise<void> {
        const customer = await workOrderList().getCustomerWithContractLists().find(item => item.id == dataForm.value.customerId);
        if (customer) {
            customer.label = dataForm.value.adHoc ? `${customer.label} (Ad Hoc)` : customer.label;
            if (customer.label) {
                state.selectCustomers = customer;
            }
        }
        await setCustomer();
    }
    watch(dataForm, async (newValue, oldValue) => {
        await init();
    },{ deep: true });
    // Execute the `init` function when the component is mounted.
    onMounted(async () => {
        await init();
    })

    return {
        fields,
        state,
        addCustumers,
        setCustomerName,
        setCustomer,
    }
}