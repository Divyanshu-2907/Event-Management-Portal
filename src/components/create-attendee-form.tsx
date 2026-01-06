'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAttendeeSchema, CreateAttendeeInput } from '@/lib/validations'
import { createAttendee } from '@/lib/actions'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Users } from 'lucide-react'

interface CreateAttendeeFormProps {
  eventId: string
  currentAttendeeCount: number
  capacity: number
}

export function CreateAttendeeForm({ eventId, currentAttendeeCount, capacity }: CreateAttendeeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()
  const isAtCapacity = currentAttendeeCount >= capacity

  const form = useForm<CreateAttendeeInput>({
    resolver: zodResolver(createAttendeeSchema),
    defaultValues: {
      name: '',
      email: '',
      eventId,
    },
  })

  const createAttendeeMutation = useMutation({
    mutationFn: async (data: CreateAttendeeInput) => {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('email', data.email)
      formData.append('eventId', data.eventId)
      
      const result = await createAttendee(formData)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] })
      toast.success('Attendee added successfully!')
      form.reset()
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  const onSubmit = (data: CreateAttendeeInput) => {
    setIsSubmitting(true)
    createAttendeeMutation.mutate(data)
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
      <CardHeader className="pb-6">
        <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Add Attendee</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAtCapacity ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                <Users className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-left">
                <p className="text-red-700 dark:text-red-300 font-medium">Event is at full capacity</p>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">No more attendees can be added.</p>
              </div>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Attendee name" 
                        className="border-slate-300 dark:border-slate-600 dark:bg-slate-800 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="attendee@example.com" 
                        className="border-slate-300 dark:border-slate-600 dark:bg-slate-800 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:bg-indigo-700 dark:focus:bg-indigo-600 transition-colors text-white font-medium py-3"
              >
                {isSubmitting ? 'Adding...' : 'Add Attendee'}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}
