import { GenericModal, Loader } from '@gnosis.pm/safe-react-components'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch, useRouteMatch, NavLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { styles } from './style'

import {
  safeFeaturesEnabledSelector,
  safeNameSelector,
  safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { useFetchTokens } from 'src/logic/safe/hooks/useFetchTokens'
import { wrapInSuspense } from 'src/utils/wrapInSuspense'
import { TRUSTS_ADDRESS } from 'src/routes/routes'
import { FEATURES } from 'src/config/networks/network.d'
import { LoadingContainer } from 'src/components/LoaderContainer'
import { ListItemType } from 'src/components/List'
import Grid from '@material-ui/core/Grid'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import Divider from 'src/components/layout/Divider'

export const BALANCES_TAB_BTN_TEST_ID = 'balances-tab-btn'
export const SETTINGS_TAB_BTN_TEST_ID = 'settings-tab-btn'
export const APPS_TAB_BTN_TEST_ID = 'apps-tab-btn'
export const TRANSACTIONS_TAB_BTN_TEST_ID = 'transactions-tab-btn'
export const ADDRESS_BOOK_TAB_BTN_TEST_ID = 'address-book-tab-btn'
export const SAFE_VIEW_NAME_HEADING_TEST_ID = 'safe-name-heading'
export const TRANSACTIONS_TAB_NEW_BTN_TEST_ID = 'transactions-tab-new-btn'

const Apps = React.lazy(() => import('src/routes/safe/components/Apps'))
const Settings = React.lazy(() => import('src/routes/safe/components/Settings'))
const Balances = React.lazy(() => import('src/routes/safe/components/Balances'))
const TxList = React.lazy(() => import('src/routes/safe/components/Transactions/TxList'))
const AddressBookTable = React.lazy(() => import('src/routes/safe/components/AddressBook'))

const useStyles = makeStyles(styles)

const Container = (): React.ReactElement => {
  const classes = useStyles()
  const featuresEnabled = useSelector(safeFeaturesEnabledSelector)
  const [modal, setModal] = useState({
    isOpen: false,
    title: null,
    body: null,
    footer: null,
    onClose: () => {},
  })
  
  const matchSafeWithAddress = useRouteMatch({ path: `${TRUSTS_ADDRESS}/:safeAddress` })
  const address = useSelector(safeParamAddressFromStateSelector)
  useFetchTokens(address)

  if (!featuresEnabled) {
    return (
      <LoadingContainer>
        <img
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '60px',
            height: 'auto',
            transform: 'translate(-50%, -50%)',
          }}
          src="/resources/azulo_icon_loader.svg"
        />
        {/* <Loader size="md" /> */}
      </LoadingContainer>
    )
  }

  const closeGenericModal = () => {
    if (modal.onClose) {
      modal.onClose?.()
    }

    setModal({
      isOpen: false,
      title: null,
      body: null,
      footer: null,
      onClose: () => {},
    })
  }

  return (
    <>
      <Grid container alignItems="center" className={classes.trustMenu}>
        <Grid item md={12}>
          <NavLink 
            to={`${TRUSTS_ADDRESS}/${address}/assets`}
            activeClassName={classes.trustMenuActive}
            data-testid={'assets-menu-link'}
          >
            Assets
          </NavLink >
          <NavLink 
            to={`${TRUSTS_ADDRESS}/${address}/beneficiaries`}
            activeClassName={classes.trustMenuActive}
            data-testid={'assets-menu-link'}
          >
            Beneficiaries
          </NavLink >
          <NavLink 
            to={`${TRUSTS_ADDRESS}/${address}/transactions`}
            activeClassName={classes.trustMenuActive}
            data-testid={'assets-menu-link'}
          >
            Transactions
          </NavLink >
          <NavLink 
            to={`${TRUSTS_ADDRESS}/${address}/apps`}
            activeClassName={classes.trustMenuActive}
            data-testid={'assets-menu-link'}
          >
            Apps
          </NavLink >
          <NavLink 
            to={`${TRUSTS_ADDRESS}/${address}/settings`}
            activeClassName={classes.trustMenuActive}
            data-testid={'assets-menu-link'}
          >
            Settings
          </NavLink >
        </Grid>
      </Grid>
      <Switch>
        <Route
          exact
          path={`${matchSafeWithAddress?.path}/assets/:assetType?`}
          render={() => wrapInSuspense(<Balances />, null)}
        />
        <Route
          exact
          path={`${matchSafeWithAddress?.path}/transactions`}
          render={() => wrapInSuspense(<TxList />, null)}
        />
        <Route
          exact
          path={`${matchSafeWithAddress?.path}/apps`}
          render={({ history }) => {
            if (!featuresEnabled.includes(FEATURES.SAFE_APPS)) {
              history.push(`${matchSafeWithAddress?.url}/assets`)
            }
            return wrapInSuspense(<Apps />, null)
          }}
        />
        <Route
          exact
          path={`${matchSafeWithAddress?.path}/settings`}
          render={() => wrapInSuspense(<Settings />, null)}
        />
        <Route
          exact
          path={`${matchSafeWithAddress?.path}/beneficiaries/:optionType?`}
          render={() => wrapInSuspense(<AddressBookTable />, null)}
        />
        <Redirect to={`${matchSafeWithAddress?.url}/assets`} />
      </Switch>
      {modal.isOpen && <GenericModal {...modal} onClose={closeGenericModal} />}
    </>
  )
}

export default Container
