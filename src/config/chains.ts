export const STUDIONET_CONFIG = {
  chainId: 61999,
  chainIdHex: '0xF22F',
  chainName: 'GenLayer Studio',
  nativeCurrency: { name: 'GEN', symbol: 'GEN', decimals: 18 },
  rpcUrl: import.meta.env.VITE_GENLAYER_RPC_URL || 'https://studio.genlayer.com/api',
  explorerUrl: import.meta.env.VITE_EXPLORER_URL || 'https://explorer-studio.genlayer.com',
}

export const CONTRACT_ADDRESS: `0x${string}` =
  (import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`) ||
  '0xD2d27d4Ca5cD0F38461a991E1F290173c30C292f'

export const EXPLORER_TX_URL = `${STUDIONET_CONFIG.explorerUrl}/tx`
export const DEPLOY_TX = '0x0acea451ca423998a5cc1fd607ff35e1698707837e7c1adf495b49ea273c0672'
