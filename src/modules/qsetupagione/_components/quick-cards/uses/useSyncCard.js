import Vue, { computed, reactive } from 'vue'

export default function useSyncCard(props){
	let button = reactive({
		disable: false,
		loading: false,
		}
	);
	
	const items = computed(()=> { props.items ? props.items : [] });
	const loadingButton = computed(() => button.loading);	
	const isSyncing = computed( () => props.items?.plainValue == 1 ? true : false )
	const disableButton = computed(() => button.disable || isSyncing.value );
	const lastSync = computed(() =>  props.items?.options?.lastSync ?  props.items.options.lastSync : '');
	const syncedByName = computed(() => props.items?.options?.syncedByName ? props.items.options.syncedByName : '');
	const icon = computed(() => disableButton.value  ? 'fa-light fa-sync fa-spin' : 'fa-light fa-sync' );	
	
	function markAsSync (){
		return new Promise(async (resolve, reject) => {
			button.loading = true;
			button.disable = true;			
			Vue.prototype.$crud.create(props.cardParams.syncApiRoute, props.cardParams.syncRequestParams).then(response => {
				button.loading = false;
			}).catch(error => {              
				Vue.prototype.$apiResponse.handleError(error, () => {              
					Vue.prototype.$alert.error(error)
					resolve(error)
				})
			})
		})
	}
	return {
		disableButton,
		loadingButton,
		lastSync,
		markAsSync,
		isSyncing,
		icon,
		syncedByName
	}
}
