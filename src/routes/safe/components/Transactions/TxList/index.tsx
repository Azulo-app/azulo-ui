import { Menu as MenuSrc, Tab } from '@gnosis.pm/safe-react-components'
import { Item } from '@gnosis.pm/safe-react-components/dist/navigation/Tab'
import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'
import useSafeActions from 'src/logic/safe/hooks/useSafeActions'
import SendModal from 'src/routes/safe/components/Balances/SendModal'

import { HistoryTransactions } from './HistoryTransactions'
import { QueueTransactions } from './QueueTransactions'
import { Breadcrumb, ContentWrapper, Wrapper } from './styled'
import Button from 'src/components/layout/Button'

import { mainStyles } from 'src/theme/PageStyles'
import { mainColor, borderRadius, border } from 'src/theme/variables'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

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

const Menu = styled(MenuSrc)`
  justify-content: flex-start;
`

const items: Item[] = [
  { id: 'queue', label: 'Queue' },
  { id: 'history', label: 'History' },
]

const GatewayTransactions = (): ReactElement => {
  const [tab, setTab] = useState(items[0].id)
  const mainClasses = mainStyles()
  const { safeActionsState, onShow, onHide, showSendFunds, hideSendFunds } = useSafeActions()
  const sendFunds = safeActionsState.sendFunds

  return (
    <>
      <Wrapper>
        <Grid container alignItems="center">
          <Grid item className={mainClasses.accTitleHold}><div className={mainClasses.accTitle}>Transactions</div></Grid>
          <Box flexGrow={1}><div className={mainClasses.accDesc}>View and manage transactions from your trust account</div></Box>
          <Grid item>
            <Button className={mainClasses.mainButton} onClick={() => showSendFunds('')} variant="contained">
              + New transaction
            </Button>
          </Grid>
        </Grid>
        <ContentHold>
          {/* <StyledButton size="md" disabled={!granted} color="primary" variant="contained" onClick={onNewTransactionClick}>
            <FixedIcon type="arrowSentWhite" />
            <Text size="xl" color="white">
              New transaction
            </Text>
          </StyledButton> */}
          {/* <Menu>
            <Breadcrumb iconSize="md" iconType="transactionsInactive" textSize="md" text="TRANSACTIONS" />
          </Menu> */}
          <Tab items={items} onChange={setTab} selectedTab={tab} />
          <ContentWrapper>
            {tab === 'queue' && <QueueTransactions />}
            {tab === 'history' && <HistoryTransactions />}
          </ContentWrapper>
        </ContentHold>
      </Wrapper>

      <SendModal
        activeScreenType="chooseTxType"
        isOpen={sendFunds.isOpen}
        onClose={hideSendFunds}
        selectedToken={sendFunds.selectedToken}
      />

      {/* {safeAddress && safeName && (
        <Modal
          description="Receive Tokens Form"
          handleClose={onReceiveHide}
          open={safeActionsState.showReceive}
          paperClassName="receive-modal"
          title="Receive Tokens"
        >
          <ReceiveModal onClose={onReceiveHide} safeAddress={safeAddress} safeName={safeName} />
        </Modal>
      )} */}

    </>
  )
}

export default GatewayTransactions
