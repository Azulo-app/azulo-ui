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
  AD_RECEIVER_ID,
  AD_CURRENCY_ID,
  AD_PERMONTH_ID,
  AD_TOTAL_ID,
  AUTO_DISTRIBUTION_ROW_ID,
  EDIT_ENTRY_BUTTON,
  REMOVE_ENTRY_BUTTON,
  SEND_ENTRY_BUTTON,
  generateColumns,
  AutoDistributionRow
} from 'src/routes/safe/components/AddressBook/AutoDistributions/columns'

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
import SuperfluidSDK from '@superfluid-finance/js-sdk'
import { getWeb3, web3ReadOnly } from 'src/logic/wallets/getWeb3'
import { CodeSharp } from '@material-ui/icons'
import { getERC20DecimalsAndSymbol } from 'src/logic/tokens/utils/tokenHelpers'

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
  const trustAddress = useSelector(safeParamAddressFromStateSelector)
  const { trackEvent } = useAnalytics()
  const columns = generateColumns()
  const autoColumns = columns.filter(({ custom }) => !custom)
  const addressBook = useSelector(addressBookSelector)
  const [selectedEntry, setSelectedEntry] = useState<Entry>(initialEntryState)
  const [editCreateEntryModalOpen, setEditCreateEntryModalOpen] = useState(false)
  const [deleteEntryModalOpen, setDeleteEntryModalOpen] = useState(false)
  const [sendFundsModalOpen, setSendFundsModalOpen] = useState(false)
  const [flowsLoader, setFlowsLoader] = useState<boolean>(true)
  const [flows, setFlows] = useState<any>(null)
  const dispatch = useDispatch()
  let flowData: AutoDistributionRow[] = [];

  const listFlows = async ({
    tokenAddress,
    account,
  }) => {
    const sf = new SuperfluidSDK.Framework({
      web3: web3ReadOnly,
    })

    await sf.initialize()
    const listflows = await sf.cfa.listFlows({
      superToken: tokenAddress,
      account: account,
    })
    flowData = []
    let nowDate = new Date()

    if (listflows && listflows.outFlows && listflows.outFlows.length > 0) {
      for (let i = 0; i < listflows.outFlows.length; i++) {
        // Get flow information
        const theFlow = await sf.cfa.getFlow({
          superToken: tokenAddress,
          sender: account,
          receiver: listflows.outFlows[i].receiver,
        })
        // Flow rate
        let niceFlowrate = ((listflows.outFlows[i].flowRate * 3600 * 24 * 30) / 1e18);

        // Get total flow
        let timepassed = (nowDate.getTime() - theFlow.timestamp.getTime()) / 1000;
        let totalFlow = ((timepassed * listflows.outFlows[i].flowRate) / 1e18);

        // Get token info
        let tokenInfo = await getERC20DecimalsAndSymbol(tokenAddress)

        // Get beneficiary name
        let getAddressBook = addressBook.find((address) => {
          return address.address === listflows.outFlows[i].receiver;
        })

        // Create table rows
        flowData.push({
          name: getAddressBook?.name || 'Wallet',
          receiver: listflows.outFlows[i].receiver,
          currency: tokenInfo.symbol,
          flowRate: niceFlowrate,
          autototal: totalFlow,
        });
      }
      setFlows(flowData)
      setFlowsLoader(false)
    }
0x0eEE37e52f6443E4E154e54f5E48e7eBe764D11C
  }

  useEffect(() => {
    trackEvent({ category: SAFE_NAVIGATION_EVENT, action: 'Beneficiaries Auto Distributions' })
  }, [trackEvent])

  useEffect(() => {
    listFlows(
      {
        tokenAddress: "0xa623b2DD931C5162b7a0B25852f4024Db48bb1A0",
        account: trustAddress,
      }
    )
  }, [flows])

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

  return (
    <>
      {flowsLoader && (
        <Block>
          <img style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '60px',
            height: 'auto',
            transform: 'translate(-50%, -50%)'
          }} src="/resources/azulo_icon_loader.svg" />
        </Block>
      )}
      {!flowsLoader && (
        <Block className={classes.formContainer}>
          <TableContainer>
            <Table
              columns={columns}
              data={flows}
              defaultFixed
              defaultRowsPerPage={25}
              disableLoadingOnEmptyTable
              label="Trustees"
              size={flows?.length || 0}
            >
              {(sortedData) =>
                sortedData.map((row, index) => {
                  const userOwner = isUserAnOwnerOfAnySafe(safesList, row.address)
                  const hideBorderBottom = index >= 3 && index === sortedData.size - 1 && classes.noBorderBottom
                  return (                    
                    <TableRow
                      className={cn(classes.hide, hideBorderBottom)}
                      data-testid={AUTO_DISTRIBUTION_ROW_ID}
                      key={index}
                      tabIndex={-1}
                    >
                      {autoColumns.map((column) => {
                        return (
                          <TableCell align={column.align} component="td" key={column.id} style={cellWidth(column.width)}>
                            {column.id === AD_RECEIVER_ID ? (
                              <Block justify="left">
                                <EthHashInfo
                                  hash={row[column.id]}
                                  shortenHash={4}
                                  showCopyBtn
                                  showAvatar
                                  explorerUrl={getExplorerInfo(row[column.id])}
                                />
                              </Block>
                            ) : column.id === AD_PERMONTH_ID || column.id === AD_TOTAL_ID ? (
                              Number.parseFloat(row[column.id]).toFixed(6)
                            ) : (
                              row[column.id]
                            )}
                          </TableCell>
                        )
                      })}
                      <TableCell component="td">
                        <Row align="end" className={classes.actions}>
                          <Img
                            alt="Stop stream"
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
                                Stream details
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
      )}
    </>
  )
}

export default AutoDistributions
