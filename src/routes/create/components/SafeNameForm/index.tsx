import { createStyles, makeStyles } from '@material-ui/core/styles'
import * as React from 'react'
import styled from 'styled-components'

import OpenPaper from 'src/components/Stepper/OpenPaper'
import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import { composeValidators, minMaxLength, required } from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Paragraph from 'src/components/layout/Paragraph'
import { FIELD_NAME } from 'src/routes/create/components/fields'
import { secondary, sm } from 'src/theme/variables'

const styles = createStyles({
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

const useSafeNameStyles = makeStyles(styles)

const SafeNameForm = ({ safeName }: { safeName: string }): React.ReactElement => {
  const classes = useSafeNameStyles()

  return (
    <>
      <Block className={classes.root} margin="lg">
        <StyledField
          component={TextField}
          defaultValue={safeName}
          name={FIELD_NAME}
          placeholder="Name of the new Trust"
          text="Trust name"
          type="text"
          validate={composeValidators(required, minMaxLength(1, 50))}
          testId="create-safe-name-field"
        />
      </Block>
      <Block margin="lg">
        <Paragraph className={classes.links} color="primary" noMargin size="lg">
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

const SafeNamePageComponent = () =>
  function SafeNamePage(controls, { values }): React.ReactElement {
    const { safeName } = values
    return (
      <OpenPaper controls={controls}>
        <SafeNameForm safeName={safeName} />
      </OpenPaper>
    )
  }

export default SafeNamePageComponent
