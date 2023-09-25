export function SET_FORM_FLIGHT(state, data) {
  state.form = {
    ...state.form,
    ...data
  };
}
export function SET_FORM_SIGNATURE(state, data) {
  state.form = {
    ...state.form,
    ...data
  };
}
export function SET_FORM_STATUS_ID(state, value) {
  state.form = {
    ...state.form,
    ...value
  };
}