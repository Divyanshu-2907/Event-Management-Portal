'use client'

import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Users } from 'lucide-react'
import Link from 'next/link'
import styles from './event-list.module.css'

interface Event {
  id: string
  title: string
  date: Date
  description: string | null
  capacity: number
  createdAt: Date
  updatedAt: Date
  _count: {
    attendees: number
  }
}

interface EventListProps {
  events: Event[]
}

export function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return (
      <Card className="border-slate-200 dark:border-slate-800 rounded-xl">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Calendar className="h-16 w-16 text-slate-400 dark:text-slate-500 mb-6" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">No events created yet</h3>
          <p className="text-slate-500 dark:text-slate-400 text-center leading-relaxed max-w-md">Create your first event to get started with attendee management.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Events</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id} className="group hover:shadow-lg transition-all duration-200 border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {event.description && (
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">{event.description}</p>
              )}
              
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                <Calendar className="h-4 w-4 mr-3" />
                <span>{format(new Date(event.date), 'PPP p')}</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-3 text-slate-500 dark:text-slate-400" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">{event._count.attendees}/{event.capacity} attendees</span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div 
                      className={`${styles.progressFill} bg-indigo-600 dark:bg-indigo-500 h-3 rounded-full transition-all duration-300`}
                      style={{ 
                        '--progress-width': `${Math.min((event._count.attendees / event.capacity) * 100, 100)}%`
                      } as React.CSSProperties}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {Math.round((event._count.attendees / event.capacity) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:bg-indigo-700 dark:focus:bg-indigo-600 transition-colors">
                <Link href={`/events/${event.id}`}>
                  Manage Event
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
