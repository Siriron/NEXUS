import { useState, useCallback } from 'react'
import NexusContract, { type AuditReport } from '@/lib/contracts/Nexus'

export function useNexus(address: string | null) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  const getContract = useCallback(() => new NexusContract(address), [address])

  const getTotal = useCallback(async (): Promise<number> => {
    return getContract().getTotal()
  }, [getContract])

  const getAllAudits = useCallback(async (limit = 50): Promise<AuditReport[]> => {
    return getContract().getAllAudits(limit)
  }, [getContract])

  const getAudit = useCallback(async (id: number): Promise<AuditReport | null> => {
    return getContract().getAudit(id)
  }, [getContract])

  const submitAudit = useCallback(async (repoUrl: string, claim: string): Promise<boolean> => {
    if (!address) { setError('Please connect your wallet first.'); return false }
    setLoading(true)
    setError(null)
    setTxHash(null)
    try {
      const contract = getContract()
      contract.updateAccount(address)
      const receipt = await contract.submitAudit(repoUrl, claim)
      setTxHash(receipt?.hash || receipt?.transaction_hash || null)
      setLoading(false)
      return true
    } catch (err: any) {
      setError(err.message || 'Transaction failed')
      setLoading(false)
      return false
    }
  }, [address, getContract])

  const disputeAudit = useCallback(async (auditId: number, counterClaim: string, counterEvidenceUrl: string): Promise<boolean> => {
    if (!address) { setError('Please connect your wallet first.'); return false }
    setLoading(true)
    setError(null)
    setTxHash(null)
    try {
      const contract = getContract()
      contract.updateAccount(address)
      const receipt = await contract.disputeAudit(auditId, counterClaim, counterEvidenceUrl)
      setTxHash(receipt?.hash || receipt?.transaction_hash || null)
      setLoading(false)
      return true
    } catch (err: any) {
      setError(err.message || 'Dispute transaction failed')
      setLoading(false)
      return false
    }
  }, [address, getContract])

  return { loading, error, txHash, getTotal, getAllAudits, getAudit, submitAudit, disputeAudit }
}
