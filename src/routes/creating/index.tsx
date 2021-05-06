import { Loader, Stepper } from '@gnosis.pm/safe-react-components'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { ErrorFooter } from 'src/routes/creating/components/Footer'
import { isConfirmationStep, steps } from './steps'

import Button from 'src/components/layout/Button'
import Heading from 'src/components/layout/Heading'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import { instantiateSafeContracts } from 'src/logic/contracts/safeContracts'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { background, connected, fontColor } from 'src/theme/variables'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import { useSelector } from 'react-redux'

import SuccessSvg from './assets/wallet_success.svg'
import ErrorSvg from './assets/wallet_error.svg'
import TransactionLoading from './assets/wallet_animation.svg'
import { PromiEvent, TransactionReceipt } from 'web3-core'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { mainStyles } from 'src/theme/PageStyles'
import Grid from '@material-ui/core/Grid'
import InfoOutlined from '@material-ui/icons/InfoOutlined'
import { safeNameSelector } from 'src/logic/safe/store/selectors'
import LinearProgress from '@material-ui/core/LinearProgress'
import { mainColor, border, borderRadius, error, errorBG } from 'src/theme/variables'

const useStyles = makeStyles(() => ({
  pageTitleHold: {
    marginTop: '60px',
    marginBottom: '20px'
  },
  pageTitle: {
    marginTop: '15px',
    marginBottom: '15px'
  },
  boxHld: {
    border: `1px solid ${border}`,
    width: '100%',
    maxWidth: '600px',
    borderRadius: borderRadius,
    padding: '25px 45px'
  },
  safeName: {
    fontWeight: 700,
    fontSize: '16px',
  },
  progress: {
    margin: '25px 0 20px',
    width: '100%'
  },
  progressStatus: {
    color: mainColor,
    fontWeight: 600
  },
  infoHld: {
    marginTop: '20px',
    padding: '12px 20px',
    border: `1px solid ${error}`,
    borderRadius: borderRadius,
    background: errorBG,
    '& svg': {
      fill: error
    },
    '& > div > div': {
      color: error,
      marginLeft: '10px'
    }
  }
}));

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 18,
    borderRadius: 25,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 25,
    backgroundColor: mainColor,
  },
}))(LinearProgress);

interface FullParagraphProps {
  inversecolors: string
  stepIndex: number
}

type Props = {
  creationTxHash?: string
  submittedPromise?: PromiEvent<TransactionReceipt>
  onRetry: () => void
  onSuccess: (createdSafeAddress: string) => void
  onCancel: () => void
}

