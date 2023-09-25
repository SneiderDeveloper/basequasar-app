import { reactive } from 'vue';
import baseService from '@imagina/qcrud/_services/baseService.js'

const modelContract = {
    contractName: null,
    customer: {
        customerName: null,
    },
    contractStatus: {
        statusName: null,
    },
    costCenter: {
        name: null,
    },
    workdayId: null,
    worktag: null,
};

const state = reactive({
    visibleContract: false,
    modalProps: {},
    basicDataContract: {...modelContract},
    modalLoadingContract: false,
    contractLineList: [],
    contractId: null,
});

export default function qSetupStore() {
    function hideVisibleContract() {
        state.visibleContract = false;
    }
    function showVisibleContract() {
        state.visibleContract = true;
    }
    function getVisibleContract() {
        return state.visibleContract;
    }
    function setVisibleContract(value) {
        state.visibleContract = value;
    }
    function setModalProps(value) {
        state.modalProps = value;
    }
    function getModalProps() {
        return state.modalProps;
    }
    function showBasicDataContract(contractId) {
        showModalLoadingContract();
        baseService.show('apiRoutes.qsetupagione.contracts', contractId,
         {
            refresh: true,
            params: {
                include: "contractLines,contractType,contractStatus,costCenter"
            }
         }).then((item) => {
            setBasicDataContract(item.data);
            hideModalLoadingContract();
        }).catch((err) => {
            hideModalLoadingContract();
            console.log(err);
        });
    }
    function setBasicDataContract(data) {
        state.basicDataContract = data;
        state.basicDataContract.customer = data.customer ? data.customer : modelContract.customer;
        state.basicDataContract.contractStatus = data.contractStatus ? data.contractStatus : modelContract.contractStatus;
        state.basicDataContract.costCenter = data.costCenter ? data.costCenter : modelContract.costCenter;
        setContractLineList(data.contractLines || []);
    }
    function getBasicDataContract() {
        return state.basicDataContract;
    }
    function getModalLoadingContract() {
        return state.modalLoadingContract;
    }
    function hideModalLoadingContract() {
        state.modalLoadingContract = false;
    }
    function showModalLoadingContract() {
        state.modalLoadingContract = true;
    } 
    function resetBasicDataContract() {
        state.basicDataContract = {...modelContract};
    }
    function setContractLineList(data) {
        state.contractLineList = data;
    }
    function getContractLineList() {
        return state.contractLineList;
    }
    function getContractId() {
        return state.contractId;
    }
    function setContractId(contractId) {
        state.contractId = contractId;
    }
    return {
        hideVisibleContract,
        showVisibleContract,
        getVisibleContract,
        setVisibleContract,
        getModalProps,
        setModalProps,
        getBasicDataContract,
        showBasicDataContract,
        hideModalLoadingContract,
        showModalLoadingContract,
        getModalLoadingContract,
        setBasicDataContract,
        resetBasicDataContract,
        setContractLineList,
        getContractLineList,
        getContractId,
        setContractId,
    }
}