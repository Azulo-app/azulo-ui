import React, { useState } from 'react'
import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'

import Stepper, { StepperPage } from 'src/components/Stepper'
import Block from 'src/components/layout/Block'
import Heading from 'src/components/layout/Heading'
import Row from 'src/components/layout/Row'
import { instantiateSafeContracts } from 'src/logic/contracts/safeContracts'
import { StartConnect } from 'src/routes/create/components/StartConnect'
import SafeNameField from 'src/routes/create/components/SafeNameForm'
import { SafeOwnersPage, validateOwnersForm } from 'src/routes/create/components/SafeOwnersConfirmationsForm'
import { Review } from 'src/routes/create/components/ReviewInformation'
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
import Grid from '@material-ui/core/Grid'
import { mainStyles } from 'src/theme/PageStyles'
import { removeProvider } from 'src/logic/wallets/store/actions'
import { onConnectButtonClick } from 'src/components/ConnectButton'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 24px 0 0 0;
`

const { useEffect } = React

const getSteps = () => ['Connect', 'Details', 'Review']

export type InitialValuesForm = {
  owner0Address?: string
  owner0Name?: string
  confirmations: string
  safeName?: string
  safeCreationSalt: number
}

const useInitialValuesFrom = (userAccount: string, safeProps?: SafeProps, addressBook?: any): InitialValuesForm => {
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
  const mainClasses = mainStyles()
  const dispatch = useDispatch()
  const [initialValues, setInitialValues] = useState<InitialValuesForm>()
  const addressBook = useSelector(addressBookSelector)

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

  useEffect(() => {
    if (userAccount) {
      setInitialValues(useInitialValuesFrom(userAccount, safeProps, addressBook))
    }
  }, [userAccount, safeProps])

  // const initialValues = useInitialValuesFrom(userAccount, safeProps)

  // if (!provider) {
  //   return <CreateLayout isOldMultisigMigration />
  // }

  return (
    <Block>
      <Grid container direction="column" justify="center" alignItems="stretch">
        <Grid item xs={12} className={mainClasses.pageTitleHold}><div className={mainClasses.pageTitle}>Create a trust</div></Grid>
        <Grid item><div className={mainClasses.pageDesc}>Create a new trust for your family, friends, business, charity or organisation.</div></Grid>
      </Grid>

      <>
        <Wrapper>
          <Grid container>
            <Stepper
              initialValues={initialValues}
              mutators={formMutators}
              onSubmit={onCallSafeContractSubmit}
              steps={steps}
              testId="create-safe-form"
            >
              <StepperPage component={StartConnect} />
              <StepperPage component={SafeOwnersPage} validate={validateOwnersForm} />
              <StepperPage component={Review} />
            </Stepper>
          </Grid>
        </Wrapper>
      </>
    </Block>
  )
}
