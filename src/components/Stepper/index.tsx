import FormStep from '@material-ui/core/Step'
import StepContent from '@material-ui/core/StepContent'
import StepLabel from '@material-ui/core/StepLabel'
import Stepper from '@material-ui/core/Stepper'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import React, { useCallback, useEffect, useState } from 'react'
import { FormApi } from 'final-form'

import Controls from './Controls'

import GnoForm from 'src/components/forms/GnoForm'
import Hairline from 'src/components/layout/Hairline'
import { history } from 'src/store'
import { LoadFormValues } from 'src/routes/import/container'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import { useSelector } from 'react-redux'
import { CREATE_ADDRESS, IMPORT_ADDRESS } from 'src/routes/routes'
import StepConnector from '@material-ui/core/StepConnector'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import Check from '@material-ui/icons/Check'

const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  active: {
    '& $line': {
      borderColor: '#7131ff',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#7131ff',
    },
  },
  line: {
    borderColor: '#eaeaf0',
    borderTopWidth: 2,
    borderRadius: 1,
  },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
  root: {
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
  },
  active: {
    color: '#7131ff',
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: '#7131ff',
    zIndex: 1,
    fontSize: 18,
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
    </div>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
};
const transitionProps = {
  timeout: {
    enter: 350,
    exit: 0,
  },
}

export interface StepperPageFormProps {
  values: LoadFormValues
  errors: Record<string, string>
  form: FormApi
}

interface StepperPageProps {
  validate?: (...args: unknown[]) => undefined | Record<string, string> | Promise<undefined | Record<string, string>>
  component: (
    ...args: unknown[]
  ) => (controls: React.ReactElement, formProps: StepperPageFormProps) => React.ReactElement
  [key: string]: unknown
}

// TODO: Remove this magic
/* eslint-disable */
// @ts-ignore
export const StepperPage = ({}: StepperPageProps): null => null
/* eslint-enable */

type StepperFormValues = Record<string, string>

interface Mutators {
  [key: string]: (...args: unknown[]) => void
}

interface GnoStepperProps<V = StepperFormValues> {
  initialValues?: Partial<V>
  onSubmit: (formValues: V) => void
  steps: string[]
  buttonLabels?: string[]
  children: React.ReactNode
  disabledWhenValidating?: boolean
  mutators?: Mutators
  testId?: string
}

function GnoStepper<V>(props: GnoStepperProps<V>): React.ReactElement {
  const [page, setPage] = useState(0)
  const [values, setValues] = useState({})
  const classes = useStyles()

  useEffect(() => {
    if (Object.keys(values).length == 0 && props.initialValues) {
      setValues(props.initialValues)
    }
  }, [props.initialValues])

  const getPageProps: any = (pages) => {
    const aux: any = React.Children.toArray(pages)[page]
    return aux.props
  }

  const updateInitialProps = useCallback((newInitialProps) => {
    setValues(newInitialProps)
  }, [])

  const getActivePageFrom = (pages) => {
    const activePageProps = getPageProps(pages)
    const { component, ...restProps } = activePageProps

    return component({ ...restProps, updateInitialProps })
  }

  const validate = (valuesToValidate) => {
    const { children } = props

    const activePage: any = React.Children.toArray(children)[page]
    return activePage.props.validate ? activePage.props.validate(valuesToValidate) : {}
  }

  const next = async (formValues) => {
    const { children } = props
    const activePageProps = getPageProps(children)
    const { prepareNextInitialProps } = activePageProps

    let pageInitialProps
    if (prepareNextInitialProps) {
      pageInitialProps = await prepareNextInitialProps(formValues)
    }

    const finalValues = { ...formValues, ...pageInitialProps }

    setValues(finalValues)
    let newPage = Math.min(page + 1, React.Children.count(children) - 1)
    history.push(history.location.pathname + '#step-' + (+newPage + 1))
    setPage(newPage)
  }

  const previous = () => {
    history.goBack()
    return setPage(Math.max(page - 1, 0))
  }

  const handleSubmit = async (formValues) => {
    const { children, onSubmit } = props
    const isLastPage = page === React.Children.count(children) - 1
    if (isLastPage) {
      return onSubmit(formValues)
    }

    return next(formValues)
  }

  const isLastPage = (pageNumber: number): boolean => {
    const { steps } = props
    return pageNumber === steps.length - 1
  }

  const { buttonLabels, children, disabledWhenValidating = false, mutators, steps, testId } = props
  const activePage = getActivePageFrom(children)

  const lastPage = isLastPage(page)
  const penultimate = isLastPage(page + 1)

  const provider = useSelector(providerNameSelector)
  if (!provider && page !== 0) {
    setPage(0)
  }

  useEffect(() => {
    return () => {
      if (history.action === "POP") {
        let step = history.location.hash.split("-")
        if (+step[1] > 0 && +step[1] <= steps.length) {
          let newPage = Math.max(+step[1] - 1, 0)
          setPage(newPage)
        } else if (page !== 0) {
          let newPage = Math.max(page - 1, 0)
          setPage(newPage)
        }
      }
    }
  })

  return (
    <>
      <GnoForm
        formMutators={mutators}
        initialValues={values}
        onSubmit={handleSubmit}
        testId={testId}
        validation={validate}
      >
        {(submitting, validating, ...rest) => {
          const disabled = disabledWhenValidating ? submitting || validating : submitting
          const controls = (
            <>
              <Controls
                buttonLabels={buttonLabels}
                currentStep={page}
                disabled={disabled}
                firstPage={page === 0}
                lastPage={lastPage}
                onPrevious={previous}
                penultimate={penultimate}
              />
            </>
          )

          return (
            <>
              <Stepper alternativeLabel activeStep={page} classes={{ root: classes.root }} orientation="horizontal" connector={<QontoConnector />}>
                {steps.map((label, index) => {
                  const labelProps: any = {}
                  const isClickable = index < page

                  if (isClickable) {
                    labelProps.onClick = () => {
                      setPage(index)
                    }
                    labelProps.className = classes.pointerCursor
                  }

                  return (
                    <FormStep key={label}>
                      <StepLabel StepIconComponent={QontoStepIcon} {...labelProps}>{label}</StepLabel>
                    </FormStep>
                  )
                })}
              </Stepper>
              <div>{activePage(controls, ...rest)}</div>
            </>
          )
        }}
      </GnoForm>
    </>
  )
}

const useStyles = makeStyles({
  root: {
    maxWidth: '600px',
    flex: '1 1 auto',
    margin: '0 auto',
    backgroundColor: 'transparent',
    padding: '10px 0 0 15px',
    '& .MuiStepLabel-labelContainer > .MuiStepLabel-label.MuiStepLabel-alternativeLabel': {
      marginTop: 0,
    },
  },
  pointerCursor: {
    '& > .MuiStepLabel-iconContainer': {
      cursor: 'pointer',
    },
    '& > .MuiStepLabel-labelContainer': {
      cursor: 'pointer',
    }
  },
})

export default GnoStepper
