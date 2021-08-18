import { reactive, computed } from 'vue'
import { InsufficientBalance } from '@/exceptions/wallet'
import { Wallet, SendPayload, PendingTransaction, TxHistory } from '@/services/wallet/types'
import { TxData, Transaction } from '@/services/ecoc/types'
import { KeyStore } from '@/services/keystore/types'
import { Asset } from '@/services/currency/types'
import { Ecoc as EcocWallet } from '@/services/wallet'
import { getBalanceChanged } from '@/services/wallet/utils'
import * as utils from '@/services/utils'
import { Ecrc20 } from '@/services/ecrc20'
import * as constants from '@/constants'
import { Ecoc as EcocAsset } from '@/services/currency'

const state = reactive<Wallet>({
  address: '',
  network: '',
  keystore: {} as KeyStore,
  assets: EcocAsset.assetInit(),
  txData: { pagesTotal: 0, txs: [] } as TxData,
  selectedAssetIndex: 0,
  lastUpdate: 0,
  lastBlock: 0,
  status: constants.STATUS_SYNCED,
  pendingTransactions: [] as PendingTransaction[],
})

export default function useEcocWallet() {
  const isLogedIn = computed(() => !!state.address)
  const address = computed(() => state.address)
  const assets = computed(() => state.assets)
  const selectedAsset = computed(() => state.assets[state.selectedAssetIndex])

  const _getAssetPrice = async (symbol: string) => {
    if (symbol) {
      return 0
    }

    return 1
  }

  const _updateAsset = (assetData: Asset) => {
    const assetIndex = state.assets.findIndex((asset) => {
      if (asset.tokenInfo && assetData.tokenInfo) {
        return asset.tokenInfo.address === assetData.tokenInfo.address
      }

      return asset.symbol === assetData.symbol
    })

    if (assetIndex < 0) {
      state.assets.push(assetData)
    } else {
      assetData.price = state.assets[assetIndex].price
      state.assets.splice(assetIndex, 1, assetData)
    }
  }

  const _updateTxData = (txData: TxData) => {
    state.txData = txData
  }

  const _appendTxs = (txs: Transaction[]) => {
    const index = state.txData.txs.length
    state.txData.txs.splice(index, 0, ...txs)
  }

  const _updateTime = () => {
    state.lastUpdate = new Date().getTime()
  }

  const connect = async (payload: { keystore: string; password: string }) => {
    const wallet = EcocWallet.importFromKeystore(payload.keystore, payload.password)

    state.address = wallet.address
    state.network = wallet.networkName
    state.keystore = EcocWallet.getKeystore(payload.keystore)

    return wallet.address
  }

  const createWallet = async (payload: { password: string; privatekey?: string }) => {
    let keystore

    if (payload.privatekey) {
      keystore = EcocWallet.keystoreFromWif(payload.privatekey, payload.password)
    } else {
      keystore = await EcocWallet.generateNewKeystore(payload.password)
    }

    return keystore
  }

  const selectAsset = (index: number) => {
    if (state.assets.length < index + 1) {
      return
    }

    state.selectedAssetIndex = index
  }

  const send = async (payload: SendPayload) => {
    const { asset, to, amount, walletParams } = payload

    try {
      // Ecrc20 case
      if (EcocWallet.isEcrc20(asset)) {
        if (utils.toNumber(asset.amount).lt(amount)) {
          throw new InsufficientBalance(`Insufficient Balance`)
        }

        const txid = await EcocWallet.sendEcrc20Balance(asset, to, amount, walletParams)
        return txid
      }

      // ECOC case
      if (utils.toNumber(asset.amount).lt(amount + walletParams.fee)) {
        throw new InsufficientBalance(`Insufficient Balance`)
      }

      const txid = await EcocWallet.sendEcocBalance(to, amount, walletParams)
      return txid
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const updateAssetsBalance = async () => {
    if (!isLogedIn.value) return

    try {
      const ecocAsset = await EcocWallet.getEcocBalance(state.address)
      if (ecocAsset) {
        _updateAsset(ecocAsset)
      }

      let ecrc20Assets = await EcocWallet.getEcrc20Balance(state.address)

      const zeroBalanceAssets = state.assets
        .filter((asset) => asset.symbol !== constants.ECOC)
        .filter(
          (asset) =>
            !ecrc20Assets.find(
              (newToken) => asset.tokenInfo?.address === newToken.tokenInfo?.address
            )
        )
        .map((asset) => {
          asset.amount = 0
          return asset
        })

      ecrc20Assets = [...ecrc20Assets, ...zeroBalanceAssets]

      if (ecrc20Assets.length > 0) {
        ecrc20Assets.forEach((asset) => {
          _updateAsset(asset)
        })
      }

      _updateTime()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const updateAssetsPrice = async () => {
    if (!isLogedIn.value) return

    try {
      state.assets.forEach(async (asset) => {
        const assetPrice = asset.price
        const newPrice = await _getAssetPrice(asset.symbol)

        if (newPrice !== assetPrice) {
          asset.price = newPrice
          _updateTime()
        }
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const updateTxHistory = async () => {
    if (!isLogedIn.value) return

    let txData = { pagesTotal: 0, txs: [] } as TxData
    try {
      if (state.txData.txs.length > 10 && state.txData.pagesTotal > 10) {
        const toUpdatePage = Math.ceil(state.txData.txs.length / 10)

        for (let page = 0; page < toUpdatePage; page++) {
          const newTxData = await EcocWallet.getTxs(state.address, page)
          txData.pagesTotal = newTxData.pagesTotal
          txData.txs.splice(txData.txs.length, 0, ...newTxData.txs)
        }
      } else {
        txData = await EcocWallet.getTxs(state.address)
      }

      _updateTxData(txData)
      _updateTime()
    } catch (error) {
      return Promise.reject(error)
    }

    return true
  }

  const updateTxHistoryByPage = async (pageNum: number) => {
    try {
      const newTxs = await EcocWallet.getTxs(state.address, pageNum)

      _appendTxs(newTxs.txs)
      _updateTime()
    } catch (error) {
      return Promise.reject(error)
    }

    return true
  }

  const updateLastBlock = async () => {
    const lastBlock = await utils.getBlockNumber()
    state.lastBlock = lastBlock
  }

  const getTxHistory = async () => {
    if (state.txData.txs.length <= 0) {
      return []
    }

    const txs = await Promise.all(
      state.txData.txs.map(async (tx) => {
        let currencyType = constants.ECOC
        let value = getBalanceChanged(state.address, tx.vin, tx.vout)
        let type = value.lt(0) ? constants.TYPE_SENT : constants.TYPE_RECEIVED
        let status = tx.confirmations ? constants.STATUS_SUCCEED : constants.STATUS_PENDING
        let contractAddress = ''
        let subtype
        let txResult = []

        if (tx.receipt) {
          status =
            tx.receipt[0].excepted === 'None' ? constants.STATUS_SUCCEED : constants.STATUS_FAILED
          contractAddress = tx.receipt[0].contractAddress
          try {
            txResult = await Ecrc20.decode(tx.receipt)
            const tokenInfo = Ecrc20.getKnownTokensInfo(contractAddress, state.network)

            if (tokenInfo) {
              const decimals = tokenInfo.decimals
              currencyType = tokenInfo.symbol
              subtype = 'ECRC-20'
              value = utils.toDecimals(txResult[0].log[0].value.toNumber(), decimals)
              type = txResult[0].log[0]._eventName
            } else {
              subtype = utils.addressFilter(contractAddress)
            }
          } catch (e) {
            //
          }
        }

        return {
          id: tx.txid,
          type: type,
          subtype: subtype,
          address: contractAddress,
          value: value.abs(),
          currency: currencyType,
          time: tx.time,
          confirmations: tx.confirmations,
          status: status,
          txResult: txResult,
        } as TxHistory
      })
    )

    return txs
  }

  const logout = async () => {
    state.address = ''
    state.network = ''
    state.keystore = {} as KeyStore
    state.assets = EcocAsset.assetInit()
    state.txData = { pagesTotal: 0, txs: [] } as TxData
    state.selectedAssetIndex = 0

    return true
  }

  return {
    state,
    address,
    assets,
    selectedAsset,
    isLogedIn,
    createWallet,
    connect,
    logout,
    selectAsset,
    getTxHistory,
    send,
    updateAssetsBalance,
    updateAssetsPrice,
    updateTxHistory,
    updateTxHistoryByPage,
    updateLastBlock,
  }
}
