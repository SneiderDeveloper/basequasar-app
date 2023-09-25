import baseService from '@imagina/qcrud/_services/baseService.js';
import {reactive} from 'vue';

interface StateComment {
    lastComment: string;
    loading: boolean;
}

const state = reactive<StateComment>({
    lastComment: '',
    loading: false, 
});

export async function getCommentsFilter(commentableId: number): Promise<void> {
    try {
        setLastComment('');
        state.loading = true;
        let requestParams = {
            refresh: true,
            params: {
                filter: {
                    "order": { "field": "id", "way": "desc" },
                    "commentableType": "Modules\\Ramp\\Entities\\WorkOrder",
                    "commentableId": commentableId
                },
                page: 1,
                take: 1
            }
        }
        const response = await baseService.index('apiRoutes.qramp.comments', requestParams);
        const comment = response.data.length > 0 ? response.data[0].comment : '';
        setLastComment(comment);
        setTimeout(() => {
            state.loading = false;
        }, 100);
    } catch (error) {
        setLastComment('');
        state.loading = false;
        console.log('getCommentsFilter::', error);
    }
}

export function getLastComment(): string {
    return state.lastComment;
}

export function getLoading(): boolean {
    return state.loading;
}

export function setLastComment(comment: string): void {
    state.lastComment = comment;
}