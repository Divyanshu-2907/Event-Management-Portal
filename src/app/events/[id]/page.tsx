'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { getEvent } from '@/lib/actions'
import { CreateAttendeeForm } from '@/components/create-attendee-form'
import { AttendeeList } from '@/components/attendee-list'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { ArrowLeft, Calendar, Users } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default function EventDetailsPage() {
  const params = useParams()
  const eventId = params.id as string

  const { data: eventData, isLoading, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEvent(eventId),
    enabled: !!eventId,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-12">
            <div>
              <Skeleton className="h-14 w-64 mb-6" />
              <Skeleton className="h-10 w-96 mb-3" />
              <Skeleton className="h-7 w-80" />
            </div>
          </div>
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-7 w-48 mb-6" />
              <div className="space-y-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !eventData?.success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-red-500 dark:text-red-400 mb-4">Event not found</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-6">The event you're looking for doesn't exist.</p>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const event = eventData.data

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Event not found</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-4">The event you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <Button variant="ghost" asChild className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Link>
            </Button>
            <ThemeToggle />
          </div>
          
          <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">{event.title}</h1>
          
          <div className="flex items-center gap-8 text-slate-600 dark:text-slate-400 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <Calendar className="h-5 w-5" />
              </div>
              <span>{format(new Date(event.date), 'PPP p')}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <span>{event.attendees.length}/{event.capacity} attendees</span>
            </div>
          </div>
          
          {event.description && (
            <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed max-w-3xl">{event.description}</p>
          )}
        </div>
        
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AttendeeList attendees={event.attendees} />
          </div>
          
          <div className="lg:col-span-1">
            <CreateAttendeeForm 
              eventId={event.id}
              currentAttendeeCount={event.attendees.length}
              capacity={event.capacity}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
