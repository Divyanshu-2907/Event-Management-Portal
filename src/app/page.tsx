'use client'

import { useQuery } from '@tanstack/react-query'
import { getEvents } from '@/lib/actions'
import { EventList } from '@/components/event-list'
import { CreateEventForm } from '@/components/create-event-form'
import { Skeleton } from '@/components/ui/skeleton'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function Home() {
  const { data: eventsData, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: () => getEvents(),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-12">
            <div>
              <Skeleton className="h-14 w-64 mb-4" />
              <Skeleton className="h-8 w-96 mb-2" />
              <Skeleton className="h-6 w-64" />
            </div>
            <ThemeToggle />
          </div>
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-7 w-3/4" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-7 w-48 mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
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

  if (error || !eventsData?.success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">Event Management Portal</h1>
              <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed">Create events and manage attendee registrations</p>
            </div>
            <ThemeToggle />
          </div>
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-red-500 dark:text-red-400 mb-4">Error loading events</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">Event Management Portal</h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed">Create events and manage attendee registrations</p>
          </div>
          <ThemeToggle />
        </div>
        
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <EventList events={eventsData?.data || []} />
          </div>
          
          <div className="lg:col-span-1">
            <CreateEventForm />
          </div>
        </div>
      </div>
    </div>
  )
}
