import { Loader } from '@gnosis.pm/safe-react-components'
import queryString from 'query-string'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { PromiEvent, TransactionReceipt } from 'web3-core'

import { SafeDeployment } from 'src/routes/creating'
import { Layout } from 'src/routes/create/components/Layout'
import Page from 'src/components/layout/Page'
import { getSafeDeploymentTransaction } from 'src/logic/contracts/safeContracts'
import { checkReceiptStatus } from 'src/logic/wallets/ethTransactions'
import {
  CreateSafeValues,
  getAccountsFrom,
  getNamesFrom,
  getOwnersFrom,
  getSafeCreationSaltFrom,
  getSafeNameFrom,
  getThresholdFrom,
} from 'src/routes/create/utils/safeDataExtractor'
import { TRUSTS_ADDRESS, CREATE_ADDRESS, ASSETS_ADDRESS, BENEFICIARY_ADDRESS } from 'src/routes/routes'
import { buildSafe } from 'src/logic/safe/store/actions/fetchSafe'
import { history } from 'src/store'
import { loadFromStorage, removeFromStorage, saveToStorage } from 'src/utils/storage'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { addOrUpdateSafe } from 'src/logic/safe/store/actions/addOrUpdateSafe'
import { useAnalytics } from 'src/utils/googleAnalytics'
import { createActionOpen } from 'src/logic/createAction/store/selectors'

const SAFE_PENDING_CREATION_STORAGE_KEY = 'SAFE_PENDING_CREATION_STORAGE_KEY'

type LoadedSafeType = CreateSafeValues & { txHash: string }

interface SafeCreationQueryParams {
  ownerAddresses: string | string[] | null
  ownerNames: string | string[] | null
  threshold: number | null
  safeName: string | null
}

export interface SafeProps {
  name: string
  ownerAddresses: string[]
  ownerNames: string[]
  threshold: string
}

const validateQueryParams = (queryParams: SafeCreationQueryParams): boolean => {
  const { ownerAddresses, ownerNames, threshold, safeName } = queryParams

  if (!ownerAddresses || !ownerNames || !threshold || !safeName) {
    return false
  }

  if (Number.isNaN(threshold)) {
    return false
  }

  return threshold > 0 && threshold <= ownerAddresses.length
}

const getSafePropsValuesFromQueryParams = (queryParams: SafeCreationQueryParams): SafeProps | undefined => {
  if (!validateQueryParams(queryParams)) {
    return
  }

  const { threshold, safeName, ownerAddresses, ownerNames } = queryParams

  return {
    name: safeName as string,
    threshold: (threshold as number).toString(),
    ownerAddresses: Array.isArray(ownerAddresses) ? ownerAddresses : [ownerAddresses as string],
    ownerNames: Array.isArray(ownerNames) ? ownerNames : [ownerNames as string],
  }
}

export const getSafeProps = async (
  safeAddress: string,
  safeName: string,
  ownersNames: string[],
  ownerAddresses: string[],
): Promise<SafeRecordProps> => {
  const safeProps = await buildSafe(safeAddress, safeName)
  const owners = getOwnersFrom(ownersNames, ownerAddresses)
  safeProps.owners = owners

  return safeProps
}

export const createSafe = (values: CreateSafeValues, userAccount: string): PromiEvent<TransactionReceipt> => {
  const confirmations = getThresholdFrom(values)
  const name = getSafeNameFrom(values)
  const ownersNames = getNamesFrom(values)
  const ownerAddresses = getAccountsFrom(values)
  const safeCreationSalt = getSafeCreationSaltFrom(values)

  const deploymentTx = getSafeDeploymentTransaction(ownerAddresses, confirmations, safeCreationSalt)
  const promiEvent = deploymentTx.send({
    from: userAccount,
    gas: values?.gasLimit,
  })

  promiEvent
    .once('transactionHash', (txHash) => {
      saveToStorage(SAFE_PENDING_CREATION_STORAGE_KEY, { txHash, ...values })
    })
    .then(async (receipt) => {
      await checkReceiptStatus(receipt.transactionHash)
      const safeAddress = receipt.events?.ProxyCreation.returnValues.proxy
      const safeProps = await getSafeProps(safeAddress, name, ownersNames, ownerAddresses)
      // returning info for testing purposes, in app is fully async
      return { safeAddress: safeProps.address, safeTx: receipt }
    })
    .catch((error) => {
      console.error(error)
    })

  return promiEvent
}

