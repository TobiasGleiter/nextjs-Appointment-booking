'use client';

import { Button } from '@/src/components/ui/button';
import { Calendar } from '@/src/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Locale } from '@/src/lib/lang/i18.config';
import {
  OpeningTime,
  TimeSlots,
} from '@/src/types/database/opening-time-database';
import { Seller } from '@/src/types/database/sellers-database';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import React, { Key } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Icons } from '../base/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from '../ui/use-toast';

interface AppointmentFormProps {
  sections: any;
  buttonBookNow: any;
  error: any;
  lang: Locale;
  sellers: Seller[];
  openingTime: OpeningTime;
}

export function AppointmentForm({
  sections,
  buttonBookNow,
  error,
  lang,
  sellers,
  openingTime,
}: AppointmentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const FormSchema = z.object({
    bookingDate: z.date({
      required_error: error.form.date.description,
    }),
    bookingTimeSlotStart: z.string({
      required_error: error.form.timeSlot.description,
    }),
    sellerId: z.string({ required_error: 'A seller is required' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);

    const bookingDate = new Date(data.bookingDate);
    const formattedBookingDate = format(bookingDate, 'yyyy-MM-dd');
    const fullDateWithTime = `${formattedBookingDate}T${data.bookingTimeSlotStart}Z`;
    const appointmentDate = new Date(fullDateWithTime);
    const utcAppointmentDate = appointmentDate.toUTCString();

    const response = await fetch('/api/v1/appointments/client', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appointmentDate: utcAppointmentDate,
        sellerId: data.sellerId,
      }),
    });

    setIsLoading(false);

    if (!response?.ok) {
      if (response.status === 404) {
        return toast({
          title: 'We are closed on this date!',
          description: 'Sorry, but try a different date.',
        });
      }

      return toast({
        title: 'Error',
        description: 'Error occured',
        variant: 'destructive',
      });
    }

    const { result } = await response.json();

    router.push(`/${lang}/book-now/${result.insertedId}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="bookingDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{sections.date.headline}</FormLabel>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                defaultMonth={field.value}
                disabled={(date) => date <= new Date()}
                initialFocus
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bookingTimeSlotStart"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{sections.timeSlot.headline}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={sections.date.headline} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {openingTime?.timeSlots &&
                    openingTime.timeSlots.map(
                      (timeSlot: TimeSlots, key: Key) => {
                        return (
                          <SelectItem key={key} value={timeSlot.time}>
                            {timeSlot.label}
                          </SelectItem>
                        );
                      }
                    )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sellerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{'Select Your prefered seller'}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={'Select a seller'} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sellers.map((seller: Seller, key: Key) => {
                    return (
                      <SelectItem key={key} value={seller._id.toString()}>
                        {seller.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.add className="mr-2 h-4 w-4" />
          )}
          {buttonBookNow}
        </Button>
      </form>
    </Form>
  );
}