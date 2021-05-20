import { List } from 'immutable'
import { TableCellProps } from '@material-ui/core/TableCell/TableCell'

export const AUTO_DISTRIBUTION_ROW_ID = 'auto-distribution-row'
export const TX_TABLE_UTO_DISTRIBUTION_ID = 'idAutoDistribution'
export const AD_NAME_ID = 'name'
export const AD_RECEIVER_ID = 'receiver'
export const AD_CURRENCY_ID = 'currency'
export const AD_PERMONTH_ID = 'flowRate'
export const AD_TOTAL_ID = 'autototal'
export const AD_DISTRIBUTION_ACTIONS_ID = 'actions'
export const EDIT_ENTRY_BUTTON = 'edit-entry-btn'
export const REMOVE_ENTRY_BUTTON = 'remove-entry-btn'
export const SEND_ENTRY_BUTTON = 'send-entry-btn'

type AutoDistributionColumn = {
  id: string
  order: boolean
  disablePadding?: boolean
  label: string
  width?: number
  custom?: boolean
  align?: TableCellProps['align']
}

export type AutoDistributionRow = {
  name: string
  receiver: string
  currency?: string
  flowRate: number
  autototal?: number
}

export const generateColumns = (): List<AutoDistributionColumn> => {
  const nameColumn = {
    id: AD_NAME_ID,
    order: false,
    disablePadding: false,
    label: 'Name',
    width: 150,
    custom: false,
    align: 'left',
  }

  const addressColumn = {
    id: AD_RECEIVER_ID,
    order: false,
    disablePadding: false,
    label: 'Address',
    custom: false,
    align: 'left',
  }

  const currencyColumn = {
    id: AD_CURRENCY_ID,
    order: false,
    disablePadding: false,
    label: 'Currency',
    custom: false,
    align: 'left',
  }

  const perMonthColumn = {
    id: AD_PERMONTH_ID,
    order: false,
    disablePadding: false,
    label: 'Distribution/month',
    custom: false,
    align: 'left',
  }

  const totalColumn = {
    id: AD_TOTAL_ID,
    order: false,
    disablePadding: false,
    label: 'Total distribution',
    custom: false,
    align: 'left',
  }

  const actionsColumn = {
    id: AD_DISTRIBUTION_ACTIONS_ID,
    order: false,
    disablePadding: false,
    label: '',
    custom: true,
  }

  return List([nameColumn, addressColumn, currencyColumn, perMonthColumn, totalColumn, actionsColumn])
}
