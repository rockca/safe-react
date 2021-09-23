import get from 'lodash.get'
import { createSelector } from 'reselect'

import { StoreStructure, Transaction, TxLocation } from 'src/logic/safe/store/models/types/gateway.d'
import { GATEWAY_TRANSACTIONS_ID } from 'src/logic/safe/store/reducer/gatewayTransactions'
import { createHashBasedSelector } from 'src/logic/safe/store/selectors/utils'
import { AppReduxState } from 'src/store'
import { safeAddressFromUrl } from 'src/utils/router'

export const gatewayTransactions = (state: AppReduxState): AppReduxState['gatewayTransactions'] => {
  return state[GATEWAY_TRANSACTIONS_ID]
}

export const historyTransactions = createHashBasedSelector(
  gatewayTransactions,
  (gatewayTransactions): StoreStructure['history'] | undefined => {
    const safeAddress = safeAddressFromUrl()
    return safeAddress ? gatewayTransactions[safeAddress]?.history : undefined
  },
)

export const pendingTransactions = createSelector(
  gatewayTransactions,
  (gatewayTransactions): StoreStructure['queued'] | undefined => {
    const safeAddress = safeAddressFromUrl()
    return safeAddress ? gatewayTransactions[safeAddress]?.queued : undefined
  },
)

export const nextTransactions = createSelector(
  pendingTransactions,
  (pendingTransactions): StoreStructure['queued']['next'] | undefined => {
    return pendingTransactions?.next
  },
)

export const queuedTransactions = createSelector(
  pendingTransactions,
  (pendingTransactions): StoreStructure['queued']['queued'] | undefined => {
    return pendingTransactions?.queued
  },
)

type TxByLocationAttr = { attributeName: string; attributeValue: string | number; txLocation: TxLocation }

type TxByLocation = {
  attributeName: string
  attributeValue: string | number
  transactions: StoreStructure['history'] | StoreStructure['queued']['queued' | 'next']
}

const getTransactionsByLocation = createHashBasedSelector(
  gatewayTransactions,
  currentChainId,
  safeAddressFromUrl,
  (gatewayTransactions, chainId, safeAddress) =>
    (rest: TxByLocationAttr): TxByLocation => ({
      attributeName: rest.attributeName,
      attributeValue: rest.attributeValue,
      transactions: chainId && safeAddress ? get(gatewayTransactions[chainId][safeAddress], rest.txLocation) : [],
    }),
)

export const getTransactionByAttribute = createSelector(
  getTransactionsByLocation,
  (fn: (r: TxByLocationAttr) => TxByLocation) =>
    (rest: TxByLocationAttr): Transaction | undefined => {
      const { attributeName, attributeValue, transactions } = fn(rest)

      if (transactions && attributeValue) {
        for (const [, txs] of Object.entries(transactions)) {
          const foundTx = txs.find((transaction) => transaction[attributeName] === attributeValue)

          if (foundTx) {
            return foundTx
          }
        }
      }
    },
)

export const getTransactionDetails = createSelector(
  getTransactionByAttribute,
  (fn: (rest: TxByLocationAttr) => Transaction | undefined) =>
    (rest: TxByLocationAttr): Transaction['txDetails'] | undefined => {
      const transaction = fn(rest)
      return transaction?.txDetails
    },
)

export const getQueuedTransactionsByNonce = createSelector(
  getTransactionsByLocation,
  (fn: (r: TxByLocationAttr) => TxByLocation) =>
    (rest: TxByLocationAttr): Transaction[] => {
      const { attributeValue, attributeName, transactions } = fn(rest)

      if (attributeName === 'nonce') {
        return transactions?.[attributeValue] ?? []
      }

      return []
    },
)
