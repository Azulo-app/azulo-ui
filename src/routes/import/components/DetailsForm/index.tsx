import InputAdornment from '@material-ui/core/InputAdornment'
import { makeStyles } from '@material-ui/core/styles'
import CheckCircle from '@material-ui/icons/CheckCircle'
import * as React from 'react'
import { FormApi } from 'final-form'

import { ScanQRWrapper } from 'src/components/ScanQRModal/ScanQRWrapper'
import OpenPaper from 'src/components/Stepper/OpenPaper'
import { StepperPageFormProps } from 'src/components/Stepper'
import AddressInput from 'src/components/forms/AddressInput'
import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import { mainStyles } from 'src/theme/PageStyles'
import Grid from '@material-ui/core/Grid'
import {
  mustBeEthereumAddress,
  noErrorsOn,
  required,
  composeValidators,
  minMaxLength,
} from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import { FIELD_IMPORT_ADDRESS, FIELD_LOAD_NAME } from 'src/routes/import/components/fields'
import { secondary } from 'src/theme/variables'
import { getSafeInfo } from 'src/logic/safe/utils/safeInformation'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    maxWidth: '460px',
    margin: '12px auto 0',
  },
  check: {
    color: '#03AE60',
    height: '20px',
  },
  consent: {
    marginTop: '20px',
    textAlign: 'center'
  },
  confText: {
    fontSize: '16px',
    textAlign: 'center'
  },
  center: {
    textAlign: 'center'
  },
  links: {
    '&>a': {
      color: secondary,
    },
  },
})

export const SAFE_ADDRESS_NOT_VALID = 'Address given is not a valid Trust address'

// In case of an error here, it will be swallowed by final-form
// So if you're experiencing any strang behaviours like freeze or hanging
// Don't mind to check if everything is OK inside this function :)
export const safeFieldsValidation = async (values): Promise<Record<string, string>> => {
  const errors = {}
  const address = values[FIELD_IMPORT_ADDRESS]

  if (!address || mustBeEthereumAddress(address) !== undefined) {
    return errors
  }

  // if getSafeInfo does not provide data, it's not a valid safe.
  const safeInfo = await getSafeInfo(address)
  if (!safeInfo) {
    errors[FIELD_IMPORT_ADDRESS] = SAFE_ADDRESS_NOT_VALID
  }

  return errors
}

interface DetailsFormProps {
  errors: Record<string, string>
  form: FormApi
}

const DetailsForm = ({ errors, form }: DetailsFormProps): React.ReactElement => {
  const mainClasses = mainStyles()
  const classes = useStyles()

  const handleScan = (value: string, closeQrModal: () => void): void => {
    form.mutators.setValue(FIELD_IMPORT_ADDRESS, value)
    closeQrModal()
  }

  return (
    <>
      <Block margin="lg">
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
        </Grid>
      </Block>
      <Block margin="lg">
        <Paragraph className={classes.confText} color="primary" noMargin size="md">
          To add an existing Trust, enter the address and a name for the Trust
        </Paragraph>
        <Paragraph className={classes.center} color="primary" noMargin size="md">
          (The name is only stored on your device and is not visible to anyone).
        </Paragraph>
      </Block>
      <Block className={classes.root}>
        <Col xs={11}>
          <Field
            component={TextField}
            name={FIELD_LOAD_NAME}
            placeholder="Name of the Trust"
            text="Trust name"
            type="text"
            validate={composeValidators(required, minMaxLength(1, 50))}
            testId="load-safe-name-field"
          />
        </Col>
      </Block>
      <Block className={classes.root} margin="lg">
        <Col xs={11}>
          <AddressInput
            fieldMutator={(val) => {
              form.mutators.setValue(FIELD_IMPORT_ADDRESS, val)
            }}
            // eslint-disable-next-line
            // @ts-ignore
            inputAdornment={
              noErrorsOn(FIELD_IMPORT_ADDRESS, errors) && {
                endAdornment: (
                  <InputAdornment position="end">
                    <CheckCircle className={classes.check} data-testid="valid-address" />
                  </InputAdornment>
                ),
              }
            }
            name={FIELD_IMPORT_ADDRESS}
            placeholder="Safe Address*"
            text="Safe Address"
            testId="load-safe-address-field"
          />
        </Col>
        <Col center="xs" className={classes} middle="xs" xs={1}>
          <ScanQRWrapper handleScan={handleScan} />
        </Col>
      </Block>
      <Block className={classes.consent} margin="sm">
        <Paragraph className={classes.links} color="primary" noMargin size="md">
          By continuing you consent to the{' '}
          <a href="/#/terms" rel="noopener noreferrer" target="_blank">
            terms of use
          </a>{' '}
          and{' '}
          <a href="/#/privacy" rel="noopener noreferrer" target="_blank">
            privacy policy
          </a>
          .
        </Paragraph>
      </Block>
    </>
  )
}

const DetailsPage = () =>
  function LoadSafeDetails(controls: React.ReactNode, { errors, form }: StepperPageFormProps): React.ReactElement {
    return (
      <>
        <OpenPaper controls={controls} padding={false}>
          <DetailsForm errors={errors} form={form} />
          {controls}
        </OpenPaper>
      </>
    )
  }

export default DetailsPage
