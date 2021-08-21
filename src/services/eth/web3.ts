import Web3 from 'web3'
import { getProvider, defaultChainID } from '@/services/eth/config'

let web3 = new Web3(getProvider(defaultChainID))

const changeToChainId = (chainId: string): any => {
  web3 = new Web3(getProvider(chainId) || Web3.givenProvider)
}

const tryWithGivenProvider = () => {
  web3 = new Web3(Web3.givenProvider || getProvider(defaultChainID))
}

export { web3, changeToChainId, tryWithGivenProvider }
