'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createEventSchema, CreateEventInput } from '@/lib/validations'
import { createEvent } from '@/lib/actions'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

export function CreateEventForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      date: '',
      description: '',
      capacity: 0,
    },
  })

  const createEventMutation = useMutation({
    mutationFn: async (data: CreateEventInput) => {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('date', data.date)
      formData.append('description', data.description || '')
      formData.append('capacity', data.capacity.toString())
      
      const result = await createEvent(formData)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('Event created successfully!')
      form.reset()
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  const onSubmit = (data: CreateEventInput) => {
    setIsSubmitting(true)
    createEventMutation.mutate(data)
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
      <CardHeader className="pb-6">
        <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Create New Event</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Event title" 
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
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="datetime-local" 
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Description</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Event description (optional)" 
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
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Capacity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      placeholder="Maximum attendees" 
                      className="border-slate-300 dark:border-slate-600 dark:bg-slate-800 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
