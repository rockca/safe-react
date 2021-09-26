import EtherLogo from 'src/config/assets/token_eth.svg'
import { EnvironmentSettings, ETHEREUM_LAYER, ETHEREUM_NETWORK, NetworkConfig } from 'src/config/networks/network.d'

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: 'http://18.144.29.246:8111/v1',
  txServiceUrl: 'http://18.144.29.246:8110/api/v1',
  safeUrl: 'http://localhost:3000/app',
  gasPriceOracles: [
    {
      url: 'https://www.gasnow.org/api/v3/gas/price?utm_source=:gnosis_safe',
      gasParameter: 'fast',
      gweiFactor: '1',
    },
    {
      url: 'https://ethgasstation.info/json/ethgasAPI.json',
      gasParameter: 'fast',
      gweiFactor: '1e8',
    },
  ],
  rpcServiceUrl: 'http://18.144.29.246:8110',
  safeAppsRpcServiceUrl: 'http://18.144.29.246:8110',
  networkExplorerName: 'Etherscan',
  networkExplorerUrl: 'https://rinkeby.etherscan.io',
  networkExplorerApiUrl: 'https://api-rinkeby.etherscan.io/api',
}

const local: NetworkConfig = {
  environment: {
    production: {
      ...baseConfig,
    },
  },
  network: {
    id: ETHEREUM_NETWORK.LOCAL,
    backgroundColor: '#E8673C',
    textColor: '#ffffff',
    label: 'LocalRPC',
    isTestNet: true,
    ethereumLayer: ETHEREUM_LAYER.L1,
    nativeCoin: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      logoUri: EtherLogo,
    },
  },
}

export default local
