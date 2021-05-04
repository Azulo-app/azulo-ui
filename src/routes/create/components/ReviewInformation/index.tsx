import TableContainer from '@material-ui/core/TableContainer'
import React, { ReactElement, useEffect, useMemo } from 'react'
import { getExplorerInfo, getNetworkInfo } from 'src/config'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import OpenPaper from 'src/components/Stepper/OpenPaper'
import {
  CreateSafeValues,
  getAccountsFrom,
  getNamesFrom,
  getSafeCreationSaltFrom,
} from 'src/routes/create/utils/safeDataExtractor'

import { FIELD_CONFIRMATIONS, FIELD_NAME, getNumOwnersFrom } from '../fields'
import { useStyles } from './styles'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import { useEstimateSafeCreationGas } from 'src/logic/hooks/useEstimateSafeCreationGas'
import { FormApi } from 'final-form'
import { StepperPageFormProps } from 'src/components/Stepper'
import { LoadFormValues } from 'src/routes/import/container'
import { mainStyles } from 'src/theme/PageStyles'
import Grid from '@material-ui/core/Grid'

type ReviewComponentProps = {
  values: LoadFormValues
  form: FormApi
}

const { nativeCoin } = getNetworkInfo()

const ReviewComponent = ({ values, form }: ReviewComponentProps): ReactElement => {
  const classes = useStyles()
  const mainClasses = mainStyles()

  const names = getNamesFrom(values)
  const addresses = useMemo(() => getAccountsFrom(values), [values])

  const numOwners = getNumOwnersFrom(values)
  const safeCreationSalt = getSafeCreationSaltFrom(values as CreateSafeValues)
  const { gasCostFormatted, gasLimit } = useEstimateSafeCreationGas({ addresses, numOwners, safeCreationSalt })

  useEffect(() => {
    if (gasLimit && form.mutators) {
      form.mutators.setValue('gasLimit', gasLimit)
    }
  }, [gasLimit, form.mutators])

  return (
    <>
      <Grid container direction="column">
        <Grid item sm={12} className={mainClasses.createStepOutActive}>
          <Grid container direction="row" justify="space-evenly" alignItems="center">
            <Grid item className={mainClasses.createStepTitle}>
              <Grid container direction="row" justify="flex-start" alignItems="center">
                <Grid item className={mainClasses.createStepNum}><span>3</span></Grid>
                <Grid item>Step 3: Confirm Trust details</Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={12}>
          <Grid container direction="row" justify="flex-start" spacing={2} alignItems="center" className={classes.nameField}>
            <Grid item xs={3} className={`${mainClasses.cardTitle} ${classes.cardTitle}`}>
              Trust name
            </Grid>
            <Grid item xs={8} data-testid="create-safe-review-name" className={classes.confDesc}>
              {values[FIELD_NAME] ? values[FIELD_NAME] : 'No name added'}
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={12} className={classes.nameField}>
          <Grid container direction="row" justify="flex-start" spacing={2} alignItems="flex-start">
            <Grid item xs={3} className={`${mainClasses.cardTitle} ${classes.cardTitle}`}>
              Trustee(s)
            </Grid>
            <Grid item xs={8}>
              {names.map((name, index) => (
                <React.Fragment key={`name${index}`}>
                  <Row className={classes.owner}>
                    <Col align="center" xs={12}>
                      <EthHashInfo
                        data-testid={`create-safe-owner-name-${index}`}
                        hash={addresses[index]}
                        name={name}
                        showAvatar
                        showCopyBtn
                        explorerUrl={getExplorerInfo(addresses[index])}
                      />
                    </Col>
                  </Row>
                </React.Fragment>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={12} className={classes.nameField}>
          <Grid container direction="row" justify="flex-start" spacing={2} alignItems="center">
            <Grid item xs={3} className={`${mainClasses.cardTitle} ${classes.cardTitle}`}>
              Trust requires
            </Grid>
            <Grid item xs={8} className={classes.confDesc} data-testid={`create-safe-review-req-owners-${values[FIELD_CONFIRMATIONS]}`}>
              {`${values[FIELD_CONFIRMATIONS]} out of ${numOwners} trustee(s) to confirm changes and transactions`}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Row align="center" className={classes.info}>
        <Paragraph color="primary" noMargin size="lg">
          You&apos;re about to create a new Trust that requires a transaction with your currently connected
          wallet. The creation will cost approximately <span className={classes.focusHighlight}>{gasCostFormatted} {nativeCoin.name}</span>. The exact amount will be
          determined by your wallet.
        </Paragraph>
        <br />
        <Paragraph color="primary" noMargin size="lg">
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
      </Row>
    </>
  )
}

export const Review = () =>
  function ReviewPage(controls: React.ReactNode, props: StepperPageFormProps): React.ReactElement {
    console.log('props a', props);
    return (
      <>
        <OpenPaper controls={controls} padding={false}>
          <ReviewComponent {...props} />
          {controls}
        </OpenPaper>
      </>
    )
  }
