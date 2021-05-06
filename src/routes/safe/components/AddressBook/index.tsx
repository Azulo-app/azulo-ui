import { makeStyles } from '@material-ui/core/styles'
import styled from 'styled-components'
import React, { ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, Redirect, Route, Switch, useLocation } from 'react-router-dom'

import { styles } from './style'

import { wrapInSuspense } from 'src/utils/wrapInSuspense'
import { TRUSTS_ADDRESS } from 'src/routes/routes'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import SendModal from 'src/routes/safe/components/Balances/SendModal'
import { CreateEditEntryModal } from 'src/routes/safe/components/AddressBook/CreateEditEntryModal'
import { AddressBookEntry, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addAddressBookEntry } from 'src/logic/addressBook/store/actions/addAddressBookEntry'
import { updateAddressBookEntry } from 'src/logic/addressBook/store/actions/updateAddressBookEntry'
import { addressBookSelector } from 'src/logic/addressBook/store/selectors'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { addressBookQueryParamsSelector, safesListSelector, safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { checksumAddress } from 'src/utils/checksumAddress'
import { useAnalytics, SAFE_NAVIGATION_EVENT } from 'src/utils/googleAnalytics'

import { mainStyles } from 'src/theme/PageStyles'
import { mainColor, borderRadius, border } from 'src/theme/variables'
import Button from 'src/components/layout/Button'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Divider from 'src/components/layout/Divider'

const ContentHold = styled.div`
  border: 1px solid ${border};
  padding: 32px;
  border-radius: ${borderRadius};
  margin-top: 25px;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  width: 100%;
  flex-direction: column;
  overflow: hidden;
`

const useStyles = makeStyles(styles)

const AutoDistributions = React.lazy(() => import('src/routes/safe/components/AddressBook/AutoDistributions'))
const Beneficiaries = React.lazy(() => import('src/routes/safe/components/AddressBook/Beneficiaries'))

interface AddressBookSelectedEntry extends AddressBookEntry {
  isNew?: boolean
}

const INITIAL_STATE = {
  erc721Enabled: false,
  showToken: false,
  sendFunds: {
    isOpen: false,
    selectedToken: '',
  },
  showReceive: false,
}

export type Entry = {
  entry: AddressBookSelectedEntry
  index?: number
  isOwnerAddress?: boolean
}

const initialEntryState: Entry = { entry: { address: '', name: '', isNew: true } }

const AddressBookTable = (): ReactElement => {
  const mainClasses = mainStyles()
  const classes = useStyles()
  const location = useLocation();
  const dispatch = useDispatch()
  const address = useSelector(safeParamAddressFromStateSelector)
  const entryAddressToEditOrCreateNew = useSelector(addressBookQueryParamsSelector)
  const addressBook = useSelector(addressBookSelector)
  const [selectedEntry, setSelectedEntry] = useState<Entry>(initialEntryState)
  const [editCreateEntryModalOpen, setEditCreateEntryModalOpen] = useState(false)
  const { trackEvent } = useAnalytics()
  const [state, setState] = useState(INITIAL_STATE)

  useEffect(() => {
    trackEvent({ category: SAFE_NAVIGATION_EVENT, action: 'Beneficiaries' })
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

  const newEntryModalHandler = (entry: AddressBookEntry) => {
    setEditCreateEntryModalOpen(false)
    const checksumEntries = {
      ...entry,
      address: checksumAddress(entry.address),
    }
    dispatch(addAddressBookEntry(makeAddressBookEntry(checksumEntries)))
  }

  const editEntryModalHandler = (entry: AddressBookEntry) => {
    setSelectedEntry(initialEntryState)
    setEditCreateEntryModalOpen(false)
    const checksumEntries = {
      ...entry,
      address: checksumAddress(entry.address),
    }
    dispatch(updateAddressBookEntry(makeAddressBookEntry(checksumEntries)))
  }

  const showSendFunds = (tokenAddress: string): void => {
    setState((prevState) => ({
      ...prevState,
      sendFunds: {
        isOpen: true,
        selectedToken: tokenAddress,
      },
    }))
  }

  const hideSendFunds = () => {
    setState((prevState) => ({
      ...prevState,
      sendFunds: {
        isOpen: false,
        selectedToken: '',
      },
    }))
  }

  const { erc721Enabled, sendFunds, showReceive } = state

  return (
    <>
      <Grid container alignItems="center">
        <Grid item className={mainClasses.accTitleHold}><div className={mainClasses.accTitle}>Beneficiary</div></Grid>
        <Box flexGrow={1}><div className={mainClasses.accDesc}>View and manage beneficiaries of your trust and distributions</div></Box>
        <Grid item>
          <Button className={mainClasses.mainButton} onClick={() => {
                setSelectedEntry(initialEntryState)
                setEditCreateEntryModalOpen(true)
              }} variant="contained">
            + Add beneficiary
          </Button>
        </Grid>
      </Grid>
      <ContentHold>
        <Row align="center">
          <Grid container className={classes.assetTabs} direction="row" justify="flex-start" alignItems="center">
            <Grid item xs={6} container>
              <NavLink
                to={`${TRUSTS_ADDRESS}/${address}/beneficiaries`}
                activeClassName={classes.assetTabActive}
                className={classes.assetTab}
                data-testid={'list-assets-btn'}
                exact
              >
                List
              </NavLink>
              <Divider className={classes.assetDivider} />
              <NavLink
                to={`${TRUSTS_ADDRESS}/${address}/beneficiaries/auto-distributions`}
                className={classes.assetTab}
                activeClassName={classes.assetTabActive}
                data-testid={'distributions-assets-btn'}
                exact
              >
                Auto Distributions
              </NavLink>
            </Grid>
            {
              (location.pathname == `${TRUSTS_ADDRESS}/${address}/beneficiaries/auto-distributions`) ? (
              <>
                <Grid item xs={6} container justify="flex-end">
                  <Button className={`${mainClasses.mainButton} ${mainClasses.borderButton}`}
                      onClick={() => {
                        showSendFunds(address)
                      }} variant="contained">
                    + Add distribution
                  </Button>
                </Grid>
              </>
              ) : null
            }
          </Grid>
        </Row>
        <Switch>
          <Route
            path={`${TRUSTS_ADDRESS}/${address}/beneficiaries/auto-distributions`}
            exact
            render={() => {
              return wrapInSuspense(<AutoDistributions />)
            }}
          />
          <Route
            path={`${TRUSTS_ADDRESS}/${address}/beneficiaries`}
            render={() => {
              return wrapInSuspense(<Beneficiaries />)
            }}
          />
        </Switch>
      </ContentHold>
      <CreateEditEntryModal
        editEntryModalHandler={editEntryModalHandler}
        entryToEdit={selectedEntry}
        isOpen={editCreateEntryModalOpen}
        newEntryModalHandler={newEntryModalHandler}
        onClose={() => setEditCreateEntryModalOpen(false)}
      />
      <SendModal
        activeScreenType="sendFunds"
        isOpen={sendFunds.isOpen}
        onClose={hideSendFunds}
        selectedToken={sendFunds.selectedToken}
      />
    </>
  )
}

export default AddressBookTable
