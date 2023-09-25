import Vue from 'vue';
import {WorkOrders} from '../contracts/getWorkOrder.contract'
import filtersStore from '../store/filters.store'
import qRampStore from 'src/modules/qramp/_store/qRampStore';
import { BUSINESS_UNIT_PASSENGER, BUSINESS_UNIT_RAMP } from '../../model/constants';

export default function getWorkOrders(refresh = false, page = 1, date): WorkOrders {
    try {
        const isPassenger = qRampStore().getIsPassenger();
        const businessUnitId = isPassenger ? BUSINESS_UNIT_PASSENGER : BUSINESS_UNIT_RAMP;
        const params = {
            refresh,
            params: {
                take: 10,
                page,
                filter: {
                    businessUnitId,
                    ...filtersStore.payload,
                    date,
                    withoutDefaultInclude: true,
                    order: {
                        field: "schedule_date",
                        way: "asc",
                    },
                },
            },
        };
        const response = Vue.prototype.$crud.index(
            "apiRoutes.qramp.workOrders",
            params,

        );
        return response;
    } catch (error) {
        console.log(error);
        return {
            data: [],
            meta: {
                page: {
                    total: 0,
                    HasNextPage: false,
                    HasPreviousPage: false,
                    currentPage: 1,
                    perPage: 1
                }
            }
        }
    }
}
