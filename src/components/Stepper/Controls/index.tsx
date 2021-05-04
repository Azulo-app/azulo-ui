import * as React from 'react'

import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { boldFont, sm, lg, secondary } from 'src/theme/variables'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import { useSelector } from 'react-redux'
import { mainStyles } from 'src/theme/PageStyles'

const controlStyle = {
  backgroundColor: 'white',
  padding: lg,
  borderRadius: sm,
}

const firstButtonStyle = {
  marginRight: sm,
  fontWeight: boldFont,
  color: secondary,
}

const secondButtonStyle = {
  fontWeight: boldFont,
}

const ColGap = {
  marginRight: sm,
}

interface Props {
  buttonLabels?: string[]
  currentStep: number
  disabled: boolean
  firstPage: boolean
  lastPage: boolean
  penultimate: boolean
  onPrevious: () => void
}

const Controls = ({
  buttonLabels,
  currentStep,
  disabled,
  firstPage,
  lastPage,
  onPrevious,
  penultimate,
}: Props): React.ReactElement => {
  const back = firstPage ? 'Cancel' : 'Back'
  const provider = useSelector(providerNameSelector)
  const mainClasses = mainStyles()

  if (!provider) {
    disabled = true
  }

  let next
  if (!buttonLabels) {
    // eslint-disable-next-line
    next = firstPage ? 'Next step' : penultimate ? 'Review details' : lastPage ? 'Create trust' : 'Next'
  } else {
    next = buttonLabels[currentStep]
  }

  return (
    <Row align="center" grow style={controlStyle}>
      <Col center="xs" xs={12}>
        <Button onClick={onPrevious} size="small" className={`${mainClasses.mainButton} ${mainClasses.noBgButton}`} style={ColGap} type="button">
          {back}
        </Button>
        <Button
          color="primary"
          disabled={disabled}
          size="small"
          className={mainClasses.mainButton}
          type="submit"
          variant="contained"
        >
          {next}
        </Button>
      </Col>
    </Row>
  )
}

export default Controls
