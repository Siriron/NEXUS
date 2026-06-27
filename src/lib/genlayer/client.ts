import { createClient } from 'genlayer-js'
import { studionet } from 'genlayer-js/chains'
import { STUDIONET_CONFIG } from '@/config/chains'

interface EthereumProvider {
  isMetaMask?: boolean
  request: (args: { method: string; params?: any[] }) => Promise<any>
  on: (event: string, handler: (...args: any[]) => void) => void
  removeListener: (event: string, handler: (...args: any[]) => void) => void
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

export function isMetaMaskInstalled(): boolean {
  if (typeof window === 'undefined') return false
  return !!window.ethereum?.isMetaMask
}

export function getEthereumProvider(): EthereumProvider | null {
  if (typeof window === 'undefined') return null
  return window.ethereum || null
}

export async function requestAccounts(): Promise<string[]> {
  const provider = getEthereumProvider()
  if (!provider) throw new Error('MetaMask is not installed')
  try {
    return await provider.request({ method: 'eth_requestAccounts' })
  } catch (error: any) {
    if (error.code === 4001) throw new Error('User rejected the connection request')
    throw new Error(`Failed to connect: ${error.message}`)
  }
}

export async function getAccounts(): Promise<string[]> {
  const provider = getEthereumProvider()
  if (!provider) return []
  try {
    return await provider.request({ method: 'eth_accounts' })
  } catch {
    return []
  }
}

export async function getCurrentChainId(): Promise<string | null> {
  const provider = getEthereumProvider()
  if (!provider) return null
  try {
    return await provider.request({ method: 'eth_chainId' })
  } catch {
    return null
  }
}

export async function addGenLayerNetwork(): Promise<void> {
  const provider = getEthereumProvider()
  if (!provider) throw new Error('MetaMask is not installed')
  await provider.request({
    method: 'wallet_addEthereumChain',
    params: [{
      chainId: STUDIONET_CONFIG.chainIdHex,
      chainName: STUDIONET_CONFIG.chainName,
      nativeCurrency: STUDIONET_CONFIG.nativeCurrency,
      rpcUrls: [STUDIONET_CONFIG.rpcUrl],
      blockExplorerUrls: [STUDIONET_CONFIG.explorerUrl],
    }],
  })
}

export async function switchToGenLayerNetwork(): Promise<void> {
  const provider = getEthereumProvider()
  if (!provider) throw new Error('MetaMask is not installed')
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: STUDIONET_CONFIG.chainIdHex }],
    })
  } catch (error: any) {
    const needsAdd =
      error.code === 4902 ||
      /unrecognized chain id/i.test(error.message) ||
      /try adding the chain/i.test(error.message)
    if (needsAdd) {
      await addGenLayerNetwork()
    } else if (error.code !== 4001) {
      throw new Error(`Failed to switch network: ${error.message}`)
    }
  }
}

export async function isOnGenLayerNetwork(): Promise<boolean> {
  const chainId = await getCurrentChainId()
  if (!chainId) return false
  return parseInt(chainId, 16) === STUDIONET_CONFIG.chainId
}

export async function connectMetaMask(): Promise<string> {
  if (!isMetaMaskInstalled()) throw new Error('MetaMask is not installed')
  const accounts = await requestAccounts()
  if (!accounts?.length) throw new Error('No accounts found')
  const onCorrect = await isOnGenLayerNetwork()
  if (!onCorrect) await switchToGenLayerNetwork()
  return accounts[0]
}

export function createGenLayerClient(address?: string) {
  const config: any = { chain: studionet }
  if (address) config.account = address as `0x${string}`
  return createClient(config)
}

export async function getClient() {
  const accounts = await getAccounts()
  return createGenLayerClient(accounts[0])
}
