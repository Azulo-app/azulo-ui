import React, { ReactElement } from 'react'
import Block from 'src/components/layout/Block'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'
import OpenPaper from 'src/components/Stepper/OpenPaper'
import { StepperPageFormProps } from 'src/components/Stepper'
import { mainStyles } from 'src/theme/PageStyles'
import { onConnectButtonClick } from 'src/components/ConnectButton'
import { useSelector, useDispatch } from 'react-redux'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import { removeProvider } from 'src/logic/wallets/store/actions'

const StartConnectComponent = (): ReactElement => {
  const mainClasses = mainStyles();
  const provider = useSelector(providerNameSelector)
  const dispatch = useDispatch()

  const onDisconnect = () => {
    dispatch(removeProvider())
  }

  return (
    <>
      <Block>
        <Grid item sm={12}>
          <Grid container direction="row" justify="space-between" alignItems="center">
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
        </Grid>
      </Block>
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
          <div>Why you need to connect your wallet!</div>
          <p>The digital decentralized trust itself will not have any permissions, it requires trustees to authorise transactions, make changes, etc.</p>
          <p>Trustees are identified by their digital wallet signature, without at least one digital wallet signature the created trust would not function.</p>
        </OpenPaper>
      </>
    )
  }
