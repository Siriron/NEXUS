export type NetworkKey = 'studionet' | 'bradbury'

export const NETWORKS = {
  studionet: {
    id: 'studionet' as const,
    name: 'StudioNet',
    chainId: 61999,
    chainIdHex: '0xF22F',
    chainName: 'GenLayer Studio',
    nativeCurrency: { name: 'GEN', symbol: 'GEN', decimals: 18 },
    rpcUrl: import.meta.env.VITE_GENLAYER_RPC_URL || 'https://studio.genlayer.com/api',
    explorerUrl: import.meta.env.VITE_EXPLORER_URL || 'https://explorer-studio.genlayer.com',
    contractAddress: (import.meta.env.VITE_CONTRACT_ADDRESS || '') as `0x${string}`,
    deployTx: import.meta.env.VITE_DEPLOY_TX || '',
  },
  bradbury: {
    id: 'bradbury' as const,
    name: 'Bradbury',
    chainId: 4221,
    chainIdHex: '0x107D',
    chainName: 'GenLayer Bradbury',
    nativeCurrency: { name: 'GEN', symbol: 'GEN', decimals: 18 },
    rpcUrl: import.meta.env.VITE_GENLAYER_RPC_URL_BRADBURY || 'https://rpc-bradbury.genlayer.com',
    explorerUrl: import.meta.env.VITE_EXPLORER_URL_BRADBURY || 'https://explorer-bradbury.genlayer.com',
    contractAddress: (import.meta.env.VITE_CONTRACT_ADDRESS_BRADBURY || '') as `0x${string}`,
    deployTx: import.meta.env.VITE_DEPLOY_TX_BRADBURY || '',
  },
} as const

// Kept for backward compatibility with any code that imported the old
// StudioNet-only constant directly.
export const STUDIONET_CONFIG = NETWORKS.studionet

// Module-level active network selection, mirrored by a Navbar toggle.
let activeNetwork: NetworkKey = 'studionet'
const listeners: Array<(n: NetworkKey) => void> = []

export function getActiveNetwork(): NetworkKey {
  return activeNetwork
}

export function setActiveNetwork(n: NetworkKey) {
  activeNetwork = n
  listeners.forEach((fn) => fn(n))
}

export function onNetworkChange(fn: (n: NetworkKey) => void) {
  listeners.push(fn)
  return () => {
    const i = listeners.indexOf(fn)
    if (i >= 0) listeners.splice(i, 1)
  }
}

export function getContractAddress(): `0x${string}` {
  return NETWORKS[activeNetwork].contractAddress
}

export function getExplorerTxUrl(): string {
  return `${NETWORKS[activeNetwork].explorerUrl}/tx`
}

export function getExplorerAddressUrl(): string {
  return `${NETWORKS[activeNetwork].explorerUrl}/address`
}

export function getDeployTx(): string {
  return NETWORKS[activeNetwork].deployTx
}

// Deprecated static exports — prefer the get*() functions above, which
// respect the current network toggle. Kept only so any remaining direct
// import doesn't hard-crash; they reflect StudioNet at module load time.
export const CONTRACT_ADDRESS: `0x${string}` = NETWORKS.studionet.contractAddress
export const EXPLORER_TX_URL = `${NETWORKS.studionet.explorerUrl}/tx`
export const DEPLOY_TX = NETWORKS.studionet.deployTx
