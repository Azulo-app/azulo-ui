import EtherLogo from 'src/config/assets/token_eth.svg'
import { EnvironmentSettings, ETHEREUM_NETWORK, NetworkConfig, WALLETS } from 'src/config/networks/network.d'

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: '', // https://safe-client.rinkeby.staging.gnosisdev.com/v1
  txServiceUrl: '', // https://safe-transaction.rinkeby.staging.gnosisdev.com/api/v1
  safeAppsUrl: 'https://safe-apps.dev.gnosisdev.com',
  gasPriceOracle: {
    url: 'https://gasstation-mumbai.matic.today',
    gasParameter: 'standard',
  },
  rpcServiceUrl: 'https://rpc-mumbai.maticvigil.com',
  networkExplorerName: 'Etherscan',
  networkExplorerUrl: 'https://explorer-mumbai.maticvigil.com', // https://rinkeby.etherscan.io
  networkExplorerApiUrl: '', // https://api-rinkeby.etherscan.io/api
}

const polygon: NetworkConfig = {
  environment: {
    dev: {
      ...baseConfig,
    },
    staging: {
      ...baseConfig,
      safeAppsUrl: 'https://safe-apps.staging.gnosisdev.com',
    },
    production: {
      ...baseConfig,
      clientGatewayUrl: 'https://safe-client.rinkeby.gnosis.io/v1',
      txServiceUrl: '', // https://safe-transaction.rinkeby.gnosis.io/api/v1
      safeAppsUrl: 'https://apps.gnosis-safe.io',
    },
  },
  network: {
    id: ETHEREUM_NETWORK.MUMBAI_MATIC,
    backgroundColor: '#E8673C',
    textColor: '#ffffff',
    label: 'Polygon',
    isTestNet: true,
    nativeCoin: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      logoUri: EtherLogo,
    },
  },
  disabledWallets: [WALLETS.FORTMATIC],
}

export default polygon
