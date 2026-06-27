# Deployment Guide

## Contract Deployment

1. Open https://studio.genlayer.com
2. Create new contract → paste `contracts/nexus.py`
3. Click Deploy — no wallet needed in Studio
4. Copy the contract address and deploy TX hash
5. Update `src/config/chains.ts` with the new address

## Frontend Deployment (Vercel)

1. Push to GitHub: https://github.com/Siriron/NEXUS
2. Import repo in Vercel
3. Framework: Vite
4. Root directory: `/` (default)
5. Add environment variables:
   ```
   VITE_CONTRACT_ADDRESS=0xD2d27d4Ca5cD0F38461a991E1F290173c30C292f
   VITE_GENLAYER_RPC_URL=https://studio.genlayer.com/api
   VITE_EXPLORER_URL=https://explorer-studio.genlayer.com
   ```
6. Deploy → https://nexus-genlayer.vercel.app

## MetaMask Setup (for users)

Network will be added automatically when connecting wallet.
Manual setup:
- Network Name: GenLayer Studio
- RPC URL: https://studio.genlayer.com/api
- Chain ID: 61999
- Currency Symbol: GEN
- Explorer: https://explorer-studio.genlayer.com

## Portal Submission

- Type: Project
- GitHub: https://github.com/Siriron/NEXUS
- Live URL: https://nexus-genlayer.vercel.app
