import { useState, useEffect, useCallback } from 'react'
import {
  connectMetaMask,
  getAccounts,
  isMetaMaskInstalled,
  isOnGenLayerNetwork,
  getEthereumProvider,
} from '@/lib/genlayer/client'
import { onNetworkChange } from '@/config/chains'

interface WalletState {
  address: string | null
  isConnected: boolean
  isCorrectNetwork: boolean
  isConnecting: boolean
  error: string | null
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isCorrectNetwork: false,
    isConnecting: false,
    error: null,
  })

  const checkConnection = useCallback(async () => {
    const accounts = await getAccounts()
    if (accounts.length > 0) {
      const onNetwork = await isOnGenLayerNetwork()
      setState(s => ({
        ...s,
        address: accounts[0],
        isConnected: true,
        isCorrectNetwork: onNetwork,
        error: null,
      }))
    }
  }, [])

  useEffect(() => {
    checkConnection()
    const provider = getEthereumProvider()
    if (!provider) return
    const onAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setState({ address: null, isConnected: false, isCorrectNetwork: false, isConnecting: false, error: null })
      } else {
        setState(s => ({ ...s, address: accounts[0], isConnected: true }))
      }
    }
    const onChainChanged = () => checkConnection()
    provider.on('accountsChanged', onAccountsChanged)
    provider.on('chainChanged', onChainChanged)
    return () => {
      provider.removeListener('accountsChanged', onAccountsChanged)
      provider.removeListener('chainChanged', onChainChanged)
    }
  }, [checkConnection])

  // Re-check "correct network" status when the person switches the
  // active network via the navbar toggle (not just when MetaMask itself
  // reports a chain change).
  useEffect(() => onNetworkChange(() => { checkConnection() }), [checkConnection])

  const connect = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setState(s => ({ ...s, error: 'MetaMask is not installed. Please install it to continue.' }))
      return
    }
    setState(s => ({ ...s, isConnecting: true, error: null }))
    try {
      const address = await connectMetaMask()
      const onNetwork = await isOnGenLayerNetwork()
      setState({ address, isConnected: true, isCorrectNetwork: onNetwork, isConnecting: false, error: null })
    } catch (err: any) {
      setState(s => ({ ...s, isConnecting: false, error: err.message }))
    }
  }, [])

  const disconnect = useCallback(() => {
    setState({ address: null, isConnected: false, isCorrectNetwork: false, isConnecting: false, error: null })
  }, [])

  const shortAddress = state.address
    ? `${state.address.slice(0, 6)}...${state.address.slice(-4)}`
    : null

  return { ...state, shortAddress, connect, disconnect }
}
