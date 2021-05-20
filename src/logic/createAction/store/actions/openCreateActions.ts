import { createAction } from 'redux-actions'

import { OpenCreateActionPayload } from 'src/logic/createAction/store/reducer/createActions'

export const OPEN_CREATE_ACTION = 'OPEN_CREATE_ACTION'

export const openCreateAction = createAction<OpenCreateActionPayload>(OPEN_CREATE_ACTION)
