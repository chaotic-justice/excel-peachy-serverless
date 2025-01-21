export type NewUser = {
  name: string
  /**
   * @format email
   */
  email: string
  id?: number | undefined
  createdAt?: string | undefined
  updatedAt?: string | undefined
}

export type NewDocument = {
  name: string
  workerId: number
  id?: number | undefined
}

export type NewWorker = {
  name: string
  authorId: number
  kind?: "unknown" | "costco" | "sales-agents" | "banking" | null | undefined
  status?: "not_started" | "started" | "failed" | "complete" | null | undefined
  id?: number | undefined
  createdAt?: string | undefined
  updatedAt?: string | undefined
}
