'use client'

import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, Mail } from 'lucide-react'

interface Attendee {
  id: string
  name: string
  email: string
  eventId: string
  createdAt: Date
  updatedAt: Date
}

interface AttendeeListProps {
  attendees: Attendee[]
}

export function AttendeeList({ attendees }: AttendeeListProps) {
  if (attendees.length === 0) {
    return (
      <Card className="border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-6">
            <Users className="h-8 w-8 text-slate-500 dark:text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">No attendees yet</h3>
          <p className="text-slate-500 dark:text-slate-400 text-center leading-relaxed max-w-md">Be the first to register for this event!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Attendees ({attendees.length})</h3>
      <div className="space-y-4">
        {attendees.map((attendee) => (
          <Card key={attendee.id} className="border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <Users className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-lg">{attendee.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <Mail className="h-4 w-4" />
                    <span>{attendee.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <Calendar className="h-4 w-4" />
                    <span>Registered {format(new Date(attendee.createdAt), 'PPP')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
