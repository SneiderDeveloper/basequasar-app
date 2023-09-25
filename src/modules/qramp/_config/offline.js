import workOrderList from '../_store/actions/workOrderList.ts';
import cache from "@imagina/qsite/_plugins/cache";


export default async function (refresh = false) {
  await workOrderList().getAllList(refresh);
}
