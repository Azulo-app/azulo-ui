import React, { ReactElement, useEffect, useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { EthHashInfo, Text } from '@gnosis.pm/safe-react-components'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import cn from 'classnames'
import { getExplorerInfo } from 'src/config'
import Table from 'src/components/Table'
import { cellWidth } from 'src/components/Table/TableHead'
import Block from 'src/components/layout/Block'
import Img from 'src/components/layout/Img'
import { styles } from '../style'
import {
  AB_ADDRESS_ID,
  ADDRESS_BOOK_ROW_ID,
  EDIT_ENTRY_BUTTON,
  REMOVE_ENTRY_BUTTON,
  SEND_ENTRY_BUTTON,
  generateColumns,
} from 'src/routes/safe/components/AddressBook/columns'

import SuperfluidSDK from '@superfluid-finance/js-sdk'
import { addressBookSelector } from 'src/logic/addressBook/store/selectors'
import { AddressBookEntry, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addAddressBookEntry } from 'src/logic/addressBook/store/actions/addAddressBookEntry'
import { removeAddressBookEntry } from 'src/logic/addressBook/store/actions/removeAddressBookEntry'
import { updateAddressBookEntry } from 'src/logic/addressBook/store/actions/updateAddressBookEntry'
import { CreateEditEntryModal } from 'src/routes/safe/components/AddressBook/CreateEditEntryModal'
import CallMadeIcon from '@material-ui/icons/CallMade'
import RenameOwnerIcon from 'src/routes/safe/components/Settings/ManageOwners/assets/icons/rename-owner.svg'
import RemoveOwnerIcon from 'src/routes/safe/components/Settings/assets/icons/bin.svg'
import Row from 'src/components/layout/Row'
import { isUserAnOwnerOfAnySafe, sameAddress } from 'src/logic/wallets/ethAddresses'
import Button from 'src/components/layout/Button'
import { useAnalytics, SAFE_NAVIGATION_EVENT } from 'src/utils/googleAnalytics'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { addressBookQueryParamsSelector, safesListSelector, safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { mainStyles } from 'src/theme/PageStyles'
import { checksumAddress } from 'src/utils/checksumAddress'

const useStyles = makeStyles(styles)

interface AddressBookSelectedEntry extends AddressBookEntry {
  isNew?: boolean
}

export type Entry = {
  entry: AddressBookSelectedEntry
  index?: number
  isOwnerAddress?: boolean
}

const initialEntryState: Entry = { entry: { address: '', name: '', isNew: true } }

const AutoDistributions = (): React.ReactElement => {
  const mainClasses = mainStyles()
  const classes = useStyles()
  const entryAddressToEditOrCreateNew = useSelector(addressBookQueryParamsSelector)
  const granted = useSelector(grantedSelector)
  const safesList = useSelector(safesListSelector)
  const { trackEvent } = useAnalytics()
  const columns = generateColumns()
  const autoColumns = columns.filter(({ custom }) => !custom)
  const addressBook = useSelector(addressBookSelector)
  const [selectedEntry, setSelectedEntry] = useState<Entry>(initialEntryState)
  const [editCreateEntryModalOpen, setEditCreateEntryModalOpen] = useState(false)
  const [deleteEntryModalOpen, setDeleteEntryModalOpen] = useState(false)
  const [sendFundsModalOpen, setSendFundsModalOpen] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    trackEvent({ category: SAFE_NAVIGATION_EVENT, action: 'Beneficiaries Auto Distributions' })
  }, [trackEvent])

  useEffect(() => {
    if (entryAddressToEditOrCreateNew) {
      setEditCreateEntryModalOpen(true)
    }
  }, [entryAddressToEditOrCreateNew])

  useEffect(() => {
    if (entryAddressToEditOrCreateNew) {
      const address = checksumAddress(entryAddressToEditOrCreateNew)
      const oldEntryIndex = addressBook.findIndex((entry) => sameAddress(entry.address, address))

      if (oldEntryIndex >= 0) {
        // Edit old entry
        setSelectedEntry({ entry: addressBook[oldEntryIndex], index: oldEntryIndex })
      } else {
        // Create new entry
        setSelectedEntry({
          entry: {
            name: '',
            address,
            isNew: true,
          },
        })
      }
    }
  }, [addressBook, entryAddressToEditOrCreateNew])

  const newStreamModalHandler = (entry: AddressBookEntry) => {
    setEditCreateEntryModalOpen(false)
    const checksumEntries = {
      ...entry,
      address: checksumAddress(entry.address),
    }
    dispatch(addAddressBookEntry(makeAddressBookEntry(checksumEntries)))
  }

  const createStreamModalHandler = (entry: AddressBookEntry) => {
    setSelectedEntry(initialEntryState)
    setEditCreateEntryModalOpen(false)
    const checksumEntries = {
      ...entry,
      address: checksumAddress(entry.address),
    }
    dispatch(updateAddressBookEntry(makeAddressBookEntry(checksumEntries)))
  }

  return (
    <>
      <Block className={classes.formContainer}>
        <TableContainer>
          <Table
            columns={columns}
            data={addressBook}
            defaultFixed
            defaultRowsPerPage={25}
            disableLoadingOnEmptyTable
            label="Trustees"
            size={addressBook?.length || 0}
          >
            {(sortedData) =>
              sortedData.map((row, index) => {
                const userOwner = isUserAnOwnerOfAnySafe(safesList, row.address)
                const hideBorderBottom = index >= 3 && index === sortedData.size - 1 && classes.noBorderBottom
                return (
                  <TableRow
                    className={cn(classes.hide, hideBorderBottom)}
                    data-testid={ADDRESS_BOOK_ROW_ID}
                    key={index}
                    tabIndex={-1}
                  >
                    {autoColumns.map((column) => {
                      return (
                        <TableCell align={column.align} component="td" key={column.id} style={cellWidth(column.width)}>
                          {column.id === AB_ADDRESS_ID ? (
                            <Block justify="left">
                              <EthHashInfo
                                hash={row[column.id]}
                                showCopyBtn
                                showAvatar
                                explorerUrl={getExplorerInfo(row[column.id])}
                              />
                            </Block>
                          ) : (
                            row[column.id]
                          )}
                        </TableCell>
                      )
                    })}
                    <TableCell component="td">
                      <Row align="end" className={classes.actions}>
                        <Img
                          alt="Edit entry"
                          className={granted ? classes.editEntryButton : classes.editEntryButtonNonOwner}
                          onClick={() => {
                            setSelectedEntry({
                              entry: row,
                              isOwnerAddress: userOwner,
                            })
                            setEditCreateEntryModalOpen(true)
                          }}
                          src={RenameOwnerIcon}
                          testId={EDIT_ENTRY_BUTTON}
                        />
                        <Img
                          alt="Remove entry"
                          className={granted ? classes.removeEntryButton : classes.removeEntryButtonNonOwner}
                          onClick={() => {
                            setSelectedEntry({ entry: row })
                            setDeleteEntryModalOpen(true)
                          }}
                          src={RemoveOwnerIcon}
                          testId={REMOVE_ENTRY_BUTTON}
                        />
                        {granted ? (
                          <Button
                            className={`${mainClasses.mainButton} ${mainClasses.borderButton} ${classes.buttonIcon}`}
                            onClick={() => {
                              setSelectedEntry({ entry: row })
                              setSendFundsModalOpen(true)
                            }}
                            variant="contained"
                            data-testid={SEND_ENTRY_BUTTON}
                          >
                            <CallMadeIcon color="primary" />
                              Send
                          </Button>
                        ) : null}
                      </Row>
                    </TableCell>
                  </TableRow>
                )
              })
            }
          </Table>
        </TableContainer>
      </Block>
    </>
  )
}

export default AutoDistributions
