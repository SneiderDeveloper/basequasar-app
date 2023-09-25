import Vue, { computed, getCurrentInstance, ComputedRef } from 'vue';
import store from '../store/filters.store'
import {
    ModelActionsModalResult, 
    Action, 
    Proxy
} from '../contracts/modelActionsModal.contract';

export default function modelActionsModal(): ModelActionsModalResult {
    const proxy = (getCurrentInstance() as any).proxy as Proxy;
    const actions: ComputedRef<Action[]> = computed(() => ([
        {
            props: {
                loading: store.loading,
                color: 'primary',
                label: Vue.prototype.$tr('isite.cms.label.search'),
            },
            action: () => {
                // add action
            }
        },
    ]));

    return {
        actions
    }
}