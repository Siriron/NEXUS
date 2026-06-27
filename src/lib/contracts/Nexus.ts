import { createClient } from 'genlayer-js'
import { TransactionStatus } from 'genlayer-js/types'
import { studionet } from 'genlayer-js/chains'
import { CONTRACT_ADDRESS } from '@/config/chains'

export interface AuditReport {
  audit_id: string
  submitter: string
  repo_url: string
  claim: string
  verdict: string
  risk_score: string
  findings: string
  summary: string
  status: string
  created_at: string
}

class NexusContract {
  private contractAddress: `0x${string}`
  private client: ReturnType<typeof createClient>

  constructor(address?: string | null) {
    this.contractAddress = CONTRACT_ADDRESS
    const config: any = { chain: studionet }
    if (address) config.account = address as `0x${string}`
    this.client = createClient(config)
  }

  updateAccount(address: string): void {
    this.client = createClient({
      chain: studionet,
      account: address as `0x${string}`,
    })
  }

  private parseMap(data: any): any {
    if (data instanceof Map) {
      const obj: any = {}
      data.forEach((value: any, key: any) => {
        obj[key] = value instanceof Map ? this.parseMap(value)
          : typeof value === 'bigint' ? Number(value)
          : value
      })
      return obj
    }
    if (typeof data === 'bigint') return Number(data)
    return data
  }

  async getTotal(): Promise<number> {
    try {
      const data: any = await this.client.readContract({
        address: this.contractAddress,
        functionName: 'get_total',
        args: [],
      })
      const parsed = typeof data === 'string' ? JSON.parse(data) : data
      return Number(parsed?.total || 0)
    } catch {
      return 0
    }
  }

  async getAllAudits(limit = 50): Promise<AuditReport[]> {
    try {
      const data: any = await this.client.readContract({
        address: this.contractAddress,
        functionName: 'get_all_audits',
        args: [limit],
      })
      const parsed = typeof data === 'string' ? JSON.parse(data) : data
      if (Array.isArray(parsed)) return parsed as AuditReport[]
      return []
    } catch {
      return []
    }
  }

  async getAudit(auditId: number): Promise<AuditReport | null> {
    try {
      const data: any = await this.client.readContract({
        address: this.contractAddress,
        functionName: 'get_audit',
        args: [auditId],
      })
      const parsed = typeof data === 'string' ? JSON.parse(data) : this.parseMap(data)
      if (parsed?.error) return null
      return parsed as AuditReport
    } catch {
      return null
    }
  }

  async submitAudit(repoUrl: string, claim: string): Promise<any> {
    const hash = await this.client.writeContract({
      address: this.contractAddress,
      functionName: 'submit_audit',
      args: [repoUrl, claim],
      value: BigInt(0),
    })
    const receipt = await this.client.waitForTransactionReceipt({
      hash,
      status: TransactionStatus.FINALIZED,
      retries: 200,
    })
    return receipt
  }
}

export default NexusContract
