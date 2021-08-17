import { Decoder } from 'ecoweb3'
import { SmartContract } from '@/services/contract'
import { WalletParams } from '@/services/ecoc/types'
import { defaultNetwork } from '@/services/ecoc/config'
import { ECOC_MAINNET } from '@/services/ecoc/constants'
import { Params, ExecutionResult } from '@/services/contract/types'
import { toDecimals, toNumber } from '@/services/utils'
import abi from './abi.json'

const mainnetAddress = '2eea1b7f4ac5ee217cfe0933471931c36fe4c402'
const testnetAddress = '2eea1b7f4ac5ee217cfe0933471931c36fe4c402'

const defaultAddress = defaultNetwork === ECOC_MAINNET ? mainnetAddress : testnetAddress
const isMainnet = defaultNetwork === ECOC_MAINNET

const contract = new SmartContract(defaultAddress, abi)

export namespace ecocswap {
  export const address = contract.address
}