const Open = (): React.ReactElement => {
  const [loading, setLoading] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [creationTxPromise, setCreationTxPromise] = useState<PromiEvent<TransactionReceipt>>()
  const [safeCreationPendingInfo, setSafeCreationPendingInfo] = useState<{ txHash?: string } | undefined>()
  const [safePropsFromUrl, setSafePropsFromUrl] = useState<SafeProps | undefined>()
  const userAccount = useSelector(userAccountSelector)
  const dispatch = useDispatch()
  const location = useLocation()
  const { trackEvent } = useAnalytics()
  const [createAction, setCreateAction] = useState(String)
  const createActionRequest = useSelector(createActionOpen)

  useEffect(() => {
    // #122: Allow to migrate an old Multisig by passing the parameters to the URL.
    const query = queryString.parse(location.search, { arrayFormat: 'comma' })
    const { name, owneraddresses, ownernames, threshold } = query

    const safeProps = getSafePropsValuesFromQueryParams({
      ownerAddresses: owneraddresses,
      ownerNames: ownernames,
      threshold: Number(threshold),
      safeName: name as string | null,
    })

    setSafePropsFromUrl(safeProps)
  }, [location])

  // check if there is a safe being created
  useEffect(() => {
    const load = async () => {
      const pendingCreation = await loadFromStorage<{ txHash: string }>(SAFE_PENDING_CREATION_STORAGE_KEY)
      if (pendingCreation && pendingCreation.txHash) {
        setSafeCreationPendingInfo(pendingCreation)
        setShowProgress(true)
      } else {
        setShowProgress(false)
      }
      setLoading(false)
    }

    load()
  }, [])

  // Check what URL to redirect to
  useEffect(() => {
    if (createActionRequest) {
      if (createActionRequest && createActionRequest.createActionOpen) {
        setCreateAction(createActionRequest.createAction)
      }
    }
  }, [createActionRequest])

  const createSafeProxy = async (formValues?: CreateSafeValues) => {
    let values = formValues

    // save form values, used when the user rejects the TX and wants to retry
    if (values) {
      const copy = { ...values }
      saveToStorage(SAFE_PENDING_CREATION_STORAGE_KEY, copy)
    } else {
      values = (await loadFromStorage(SAFE_PENDING_CREATION_STORAGE_KEY)) as CreateSafeValues
    }

    const promiEvent = createSafe(values, userAccount)
    setCreationTxPromise(promiEvent)
    setShowProgress(true)
  }

  const onSafeCreated = async (safeAddress): Promise<void> => {
    const pendingCreation = await loadFromStorage<LoadedSafeType>(SAFE_PENDING_CREATION_STORAGE_KEY)

    const name = pendingCreation ? getSafeNameFrom(pendingCreation) : ''
    const ownersNames = getNamesFrom(pendingCreation as CreateSafeValues)
    const ownerAddresses = pendingCreation ? getAccountsFrom(pendingCreation) : []
    const safeProps = await getSafeProps(safeAddress, name, ownersNames, ownerAddresses)
    let firstURL = ASSETS_ADDRESS

    await dispatch(addOrUpdateSafe(safeProps))

    trackEvent({
      category: 'User',
      action: 'Created a trust',
    })

    removeFromStorage(SAFE_PENDING_CREATION_STORAGE_KEY)
    if (createAction && createAction == 'add_beneficiaries') {
      firstURL = BENEFICIARY_ADDRESS
    }
    const url = {
      pathname: `${TRUSTS_ADDRESS}/${safeProps.address}${firstURL}`,
      state: {
        name,
        tx: pendingCreation?.txHash,
      },
    }

    history.push(url)
  }

  const onCancel = () => {
    removeFromStorage(SAFE_PENDING_CREATION_STORAGE_KEY)
    history.push({
      pathname: `${CREATE_ADDRESS}`,
    })
  }

  const onRetry = async () => {
    const values = await loadFromStorage<{ txHash?: string }>(SAFE_PENDING_CREATION_STORAGE_KEY)
    delete values?.txHash
    await saveToStorage(SAFE_PENDING_CREATION_STORAGE_KEY, values)
    setSafeCreationPendingInfo(values)
    createSafeProxy()
  }

  if (loading || showProgress === undefined) {
    return (
      <>
        <img
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '60px',
            height: 'auto',
            transform: 'translate(-50%, -50%)',
          }}
          src="/resources/azulo_icon_loader.svg"
        />
      </>
    )
  }

  return (
    <Page>
      {showProgress ? (
        <SafeDeployment
          creationTxHash={safeCreationPendingInfo?.txHash}
          onCancel={onRetry}
          onRetry={onRetry}
          onSuccess={onSafeCreated}
          submittedPromise={creationTxPromise}
        />
      ) : (
        <Layout onCallSafeContractSubmit={createSafeProxy} safeProps={safePropsFromUrl} />
      )}
    </Page>
  )
}

export default Open
