import { Map } from 'immutable'
import { handleActions } from 'redux-actions'
import { OPEN_CREATE_ACTION } from 'src/logic/createAction/store/actions/openCreateActions'
import { AppReduxState } from 'src/store'

export const CREATE_ACTION_REDUCER_ID = 'createAction'

export type OpenCreateActionPayload = { createActionOpen: boolean; createAction?: string }

export default handleActions<AppReduxState['createAction'], OpenCreateActionPayload>(
  {
    [OPEN_CREATE_ACTION]: (state, action) => {
      const { createAction = '', createActionOpen } = action.payload
      return state.set('createActionOpen', { createAction, createActionOpen })
    },
  },
  Map(),
)