export const SafeDeployment = ({
  creationTxHash,
  onCancel,
  onRetry,
  onSuccess,
  submittedPromise,
}: Props): React.ReactElement => {
  const [loading, setLoading] = useState(true)
  const [stepIndex, setStepIndex] = useState(0)
  const [safeCreationTxHash, setSafeCreationTxHash] = useState('')
  const [createdSafeAddress, setCreatedSafeAddress] = useState('')

  const [error, setError] = useState(false)
  const [intervalStarted, setIntervalStarted] = useState(false)
  const [waitingSafeDeployed, setWaitingSafeDeployed] = useState(false)
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(false)
  const provider = useSelector(providerNameSelector)
  const safeName = useSelector(safeNameSelector) ?? 'Progress of your new Trust'
  const mainClasses = mainStyles()
  const classes = useStyles()

  const confirmationStep = isConfirmationStep(stepIndex)

  const navigateToSafe = () => {
    setContinueButtonDisabled(true)
    onSuccess(createdSafeAddress)
  }

  const onError = (error) => {
    setIntervalStarted(false)
    setWaitingSafeDeployed(false)
    setContinueButtonDisabled(false)
    setError(true)
    console.error(error)
  }

  // discard click event value
  const onRetryTx = () => {
    setStepIndex(0)
    setError(false)
    onRetry()
  }

  const getImage = () => {
    if (error) {
      return ErrorSvg
    }

    if (stepIndex <= 4) {
      return TransactionLoading
    }

    return SuccessSvg
  }

  useEffect(() => {
    const loadContracts = async () => {
      await instantiateSafeContracts()
      setLoading(false)
    }

    if (provider) {
      loadContracts()
    }
  }, [provider])

  // creating safe from from submission
  useEffect(() => {
    if (submittedPromise === undefined) {
      return
    }

    setStepIndex(0)
    submittedPromise
      .once('transactionHash', (txHash) => {
        setSafeCreationTxHash(txHash)
        setStepIndex(1)
        setIntervalStarted(true)
      })
      .on('error', onError)
  }, [submittedPromise])

  // recovering safe creation from txHash
  useEffect(() => {
    if (creationTxHash === undefined) {
      return
    }
    setSafeCreationTxHash(creationTxHash)
    setStepIndex(1)
    setIntervalStarted(true)
  }, [creationTxHash])

  useEffect(() => {
    if (!intervalStarted) {
      return
    }

    const isTxMined = async (txHash) => {
      const web3 = getWeb3()

      const txResult = await web3.eth.getTransaction(txHash)
      if (txResult.blockNumber === null) {
        return false
      }

      const receipt = await web3.eth.getTransactionReceipt(txHash)
      if (!receipt.status) {
        throw Error('TX status reverted')
      }

      return true
    }

    const interval = setInterval(async () => {
      if (stepIndex < 4) {
        setStepIndex(stepIndex + 1)
      }

      // safe created using the form
      if (submittedPromise !== undefined) {
        submittedPromise.then(() => {
          setStepIndex(4)
          setWaitingSafeDeployed(true)
          setIntervalStarted(false)
        })
      }

      // safe pending creation recovered from storage
      if (creationTxHash !== undefined) {
        try {
          const res = await isTxMined(creationTxHash)
          if (res) {
            setStepIndex(4)
            setWaitingSafeDeployed(true)
            setIntervalStarted(false)
          }
        } catch (error) {
          onError(error)
        }
      }
    }, 3000)

    return () => {
      clearInterval(interval)
    }
  }, [creationTxHash, submittedPromise, intervalStarted, stepIndex, error])

  useEffect(() => {
    let interval

    const awaitUntilSafeIsDeployed = async (safeCreationTxHash: string) => {
      try {
        const web3 = getWeb3()
        const receipt = await web3.eth.getTransactionReceipt(safeCreationTxHash)

        let safeAddress

        if (receipt.events) {
          safeAddress = receipt.events.ProxyCreation.returnValues.proxy
        } else {
          // get the address for the just created safe
          const events = web3.eth.abi.decodeLog(
            [
              {
                type: 'address',
                name: 'ProxyCreation',
              },
            ],
            receipt.logs[0].data,
            receipt.logs[0].topics,
          )
          safeAddress = events[0]
        }

        setCreatedSafeAddress(safeAddress)

        interval = setInterval(async () => {
          const code = await web3.eth.getCode(safeAddress)
          if (code !== EMPTY_DATA) {
            setStepIndex(5)
          }
        }, 1000)
      } catch (error) {
        onError(error)
      }
    }

    if (!waitingSafeDeployed) {
      return
    }

    if (typeof safeCreationTxHash === 'string') {
      awaitUntilSafeIsDeployed(safeCreationTxHash)
    }

    return () => {
      clearInterval(interval)
    }
  }, [safeCreationTxHash, waitingSafeDeployed])

  if (loading || stepIndex === undefined) {
    return <Loader size="sm" />
  }

  let FooterComponent
  if (error) {
    FooterComponent = ErrorFooter
  } else if (steps[stepIndex].footerComponent) {
    FooterComponent = steps[stepIndex].footerComponent
  }

  return (
    <>
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item xs={12} className={`${mainClasses.pageTitleHold} ${classes.pageTitleHold}`}>
          <div><Img alt="Status" height={92} src={getImage()} /></div>
          <div className={`${mainClasses.pageTitle} ${classes.pageTitle}`}>Trust creation & validation</div>
        </Grid>
      </Grid>
      <Grid container direction="column">
        <Grid item sm={12}>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item className={classes.boxHld}>
              <Grid container direction="column" justify="center" alignItems="center">
                <Grid item className={classes.safeName}>{safeName}</Grid>
                <Grid item className={classes.progress}>
                  <BorderLinearProgress variant="determinate" value={((stepIndex + 1) / steps.length) * 100} />
                </Grid>
                <Grid item className={classes.progressStatus}>{steps[stepIndex].description || steps[stepIndex].label}</Grid>
                {steps[stepIndex].instruction && (
                  <Grid item className={classes.infoHld}>
                    <Grid container direction="row" justify="center" alignItems="center">
                      <InfoOutlined />
                      <Grid item>{error ? 'You can Cancel or Retry the Trust creation process.' : steps[stepIndex].instruction}</Grid>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container direction="column" justify="center" alignItems="center">
        {FooterComponent ? (
          <FooterComponent
            continueButtonDisabled={continueButtonDisabled}
            onCancel={onCancel}
            onClick={onRetryTx}
            onContinue={navigateToSafe}
            onRetry={onRetryTx}
            safeCreationTxHash={safeCreationTxHash}
          />
        ) : null}
      </Grid>
      {/* <Stepper activeStepIndex={stepIndex} error={error} orientation="horizontal" steps={steps} />
      <Body>
        <BodyImage>
          <Img alt="Vault" height={92} src={getImage()} />
        </BodyImage>

        <BodyDescription>
          <CardTitle>{steps[stepIndex].description || steps[stepIndex].label}</CardTitle>
        </BodyDescription>

        {steps[stepIndex].instruction && (
          <BodyInstruction>
            <FullParagraph
              color="primary"
              inversecolors={confirmationStep.toString()}
              noMargin
              size="md"
              stepIndex={stepIndex}
            >
              {error ? 'You can Cancel or Retry the Trust creation process.' : steps[stepIndex].instruction}
            </FullParagraph>
          </BodyInstruction>
        )}

        <BodyFooter>
          {FooterComponent ? (
            <FooterComponent
              continueButtonDisabled={continueButtonDisabled}
              onCancel={onCancel}
              onClick={onRetryTx}
              onContinue={navigateToSafe}
              onRetry={onRetryTx}
              safeCreationTxHash={safeCreationTxHash}
            />
          ) : null}
        </BodyFooter>
      </Body>

      {stepIndex !== 0 && (
        <BackButton color="primary" minWidth={140} onClick={onCancel} data-testid="safe-creation-back-btn">
          Back
        </BackButton>
      )} */}
    </>
  )
}
