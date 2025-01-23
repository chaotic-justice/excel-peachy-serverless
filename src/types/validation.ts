// Generated by ts-to-zod
import { z } from "zod";

export const newDocumentSchema = z.object({
  name: z.string(),
  workerId: z.number(),
  id: z.union([z.number(), z.undefined()]).optional(),
});

export const newWorkerSchema = z.object({
  name: z.string(),
  kind: z
    .union([z.literal("unknown"), z.literal("costco"), z.literal("sales-agents"), z.literal("banking"), z.undefined()])
    .optional()
    .nullable(),
  id: z.union([z.number(), z.undefined()]).optional(),
  createdAt: z.union([z.string(), z.undefined()]).optional(),
  updatedAt: z.union([z.string(), z.undefined()]).optional(),
})

export const newReportSchema = z.object({
  workerId: z.number(),
  id: z.union([z.number(), z.undefined()]).optional(),
  status: z
    .union([z.literal("not_started"), z.literal("started"), z.literal("failed"), z.literal("complete"), z.undefined()])
    .optional()
    .nullable(),
  comment: z.union([z.string(), z.undefined()]).optional().nullable(),
})
