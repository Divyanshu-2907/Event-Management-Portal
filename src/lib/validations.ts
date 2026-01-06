import { z } from 'zod'

export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
  capacity: z.number().min(1, 'Capacity must be greater than 0'),
})

export const createAttendeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  eventId: z.string().min(1, 'Event ID is required'),
})

export type CreateEventInput = z.infer<typeof createEventSchema>
export type CreateAttendeeInput = z.infer<typeof createAttendeeSchema>
