import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import * as React from 'react'

import styled from 'styled-components'
import Stepper, { StepperPage } from 'src/components/Stepper'
import Block from 'src/components/layout/Block'
import Heading from 'src/components/layout/Heading'
import Row from 'src/components/layout/Row'
import DetailsForm, { safeFieldsValidation } from 'src/routes/import/components/DetailsForm'
import OwnerList from 'src/routes/import/components/OwnerList'
import ReviewInformation from 'src/routes/import/components/ReviewInformation'
import { ImportConnect } from 'src/routes/import/components/ImportConnect'
import Grid from '@material-ui/core/Grid'
import { mainStyles } from 'src/theme/PageStyles'

import { history } from 'src/store'
import { secondary, sm } from 'src/theme/variables'
import { LoadFormValues } from '../container'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 24px 0 0 0;
`

const steps = ['Connect', 'Details', 'Owners', 'Review']
const buttonLabels = ['Next', 'Review', 'Review', 'Access']

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

interface LayoutProps {
  network: string
  provider?: string
  userAddress: string
  onLoadSafeSubmit: (values: LoadFormValues) => void
}

const Layout = ({ network, onLoadSafeSubmit, provider, userAddress }: LayoutProps): React.ReactElement => {
  const mainClasses = mainStyles()
  
  return (
    <>
      <Block>
        <Grid container direction="column" justify="center" alignItems="stretch">
          <Grid item xs={12} className={mainClasses.pageTitleHold}><div className={mainClasses.pageTitle}>Access a trust</div></Grid>
          <Grid item><div className={mainClasses.pageDesc}>Access an existing trust, using the trust address.</div></Grid>
        </Grid>
        <Wrapper>
          <Stepper<LoadFormValues>
            buttonLabels={buttonLabels}
            mutators={formMutators}
            onSubmit={onLoadSafeSubmit}
            steps={steps}
            testId="load-safe-form"
          >
            <StepperPage component={ImportConnect} />
            <StepperPage validate={safeFieldsValidation} component={DetailsForm} />
            <StepperPage network={network} component={OwnerList} />
            <StepperPage network={network} userAddress={userAddress} component={ReviewInformation} />
          </Stepper>
        </Wrapper>
      </Block>
    </>
  )
}

export default Layout
