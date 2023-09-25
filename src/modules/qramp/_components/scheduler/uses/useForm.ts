import { computed, ref, Ref, ComputedRef } from "vue";
import store from "../store/index.store";
import modelFormFields from "../models/formFields";
import workOrderList from "../../../_store/actions/workOrderList";
import { ModelFields } from "../contracts/formFields.contract";
import { Form } from "../contracts/store.contract";
import { UseForm } from "../contracts/useForm.contract";

/**
 * Custom hook to manage the form.
 *
 * @returns {UseForm} Object containing properties and methods related to the form.
 */
export default function useForm(): UseForm {
  /** @type {Ref<HTMLElement|null>} Reference to the scheduling form's DOM element */
  const refFormScheduler: Ref<HTMLElement | null> = ref(null);

  /** @type {Ref<HTMLElement|null>} Reference to the customer's DOM element */
  const refCustomer: Ref<HTMLElement | null> = ref(null);

  /** @type {ComputedRef<Form>} ComputedRef to access the form object from the store */
  const form: ComputedRef<Form> = computed(() => store.form);

  /** @type {ComputedRef<boolean>} ComputedRef for loading state from the store */
  const loading: ComputedRef<boolean> = computed(() => store.loading);

  /** @type {ComputedRef<boolean>} ComputedRef for update modal state from the store */
  const updateModal: ComputedRef<boolean> = computed(() => store.updateModal);

  /** @type {ModelFields} Form fields */
  const { formFields } = modelFormFields() as ModelFields;
  /**
   * Determines whether the form is bound to an inbound or outbound operation.
   *
   * @type {ComputedRef<{inbound: boolean, outbound: boolean}>} ComputedRef for binding state
   */
  const isbound: ComputedRef<{ inbound: boolean; outbound: boolean }> =
    computed(() => {
      if (form.value.operationTypeId) {
        const operationType = workOrderList()
          .getOperationTypeList()
          .find((item) => item.id === Number(form.value.operationTypeId));
        const type = operationType?.options?.type;
        if (type) {
          if (type === "full") {
            return { inbound: true, outbound: true };
          }
          if (type === "inbound") {
            return { inbound: true, outbound: false };
          }
          if (type === "outbound") {
            return { inbound: false, outbound: true };
          }
        }
      }
      return { inbound: false, outbound: false };
  });

  return {
    formFields,
    form,
    refFormScheduler,
    isbound,
    refCustomer,
    loading,
    updateModal,
  };
}
