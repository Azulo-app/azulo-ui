import InputAdornment from '@material-ui/core/InputAdornment'
import MenuItem from '@material-ui/core/MenuItem'
import { Icon, Link, Text } from '@gnosis.pm/safe-react-components'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import CheckCircle from '@material-ui/icons/CheckCircle'
import * as React from 'react'
import styled from 'styled-components'

import { styles } from './style'
import { padOwnerIndex } from 'src/routes/create/utils/padOwnerIndex'
import QRIcon from 'src/assets/icons/qrcode.svg'
import trash from 'src/assets/icons/trash.svg'
import { ScanQRModal } from 'src/components/ScanQRModal'
import OpenPaper from 'src/components/Stepper/OpenPaper'
import AddressInput from 'src/components/forms/AddressInput'
import Field from 'src/components/forms/Field'
import SelectField from 'src/components/forms/SelectField'
import TextField from 'src/components/forms/TextField'
import {
  composeValidators,
  minValue,
  mustBeInteger,
  noErrorsOn,
  required,
  minMaxLength,
  ADDRESS_REPEATED_ERROR,
} from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import {
  FIELD_CONFIRMATIONS,
  FIELD_NAME,
  getNumOwnersFrom,
  getOwnerAddressBy,
  getOwnerNameBy,
} from 'src/routes/create/components/fields'
import { getAccountsFrom } from 'src/routes/create/utils/safeDataExtractor'
import { useSelector } from 'react-redux'
import { addressBookSelector } from 'src/logic/addressBook/store/selectors'
import { getNameFromAddressBook } from 'src/logic/addressBook/utils'
import { secondary, sm } from 'src/theme/variables'
import { mainStyles } from 'src/theme/PageStyles'
import Grid from '@material-ui/core/Grid'
import HelpOutline from '@material-ui/icons/HelpOutline'
import Tooltip from '@material-ui/core/Tooltip'

const { useState } = React

export const ADD_OWNER_BUTTON = '+ Add trustee'

const StyledAddressInput = styled(AddressInput)`
  width: 460px;
`

const nameStyles = createStyles({
  root: {
    display: 'flex',
    maxWidth: '440px',
  },
  text: {
    flexWrap: 'nowrap',
  },
  dot: {
    marginRight: sm,
  },
  links: {
    '&>a': {
      color: secondary,
    },
  },
})

const StyledField = styled(Field)`
  &.MuiTextField-root {
    width: 460px;
  }
`

/**
 * Validates the whole OwnersForm, specially checks for non-repeated addresses
 *
 * If finds a repeated address, marks it as invalid
 * @param {Object<string, string>} values
 * @return Object<string, string>
 */
export const validateOwnersForm = (values: Record<string, string>): Record<string, string> => {
  const { errors } = Object.keys(values).reduce(
    (result, key) => {
      if (/owner\d+Address/.test(key)) {
        const address = values[key].toLowerCase()

        if (result.addresses.includes(address)) {
          result.errors[key] = ADDRESS_REPEATED_ERROR
        }

        result.addresses.push(address)
      }
      return result
    },
    { addresses: [] as string[], errors: {} },
  )
  return errors
}

export const calculateValuesAfterRemoving = (index: number, values: Record<string, string>): Record<string, string> =>
  Object.keys(values)
    .sort()
    .reduce((newValues, key) => {
      const ownerRelatedField = /owner(\d+)(Name|Address)/

      if (!ownerRelatedField.test(key)) {
        // no owner-related field
        newValues[key] = values[key]
        return newValues
      }

      const ownerToRemove = new RegExp(`owner${padOwnerIndex(index)}(Name|Address)`)

      if (ownerToRemove.test(key)) {
        // skip, doing anything with the removed field
        return newValues
      }

      // we only have the owner-related fields to work with
      // we must reduce the index value for those owners that come after the deleted owner row
      const [, ownerOrder, ownerField] = key.match(ownerRelatedField) as RegExpMatchArray

      if (Number(ownerOrder) > index) {
        // reduce by one the order of the owner
        newValues[`owner${padOwnerIndex(Number(ownerOrder) - 1)}${ownerField}`] = values[key]
      } else {
        // previous owners to the deleted row
        newValues[key] = values[key]
      }

      return newValues
    }, {} as Record<string, string>)

const useStyles = makeStyles(styles)

