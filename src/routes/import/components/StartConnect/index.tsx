import React, { ReactElement } from 'react'
import Block from 'src/components/layout/Block'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import OpenPaper from 'src/components/Stepper/OpenPaper'
import { StepperPageFormProps } from 'src/components/Stepper'
import { mainStyles } from 'src/theme/PageStyles'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import { onConnectButtonClick } from 'src/components/ConnectButton'
import { useSelector, useDispatch } from 'react-redux'
import { providerNameSelector, userAccountSelector } from 'src/logic/wallets/store/selectors'
import { removeProvider } from 'src/logic/wallets/store/actions'
import Hairline from 'src/components/layout/Hairline'
import { EthHashInfo, Text } from '@gnosis.pm/safe-react-components'
import WalletIcon from 'src/components/AppLayout/Header/components/WalletIcon/index'

const useStyles = makeStyles((theme) => ({
  cardTitle: {
    marginTop: '40px'
  },
  cardDesc: {
    maxWidth: '500px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  divider: {
    margin: '20px 0'
  }
}));

const StartConnectComponent = (): ReactElement => {
  const mainClasses = mainStyles()
  const classes = useStyles()
  const provider = useSelector(providerNameSelector)
  const userAddress = useSelector(userAccountSelector)
  const dispatch = useDispatch()

  const onDisconnect = () => {
    dispatch(removeProvider())
  }

  return (
    <>
      <Block>
        <Grid item sm={12} className={mainClasses.createStepOutActive}>
          <Grid container direction="row" justify="space-evenly" alignItems="center">
            <Grid item className={mainClasses.createStepTitle}>
              <Grid container direction="row" justify="flex-start" alignItems="center">
                <Grid item className={mainClasses.createStepNum}><span>1</span></Grid>
                <Grid item>Step 1: Connect wallet</Grid>
              </Grid>
            </Grid>
            <Grid item>
              {
                provider ?
                  <Button
                    color="primary"
                    variant="contained"
                    className={`${mainClasses.mainButton} ${mainClasses.borderButton} ${mainClasses.greyButton}`}
                    fullWidth
                    onClick={onDisconnect}
                    data-testid="disconnect-btn"
                  >
                    Disconnect
                  </Button>
                :
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={onConnectButtonClick}
                    className={mainClasses.mainButton}
                    data-testid="connect-btn"
                  >
                    Connect
                  </Button>
              }
            </Grid>
          </Grid>
            {
              provider ? 
                <>
                  <Grid item>
                    <Grid container direction="row" justify="center" alignItems="center">
                      <Grid item className={mainClasses.userAddress}>
                        <Grid container direction="row" justify="center" alignItems="center">
                          <Grid item>
                            <div className={mainClasses.userAddressLbl}>Connected:</div>
                          </Grid>
                          <Grid item>
                            <EthHashInfo
                              hash={userAddress}
                              shortenHash={4}
                              showAvatar
                              avatarSize="xs"
                              textSize="sm"
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              :
              ''
              }
        </Grid>
      </Block>
    </>
  )
}

const StartInfoComponent = (): ReactElement => {
  const mainClasses = mainStyles()
  const classes = useStyles()

  return (
    <>
      <Hairline className={classes.divider} />
      <div className={`${mainClasses.cardTitle} ${classes.cardTitle} ${mainClasses.center}`}>Why you need to connect your wallet</div>
      <p className={`${mainClasses.cardDesc} ${mainClasses.center} ${classes.cardDesc}`}>The digital decentralized trust itself will not have any permissions, it requires trustees to authorise transactions, make changes, etc.</p>
      <p className={`${mainClasses.cardDesc} ${mainClasses.center} ${classes.cardDesc}`}>Trustees are identified by their digital wallet signature, without at least one digital wallet signature the created trust would not function.</p>
      <p className={`${mainClasses.cardDesc} ${mainClasses.center} ${classes.cardDesc}`}>Some of the supported wallets, with integration provided by Blocknative.</p>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item><WalletIcon provider="METAMASK" /></Grid>
        <Grid item><WalletIcon provider="WALLETCONNECT" /></Grid>
        <Grid item><WalletIcon provider="TREZOR" /></Grid>
        <Grid item><WalletIcon provider="LEDGER" /></Grid>
        <Grid item><WalletIcon provider="LATTICE" /></Grid>
        <Grid item><WalletIcon provider="FORTMATIC" /></Grid>
        <Grid item><WalletIcon provider="PORTIS" /></Grid>
        <Grid item><WalletIcon provider="AUTHEREUM" /></Grid>
        <Grid item><WalletIcon provider="TORUS" /></Grid>
        <Grid item><WalletIcon provider="OPERA" /></Grid>
        <Grid item><WalletIcon provider="WALLETLINK" /></Grid>
      </Grid>
    </>
  )
}

export const StartConnect = () =>
  function StartConnectPage(controls: React.ReactNode, props: StepperPageFormProps): React.ReactElement {
    return (
      <>
        <OpenPaper controls={controls} padding={false}>
          <StartConnectComponent />
          {controls}
          <StartInfoComponent />
        </OpenPaper>
      </>
    )
  }