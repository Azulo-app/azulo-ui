import { CREATE_ACTION_REDUCER_ID } from 'src/logic/createAction/store/reducer/createActions'

export const createActionOpen = (state) => state[CREATE_ACTION_REDUCER_ID].get('createActionOpen')
