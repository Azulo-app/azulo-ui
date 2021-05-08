import { Web3Provider } from '@ethersproject/providers'

import { unlockBrowser } from './browserwallet'
import { unlockWalletConnect, isWalletConnect } from './browserwallet_connect'

export const unlockWallet = async (options) => {
  if (isWalletConnect()) return unlockWalletConnect(options)
  return unlockBrowser(options)
}
