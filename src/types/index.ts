export type NewDocument = {
  name: string
  workerId: number
  id?: number | undefined
}

export type NewWorker = {
  name: string
  kind?: "unknown" | "costco" | "sales-agents" | "banking" | null | undefined
  id?: number | undefined
  createdAt?: string | undefined
  updatedAt?: string | undefined
}

type NewReport = {
  workerId: number
  id?: number | undefined
  status?: "not_started" | "started" | "failed" | "complete" | null | undefined
  comment?: string | null | undefined
}
