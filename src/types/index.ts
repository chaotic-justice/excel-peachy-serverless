export type NewDocument = {
  name: string
  workerId: number
  id?: number | undefined
}

export type NewWorker = {
  name: string
  kind: "unknown" | "costco" | "sales-agents" | "banking"
  id?: number | undefined
  createdAt?: string | undefined
  updatedAt?: string | undefined
}

export type NewReport = {
  workerId: number
  id?: number | undefined
  status?: "not_started" | "started" | "failed" | "complete" | null | undefined
  comment?: string | null | undefined
}
