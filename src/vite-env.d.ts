/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTRACT_ADDRESS: string
  readonly VITE_GENLAYER_RPC_URL: string
  readonly VITE_EXPLORER_URL: string
  readonly VITE_DEPLOY_TX: string
  readonly VITE_CONTRACT_ADDRESS_BRADBURY: string
  readonly VITE_GENLAYER_RPC_URL_BRADBURY: string
  readonly VITE_EXPLORER_URL_BRADBURY: string
  readonly VITE_DEPLOY_TX_BRADBURY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
