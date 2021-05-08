import { Web3Provider } from '@ethersproject/providers'
import { getErrorResponse } from './browserwallet_error'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import { useSelector } from 'react-redux'
import { NETWORK } from 'src/utils/constants'
import { safeSelector } from 'src/logic/safe/store/selectors'

export const isWeb3EnabledBrowser = () =>
  typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'

export const unlockBrowser = async ({ debug }) => {
  try {

    if (!isWeb3EnabledBrowser()) {
      return { hasWallet: false, isUnlocked: false }
    }
    const provider = useSelector(providerNameSelector)
    const { address: safeAddress = '' } = useSelector(safeSelector) || {}

    const walletAddress = safeAddress
    const walletProvider = provider
    const network = NETWORK
    console.log('walletAddress', walletAddress)
    console.log('walletProvider', walletProvider)
    console.log('network', network)

    if (debug)
      /* eslint-disable-next-line no-console */
      console.log(
        'Web3Browser wallet loaded: ',
        JSON.stringify({ walletAddress, network })
      )

    return {
      hasWallet: true,
      isUnlocked: true,
      walletAddress: walletAddress[0],
      network,
      walletProvider,
    }
  } catch (error) {
    if (isWeb3EnabledBrowser()) {
      if (debug)
        /* eslint-disable-next-line no-console */
        console.log('Web3 detected in browser, but wallet unlock failed')
      return {
        hasWallet: true,
        isUnlocked: false,
        ...getErrorResponse(error, 'unlockBrowser'),
      }
    }
    return {
      hasWallet: false,
      isUnlocked: false,
      ...getErrorResponse(error, 'unlockBrowser'),
    }
  }
}