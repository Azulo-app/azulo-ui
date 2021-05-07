import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import { BigNumber } from 'bignumber.js'
import React, { ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { getExplorerInfo } from 'src/config'
import Field from 'src/components/forms/Field'
import GnoForm from 'src/components/forms/GnoForm'
import TextField from 'src/components/forms/TextField'
import { composeValidators, maxValue, minValue, mustBeFloat, required } from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import ButtonLink from 'src/components/layout/ButtonLink'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { ScanQRWrapper } from 'src/components/ScanQRModal/ScanQRWrapper'
import { addressBookSelector } from 'src/logic/addressBook/store/selectors'
import { getNameFromAddressBook } from 'src/logic/addressBook/utils'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { SpendingLimit } from 'src/logic/safe/store/models/safe'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'

import { getWeb3 } from 'src/logic/wallets/getWeb3'
import SuperfluidSDK from '@superfluid-finance/js-sdk'

import SafeInfo from 'src/routes/safe/components/Balances/SendModal/SafeInfo'
import { AddressBookInput } from 'src/routes/safe/components/Balances/SendModal/screens/AddressBookInput'
import { SpendingLimitRow } from 'src/routes/safe/components/Balances/SendModal/screens/SendFunds/SpendingLimitRow'
import TokenSelectField from 'src/routes/safe/components/Balances/SendModal/screens/SendFunds/TokenSelectField'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'
import { safeSelector } from 'src/logic/safe/store/selectors'
import { safeSpendingLimitsSelector,  } from 'src/logic/safe/store/selectors'
import { sameString } from 'src/utils/strings'

import { styles } from './style'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import { spendingLimitAllowedBalance, getSpendingLimitByTokenAddress } from 'src/logic/safe/utils/spendingLimits'
import { getBalanceAndDecimalsFromToken } from 'src/logic/tokens/utils/tokenHelpers'
import Divider from 'src/components/Divider'

const formMutators = {
  setMax: (args, state, utils) => {
    utils.changeValue(state, 'amount', () => args[0])
  },
  onTokenChange: (args, state, utils) => {
    utils.changeValue(state, 'amount', () => state.formState.values.amount)
  },
  setRecipient: (args, state, utils) => {
    utils.changeValue(state, 'recipientAddress', () => args[0])
  },
  setTxType: (args, state, utils) => {
    utils.changeValue(state, 'txType', () => args[0])
  },
}

const useStyles = makeStyles(styles)

export type SendFundsTx = {
  amount?: string
  recipientAddress?: string
  token?: string
  txType?: string
  tokenSpendingLimit?: SpendingLimit
}

type SendFundsProps = {
  initialValues: SendFundsTx
  onClose: () => void
  onReview: (txInfo: unknown) => void
  recipientAddress?: string
  selectedToken?: string
  amount?: string
}

const InputAdornmentChildSymbol = ({ symbol }: { symbol?: string }): ReactElement => {
  return <>{symbol}</>
}

const RecurringFunds = ({
  initialValues,
  onClose,
  onReview,
  recipientAddress,
  selectedToken = '',
  amount,
}: SendFundsProps): ReactElement => {
  const classes = useStyles()
  const tokens = useSelector(extendedSafeTokensSelector)
  const { address: safeAddress = '' } = useSelector(safeSelector) || {}
  const addressBook = useSelector(addressBookSelector)
  const [selectedEntry, setSelectedEntry] = useState<{ address: string; name: string } | null>(() => {
    const defaultEntry = { address: recipientAddress || '', name: '' }

    // if there's nothing to lookup for, we return the default entry
    if (!initialValues?.recipientAddress && !recipientAddress) {
      return defaultEntry
    }

    // if there's something to lookup for, `initialValues` has precedence over `recipientAddress`
    const predefinedAddress = initialValues?.recipientAddress ?? recipientAddress
    const addressBookEntry = addressBook.find(({ address }) => {
      return sameAddress(predefinedAddress, address)
    })

    // if found in the Address Book, then we return the entry
    if (addressBookEntry) {
      return addressBookEntry
    }

    // otherwise we return the default entry
    return defaultEntry
  })
  const [pristine, setPristine] = useState(true)
  const [isValidAddress, setIsValidAddress] = useState(false)

  useEffect(() => {
    if (selectedEntry === null && pristine) {
      setPristine(false)
    }
  }, [selectedEntry, pristine])

  let tokenSpendingLimit

  const [loading, setLoadingStream] = useState(false)

  const web3 = getWeb3()
  const sf = new SuperfluidSDK.Framework({
    web3: web3
  })

  const handleSubmit = async (values) => {
    const input = values
    console.log('input', input)
    setLoadingStream(true)

    await sf.initialize()

    const owner = sf.user({
      address: safeAddress,
      token: input.token,
    })

    owner.flow({
      recipient: input.recipientAddress,
      flowRate: input.flowRate,
      onTransaction: () => {
        setLoadingStream(false)
        console.log('Flow created')
        console.log('input.ownerAddress', input.owner)
        console.log('input.recipientAddress', input.recipientAddress)
        console.log('input.tokenAddress', input.token)
      },
    })
  }

  const spendingLimits = useSelector(safeSpendingLimitsSelector)
  const currentUser = useSelector(userAccountSelector)

  const sendFundsValidation = (values) => {
    const { amount, token: tokenAddress, txType } = values ?? {}

    if (!amount || !tokenAddress) {
      return
    }

    const isSpendingLimit = tokenSpendingLimit && txType === 'spendingLimit'

    const amountValidation = composeValidators(
      required,
      mustBeFloat,
      minValue(0, false),
      maxValue(
        isSpendingLimit
          ? spendingLimitAllowedBalance({ tokenAddress, tokenSpendingLimit, tokens })
          : getBalanceAndDecimalsFromToken({ tokenAddress, tokens })?.balance ?? 0,
      ),
    )(amount)

    return {
      amount: amountValidation,
    }
  }

  return (
    <>
      <Row align="center" className={classes.heading} grow data-testid="modal-title-send-funds">
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Recurring funds
        </Paragraph>
        <Paragraph className={classes.annotation}>1 of 2</Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm
        formMutators={formMutators}
        initialValues={{
          amount: initialValues?.amount || amount,
          recipientAddress: initialValues.recipientAddress || recipientAddress,
          token: initialValues?.token || selectedToken,
        }}
        onSubmit={handleSubmit}
        validation={sendFundsValidation}
      >
        {(...args) => {
          const formState = args[2]
          const mutators = args[3]
          const { token: tokenAddress, txType } = formState.values
          const selectedToken = tokens?.find((token) => token.address === tokenAddress)
          const userSpendingLimits = spendingLimits?.filter(({ delegate }) => sameAddress(delegate, currentUser))

          tokenSpendingLimit = getSpendingLimitByTokenAddress({
            spendingLimits: userSpendingLimits,
            tokenAddress: selectedToken?.address,
          })

          const handleScan = (value, closeQrModal) => {
            let scannedAddress = value

            if (scannedAddress.startsWith('ethereum:')) {
              scannedAddress = scannedAddress.replace('ethereum:', '')
            }
            const scannedName = addressBook ? getNameFromAddressBook(addressBook, scannedAddress) : ''
            mutators.setRecipient(scannedAddress)
            setSelectedEntry({
              name: scannedName || '',
              address: scannedAddress,
            })
            closeQrModal()
          }

          let shouldDisableSubmitButton = !isValidAddress
          if (selectedEntry) {
            shouldDisableSubmitButton = !selectedEntry.address
          }

          const setMaxAllowedAmount = () => {
            const isSpendingLimit = tokenSpendingLimit && txType === 'spendingLimit'
            let maxAmount = selectedToken?.balance.tokenBalance ?? 0

            if (isSpendingLimit) {
              const spendingLimitBalance = fromTokenUnit(
                new BigNumber(tokenSpendingLimit.amount).minus(tokenSpendingLimit.spent).toString(),
                selectedToken?.decimals ?? 0,
              )

              maxAmount = new BigNumber(maxAmount).gt(spendingLimitBalance) ? spendingLimitBalance : maxAmount
            }

            mutators.setMax(maxAmount)
          }

          return (
            <>
              <Block className={classes.formContainer}>
                <SafeInfo />
                <Divider withArrow />
                {selectedEntry && selectedEntry.address ? (
                  <div
                    onKeyDown={(e) => {
                      if (sameString(e.key, 'Tab')) {
                        return
                      }
                      setSelectedEntry({ address: '', name: '' })
                    }}
                    onClick={() => {
                      setSelectedEntry({ address: '', name: '' })
                    }}
                    role="listbox"
                    tabIndex={0}
                  >
                    <Row margin="xs">
                      <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                        Recipient
                      </Paragraph>
                    </Row>
                    <Row align="center" margin="md">
                      <EthHashInfo
                        hash={selectedEntry.address}
                        name={selectedEntry.name}
                        showAvatar
                        showCopyBtn
                        explorerUrl={getExplorerInfo(selectedEntry.address)}
                      />
                    </Row>
                  </div>
                ) : (
                  <Row margin="md">
                    <Col xs={11}>
                      <AddressBookInput
                        fieldMutator={mutators.setRecipient}
                        pristine={pristine}
                        setIsValidAddress={setIsValidAddress}
                        setSelectedEntry={setSelectedEntry}
                      />
                    </Col>
                    <Col center="xs" className={classes} middle="xs" xs={1}>
                      <ScanQRWrapper handleScan={handleScan} />
                    </Col>
                  </Row>
                )}
                <Row margin="sm">
                  <Col>
                    <TokenSelectField
                      initialValue={selectedToken?.address}
                      isValid={!!selectedToken?.address}
                      tokens={tokens}
                    />
                  </Col>
                </Row>
                {tokenSpendingLimit && selectedToken && (
                  <SpendingLimitRow selectedToken={selectedToken} tokenSpendingLimit={tokenSpendingLimit} />
                )}
                <Row margin="xs">
                  <Col between="lg">
                    <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                      Amount
                    </Paragraph>
                    <ButtonLink onClick={setMaxAllowedAmount} weight="bold" testId="send-max-btn">
                      Send max
                    </ButtonLink>
                  </Col>
                </Row>
                <Row margin="md">
                  <Col>
                    <Field
                      component={TextField}
                      inputAdornment={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <InputAdornmentChildSymbol symbol={selectedToken?.symbol} />
                          </InputAdornment>
                        ),
                      }}
                      name="amount"
                      placeholder="Amount*"
                      text="Amount*"
                      type="text"
                      testId="amount-input"
                    />
                  </Col>
                </Row>
              </Block>
              <Hairline />
              <Row align="center" className={classes.buttonRow}>
                <Button minWidth={140} onClick={onClose} color="secondary">
                  Cancel
                </Button>
                <Button
                  className={classes.submitButton}
                  color="primary"
                  data-testid="review-tx-btn"
                  disabled={!formState.valid || shouldDisableSubmitButton}
                  minWidth={140}
                  type="submit"
                  variant="contained"
                >
                  Review
                </Button>
              </Row>




              <br />
              <br />
              Recipient address
              <Field
                component={TextField}
                name="recipientAddress"
                placeholder="recipientAddress*"
                text="recipientAddress*"
                type="text"
                testId="recipientAddress-input"
                validation={{
                  required: true,
                  pattern: {
                    value: /^0x([A-Fa-f0-9]{40})$/,
                  },
                }}
              />
              <br />
              <br />
              Token address
              <Field
                component={TextField}
                name="token"
                placeholder="tokenAddress*"
                text="tokenAddress*"
                type="text"
                testId="tokenAddress-input"
                validation={{
                  required: true,
                  pattern: {
                    value: /^0x([A-Fa-f0-9]{40})$/,
                  },
                }}
              />
              <br />
              <br />
              Flow rate (tokens per second)
              <Field
                component={TextField}
                name="flowRate"
                initialValue="385802469135802"
                placeholder="eg. 385802469135802*"
                type="text"
                testId="flowRate-input"
                validation={{
                  required: true,
                  pattern: {
                    value: /^[0-9]+$/,
                  },
                }}
              />

              <div className="rw-button-group">
                <Button type="submit">
                  Submit
                </Button>
              </div>


            </>
          )
        }}
      </GnoForm>
    </>
  )
}

export default RecurringFunds
