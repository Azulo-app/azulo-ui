
import * as React from 'react'
import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'

import Stepper, { StepperPage } from 'src/components/Stepper'
import Block from 'src/components/layout/Block'
import Heading from 'src/components/layout/Heading'
import Row from 'src/components/layout/Row'
import { instantiateSafeContracts } from 'src/logic/contracts/safeContracts'
import { Review } from 'src/routes/create/components/ReviewInformation'
import SafeNameField from 'src/routes/create/components/SafeNameForm'
import { SafeOwnersPage, validateOwnersForm } from 'src/routes/create/components/SafeOwnersConfirmationsForm'
import {
  FIELD_CONFIRMATIONS,
  FIELD_CREATION_PROXY_SALT,
  FIELD_SAFE_NAME,
  getOwnerAddressBy,
  getOwnerNameBy,
} from 'src/routes/create/components/fields'
import { CreateLayout } from 'src/routes/start/components/index'
import { history } from 'src/store'
import { secondary, sm } from 'src/theme/variables'
import { providerNameSelector, userAccountSelector } from 'src/logic/wallets/store/selectors'
import { useSelector, useDispatch } from 'react-redux'
import { addressBookSelector } from 'src/logic/addressBook/store/selectors'
import { getNameFromAddressBook } from 'src/logic/addressBook/utils'
import { SafeProps } from 'src/routes/create/container'
import { borderRadius } from 'src/theme/variables'
import Grid from '@material-ui/core/Grid';
import { withStyles, makeStyles } from '@material-ui/core/styles'
import { mainStyles } from 'src/theme/PageStyles'
import Button from '@material-ui/core/Button'
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import { removeProvider } from 'src/logic/wallets/store/actions'
import { onConnectButtonClick } from 'src/components/ConnectButton'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 24px 0 0 0;
`

const useStyles = makeStyles(() => ({
  bg_curve: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: -1,
    width: '60%',
    height: '100%',
    overflow: 'hidden',
    '& > div': {
      height: '100%'
    }
  },
}));

const { useEffect } = React

const getSteps = () => ['Name', 'Owners and confirmations', 'Review']

export type InitialValuesForm = {
  owner0Address?: string
  owner0Name?: string
  confirmations: string
  safeName?: string
  safeCreationSalt: number
}

const useInitialValuesFrom = (userAccount: string, safeProps?: SafeProps): InitialValuesForm => {
  const addressBook = useSelector(addressBookSelector)
  const ownerName = getNameFromAddressBook(addressBook, userAccount, { filterOnlyValidName: true })

  if (!safeProps) {
    return {
      [getOwnerNameBy(0)]: ownerName || 'My Wallet',
      [getOwnerAddressBy(0)]: userAccount,
      [FIELD_CONFIRMATIONS]: '1',
      [FIELD_CREATION_PROXY_SALT]: Date.now(),
    }
  }
  let obj = {}
  const { name, ownerAddresses, ownerNames, threshold } = safeProps

  for (const [index, value] of ownerAddresses.entries()) {
    const safeName = ownerNames[index] ? ownerNames[index] : 'My Wallet'
    obj = {
      ...obj,
      [getOwnerAddressBy(index)]: value,
      [getOwnerNameBy(index)]: safeName,
    }
  }
  return {
    ...obj,
    [FIELD_CONFIRMATIONS]: threshold || '1',
    [FIELD_SAFE_NAME]: name,
    [FIELD_CREATION_PROXY_SALT]: Date.now(),
  }
}

const iconStyle = {
  color: secondary,
  padding: sm,
  marginRight: '5px',
}

const back = () => {
  history.goBack()
}

const formMutators = {
  setValue: ([field, value], state, { changeValue }) => {
    changeValue(state, field, () => value)
  },
}

type LayoutProps = {
  onCallSafeContractSubmit: (formValues: unknown) => void
  safeProps?: SafeProps
}

export const Layout = (props: LayoutProps): React.ReactElement => {
  const mainClasses = mainStyles();
  const classes = useStyles();
  const dispatch = useDispatch()

  const onDisconnect = () => {
    dispatch(removeProvider())
  }

  const { onCallSafeContractSubmit, safeProps } = props

  const provider = useSelector(providerNameSelector)
  const userAccount = useSelector(userAccountSelector)

  useEffect(() => {
    if (provider) {
      instantiateSafeContracts()
    }
  }, [provider])

  const steps = getSteps()

  const initialValues = useInitialValuesFrom(userAccount, safeProps)

  if (!provider) {
    return <CreateLayout isOldMultisigMigration />
  }

  return (
    <Block>
      <Grid container alignItems="center">
        <Grid item className={mainClasses.pageTitleHold}><div className={mainClasses.pageTitle}>Create a trust</div></Grid>
        <Grid item><div className={mainClasses.pageDesc}>Create a new trust for your family, friends, business, charity or organisation.</div></Grid>
      </Grid>

      <>
        <Wrapper>
          <Grid container>
            <Grid item sm={12} className={mainClasses.createStepOut}>
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
            <Grid item sm={12} className={`${mainClasses.createStepOut} ${provider ? mainClasses.createStepOutActive : ''}`}>
              <Grid container direction="row" justify="space-between" alignItems="center">
                <Grid item className={mainClasses.createStepTitle}>
                  <Grid container direction="row" justify="flex-start" alignItems="center">
                    <Grid item className={mainClasses.createStepNum}><span>2</span></Grid>
                    <Grid item>Step 2: Trust details</Grid>
                  </Grid>
                </Grid>
                <Grid item className={mainClasses.createStepBody}>
                  <Grid container>
                    <Grid item>
                      <h3 className={mainClasses.cardTitle}>Set your trust details</h3>
                      <p className={mainClasses.cardDesc}>You are about to create a new Trust with one or more trustees. You can add a name for your trust. This name is only saved on your device and is not visible to anyone else.</p>
                      {/* <SafeNameField />
                      <SafeOwnersPage /> */}
      <Stepper
        initialValues={initialValues}
        mutators={formMutators}
        onSubmit={onCallSafeContractSubmit}
        steps={steps}
        testId="create-safe-form"
      >
        <StepperPage component={SafeNameField} />
        <StepperPage component={SafeOwnersPage} validate={validateOwnersForm} />
        <StepperPage component={Review} />
      </Stepper>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={12} className={mainClasses.createStepOut}>
              <Grid container direction="row" justify="flex-start" alignItems="center">
                <Grid item className={mainClasses.createStepTitle}>
                  <Grid container direction="row" justify="flex-start" alignItems="center">
                    <Grid item className={mainClasses.createStepNum}><span>3</span></Grid>
                    <Grid item>Step 3: Review</Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={12} className={mainClasses.createStepOut}>
              <Grid container direction="row" justify="flex-start" alignItems="center">
                <Grid item className={mainClasses.createStepTitle}>
                  <Grid container direction="row" justify="flex-start" alignItems="center">
                    <Grid item className={mainClasses.createStepNum}><span>4</span></Grid>
                    <Grid item>Step 4: Create trust</Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Wrapper>
      </>
    </Block>
  )
}