const SafeOwnersForm = (props): React.ReactElement => {
  const { errors, form, values } = props
  const classes = useStyles()
  const mainClasses = mainStyles()

  const validOwners = getNumOwnersFrom(values)
  const addressBook = useSelector(addressBookSelector)

  const [numOwners, setNumOwners] = useState(validOwners)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [scanQrForOwnerName, setScanQrForOwnerName] = useState(null)

  const openQrModal = (ownerName) => {
    setScanQrForOwnerName(ownerName)
    setQrModalOpen(true)
  }

  const closeQrModal = () => {
    setQrModalOpen(false)
  }

  const onRemoveRow = (index) => () => {
    const initialValues = calculateValuesAfterRemoving(index, values)
    form.reset(initialValues)

    setNumOwners(numOwners - 1)
  }

  const onAddOwner = () => {
    setNumOwners(numOwners + 1)
  }

  const handleScan = (value: string | null) => {
    let scannedAddress = value

    if (scannedAddress?.startsWith('ethereum:')) {
      scannedAddress = scannedAddress.replace('ethereum:', '')
    }

    form.mutators.setValue(scanQrForOwnerName, scannedAddress)
    closeQrModal()
  }

  return (
    <>
      <Block>
        <Grid container direction="column">
          <Grid item sm={12} className={mainClasses.createStepOutActive}>
            <Grid container direction="row" justify="space-evenly" alignItems="center">
              <Grid item className={mainClasses.createStepTitle}>
                <Grid container direction="row" justify="flex-start" alignItems="center">
                  <Grid item className={mainClasses.createStepNum}><span>2</span></Grid>
                  <Grid item>Step 2: Trust details</Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={12}>
            <Grid container direction="row" justify="flex-start" spacing={2} alignItems="center" className={classes.nameField}>
              <Grid item xs={3} className={`${mainClasses.cardTitle} ${classes.cardTitle}`}>
                Set trust name
              </Grid>
              <Grid item xs={8}>
                <StyledField
                  component={TextField}
                  defaultValue={values[FIELD_NAME]}
                  name={FIELD_NAME}
                  placeholder="Name of the new Trust"
                  text="Trust name"
                  type="text"
                  validate={composeValidators(required, minMaxLength(1, 50))}
                  testId="create-safe-name-field"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={12} className={classes.nameField}>
            <Grid container direction="row" justify="flex-start" spacing={2} alignItems="flex-start">
              <Grid item xs={3} className={`${mainClasses.cardTitle} ${classes.cardTitle}`}>
                Set trustee(s)
                <Tooltip className={classes.infoIcon} title="Your trust can have one or more trustees. We have prefilled the first owner with your connected wallet details, but you are free to change this to a different owner." arrow><HelpOutline /></Tooltip>
              </Grid>
              <Grid item xs={9}>
                {[...Array(Number(numOwners))].map((x, index) => {
                  const addressName = getOwnerAddressBy(index)
                  const ownerName = getOwnerNameBy(index)

                  return (
                    <Row className={classes.owner} key={`owner${index}`} data-testid={`create-safe-owner-row`}>
                      <Col className={classes.ownerName} xs={3}>
                        <Field
                          className={classes.name}
                          component={TextField}
                          name={ownerName}
                          placeholder="Trustee Name*"
                          text="Trustee Name"
                          type="text"
                          validate={composeValidators(required, minMaxLength(1, 50))}
                          testId={`create-safe-owner-name-field-${index}`}
                        />
                      </Col>
                      <Col className={classes.ownerAddress} xs={7}>
                        <StyledAddressInput
                          fieldMutator={(newOwnerAddress) => {
                            const newOwnerName = getNameFromAddressBook(addressBook, newOwnerAddress, {
                              filterOnlyValidName: true,
                            })
                            form.mutators.setValue(addressName, newOwnerAddress)
                            if (newOwnerName) {
                              form.mutators.setValue(ownerName, newOwnerName)
                            }
                          }}
                          // eslint-disable-next-line
                          // @ts-ignore
                          inputAdornment={
                            noErrorsOn(addressName, errors) && {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <CheckCircle className={classes.check} data-testid={`valid-address-${index}`} />
                                </InputAdornment>
                              ),
                            }
                          }
                          name={addressName}
                          placeholder="Trustee Address*"
                          text="Trustee Address"
                          testId={`create-safe-address-field-${index}`}
                        />
                      </Col>
                      <Col center="xs" className={classes.qrcode} middle="xs" xs={1}>
                        <Img
                          alt="Scan QR"
                          height={20}
                          onClick={() => {
                            openQrModal(addressName)
                          }}
                          src={QRIcon}
                        />
                      </Col>
                      <Col center="xs" className={classes.remove} middle="xs" xs={1}>
                        {index > 0 && <Img alt="Delete" height={20} onClick={onRemoveRow(index)} src={trash} />}
                      </Col>
                    </Row>
                  )
                })}
                <Button color="secondary" data-testid="add-owner-btn" onClick={onAddOwner}>
                  <Paragraph noMargin size="lg">
                    {ADD_OWNER_BUTTON}
                  </Paragraph>
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={12}>
            <Grid container direction="row" justify="flex-start" spacing={2} alignItems="center" className={classes.nameField}>
              <Grid item xs={3} className={`${mainClasses.cardTitle} ${classes.cardTitle}`}>
                Trust requires
              </Grid>
              <Grid item className={classes.cardInput}>
                <Field
                  component={SelectField}
                  data-testid="threshold-select-input"
                  name={FIELD_CONFIRMATIONS}
                  validate={composeValidators(required, mustBeInteger, minValue(1))}
                >
                  {[...Array(Number(validOwners))].map((x, index) => (
                    <MenuItem key={`selectOwner${index}`} value={`${index + 1}`} data-testid={`input-${index + 1}`}>
                      {index + 1}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>
              <Grid item data-testid={`create-safe-req-conf-${validOwners}`} className={classes.confDesc}>
                out of {validOwners} trustee(s) to confirm changes and transactions
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Block>
      {qrModalOpen && <ScanQRModal isOpen={qrModalOpen} onClose={closeQrModal} onScan={handleScan} />}
    </>
  )
}

export const SafeOwnersPage = () =>
  function OpenSafeOwnersPage(controls, { errors, form, values }) {
    return (
      <>
        <OpenPaper controls={controls} padding={false}>
          <SafeOwnersForm errors={errors} form={form} otherAccounts={getAccountsFrom(values)} values={values} />
          {controls}
        </OpenPaper>
      </>
    )
  }
