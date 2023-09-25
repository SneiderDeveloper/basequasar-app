import { reactive } from 'vue';
/* Creating a reactive object. */
const state = reactive({
    form: {
        remark: '',
        safetyMessage: '',
    },
});

export default function remarkStore() {
    function getForm() {
        return state.form;
    }
    function setForm(remark): void {
        state.form.remark = remark['remark'] ? remark['remark'].toString() : '';
        state.form.safetyMessage = remark['safetyMessage'] ? remark['safetyMessage'].toString() : '';
    }
    /**
     * It resets the state of the form and delayList to their default values.
     */
    function reset(): void {
        state.form = {
            remark: '',
            safetyMessage: '',
        }
    }
    return {
        getForm,
        setForm,
        reset,
    }
}