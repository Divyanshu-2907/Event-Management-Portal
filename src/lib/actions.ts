'use server'

import { prisma } from '@/lib/prisma'
import { createEventSchema, createAttendeeSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      include: {
        _count: {
          select: {
            attendees: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    })
    return { success: true, data: events }
  } catch (error) {
    console.error('Failed to fetch events:', error)
    return { success: false, error: 'Failed to fetch events' }
  }
}

export async function getEvent(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        attendees: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })
    
    if (!event) {
      return { success: false, error: 'Event not found' }
    }
    
    return { success: true, data: event }
  } catch (error) {
    console.error('Failed to fetch event:', error)
    return { success: false, error: 'Failed to fetch event' }
  }
}

export async function createEvent(formData: FormData) {
  try {
    const validatedFields = createEventSchema.safeParse({
      title: formData.get('title'),
      date: formData.get('date'),
      description: formData.get('description'),
      capacity: Number(formData.get('capacity')),
    })

    if (!validatedFields.success) {
      return { success: false, error: 'Invalid form data' }
    }

    
    const eventDate = new Date(validatedFields.data.date)
    
    const event = await prisma.event.create({
      data: {
        ...validatedFields.data,
        date: eventDate
      }
    })

    revalidatePath('/')
    return { success: true, data: event }
  } catch (error) {
    console.error('Failed to create event:', error)
    return { success: false, error: 'Failed to create event' }
  }
}

export async function createAttendee(formData: FormData) {
  try {
    const validatedFields = createAttendeeSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      eventId: formData.get('eventId'),
    })

    if (!validatedFields.success) {
      return { success: false, error: 'Invalid form data' }
    }

    const event = await prisma.event.findUnique({
      where: { id: validatedFields.data.eventId },
      include: { _count: { select: { attendees: true } } }
    })

    if (!event) {
      return { success: false, error: 'Event not found' }
    }

    if (event._count.attendees >= event.capacity) {
      return { success: false, error: 'Event is at full capacity' }
    }

    const attendee = await prisma.attendee.create({
      data: validatedFields.data
    })

    revalidatePath(`/events/${validatedFields.data.eventId}`)
    return { success: true, data: attendee }
  } catch (error) {
    console.error('Failed to create attendee:', error)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return { success: false, error: 'This email is already registered for this event' }
    }
    return { success: false, error: 'Failed to create attendee' }
  }
}
