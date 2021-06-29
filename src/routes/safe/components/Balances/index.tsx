import { makeStyles } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import ReceiveModal from 'src/components/App/ReceiveModal'
import { styles } from './style'

import Modal from 'src/components/Modal'
import Col from 'src/components/layout/Col'
import Divider from 'src/components/layout/Divider'

import Row from 'src/components/layout/Row'
import { TRUSTS_ADDRESS } from 'src/routes/routes'
import SendModal from 'src/routes/safe/components/Balances/SendModal'
import { CurrencyDropdown } from 'src/routes/safe/components/CurrencyDropdown'
import {
  safeFeaturesEnabledSelector,
  safeNameSelector,
  safeParamAddressFromStateSelector,
} from 'src/logic/safe/store/selectors'

import { wrapInSuspense } from 'src/utils/wrapInSuspense'
import { useFetchTokens } from 'src/logic/safe/hooks/useFetchTokens'
import { NavLink, Redirect, Route, Switch } from 'react-router-dom'
import { FEATURES } from 'src/config/networks/network.d'

import styled from 'styled-components'
import { mainStyles } from 'src/theme/PageStyles'
import { mainColor, borderRadius, border } from 'src/theme/variables'
import Button from 'src/components/layout/Button'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import { openCreateAction } from 'src/logic/createAction/store/actions/openCreateActions'
import { createActionOpen } from 'src/logic/createAction/store/selectors'

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

const Collectibles = React.lazy(() => import('src/routes/safe/components/Balances/Collectibles'))
const Coins = React.lazy(() => import('src/routes/safe/components/Balances/Coins'))

export const MANAGE_TOKENS_BUTTON_TEST_ID = 'manage-tokens-btn'
export const BALANCE_ROW_TEST_ID = 'balance-row'

const INITIAL_STATE = {
  erc721Enabled: false,
  showToken: false,
  sendFunds: {
    isOpen: false,
    selectedToken: '',
  },
  showReceive: false,
}

export const COINS_LOCATION_REGEX = /\/balances\/?$/
export const COLLECTIBLES_LOCATION_REGEX = /\/balances\/collectibles$/

const useStyles = makeStyles(styles)

const Balances = (): React.ReactElement => {
  const mainClasses = mainStyles()
  const classes = useStyles()
  const dispatch = useDispatch()
  const [state, setState] = useState(INITIAL_STATE)

  const address = useSelector(safeParamAddressFromStateSelector)
  const featuresEnabled = useSelector(safeFeaturesEnabledSelector)
  const safeName = useSelector(safeNameSelector) ?? ''
  const createActionModal = useSelector(createActionOpen)

  useFetchTokens(address)

  useEffect(() => {
    const erc721Enabled = Boolean(featuresEnabled?.includes(FEATURES.ERC721))

    setState((prevState) => ({
      ...prevState,
      erc721Enabled,
    }))
  }, [featuresEnabled])

  const onShow = (action) => {
    setState((prevState) => ({ ...prevState, [`show${action}`]: true }))
  }

  const onHide = (action) => {
    setState((prevState) => ({ ...prevState, [`show${action}`]: false }))
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

  useEffect(() => {
    if (createActionModal) {
      if (createActionModal && createActionModal.createActionOpen && createActionModal.createAction == 'add_assets') {
        onShow('Receive')
        dispatch(openCreateAction({ createActionOpen: false, createAction: '' }))
      }
    }
  }, [createActionModal])

  const { assetDivider, assetTab, assetTabActive, assetTabs, controls, tokenControls } = classes
  const { erc721Enabled, sendFunds, showReceive } = state

  return (
    <>
      <Grid container alignItems="center">
        <Grid item className={mainClasses.accTitleHold}>
          <div className={mainClasses.accTitle}>Assets</div>
        </Grid>
        <Box flexGrow={1}>
          <div className={mainClasses.accDesc}>See the balances of all your trust assets</div>
        </Box>
        <Grid item>
          <Button className={mainClasses.mainButton} onClick={() => onShow('Receive')} variant="contained">
            + Receive assets
          </Button>
        </Grid>
      </Grid>
      <ContentHold>
        <Row align="center" className={controls}>
          <Col className={assetTabs} sm={6} start="sm" xs={12}>
            <NavLink
              to={`${TRUSTS_ADDRESS}/${address}/assets`}
              activeClassName={assetTabActive}
              className={assetTab}
              data-testid={'coins-assets-btn'}
              exact
            >
              Coins
            </NavLink>
            {erc721Enabled ? (
              <>
                <Divider className={assetDivider} />
                <NavLink
                  to={`${TRUSTS_ADDRESS}/${address}/assets/collectibles`}
                  activeClassName={assetTabActive}
                  className={assetTab}
                  data-testid={'collectibles-assets-btn'}
                  exact
                >
                  Collectibles
                </NavLink>
              </>
            ) : null}
          </Col>
          <Switch>
            <Route
              path={`${TRUSTS_ADDRESS}/${address}/assets/collectibles`}
              exact
              render={() => {
                return !erc721Enabled ? <Redirect to={`${TRUSTS_ADDRESS}/${address}/assets`} /> : null
              }}
            />
            <Route
              path={`${TRUSTS_ADDRESS}/${address}/assets`}
              exact
              render={() => {
                return (
                  <>
                    <Col className={tokenControls} end="sm" sm={6} xs={12}>
                      <CurrencyDropdown />
                    </Col>
                  </>
                )
              }}
            />
          </Switch>
        </Row>
        <Switch>
          <Route
            path={`${TRUSTS_ADDRESS}/${address}/assets/collectibles`}
            exact
            render={() => {
              if (erc721Enabled) {
                return wrapInSuspense(<Collectibles />)
              }
              return null
            }}
          />
          <Route
            path={`${TRUSTS_ADDRESS}/${address}/assets`}
            render={() => {
              return wrapInSuspense(<Coins showReceiveFunds={() => onShow('Receive')} showSendFunds={showSendFunds} />)
            }}
          />
        </Switch>
        <SendModal
          activeScreenType="sendFunds"
          isOpen={sendFunds.isOpen}
          onClose={hideSendFunds}
          selectedToken={sendFunds.selectedToken}
        />
        <Modal
          description="Receive Tokens Form"
          handleClose={() => onHide('Receive')}
          open={showReceive}
          paperClassName="receive-modal"
          title="Receive Tokens"
        >
          <ReceiveModal safeAddress={address} safeName={safeName} onClose={() => onHide('Receive')} />
        </Modal>
      </ContentHold>
    </>
  )
}

export default Balances
