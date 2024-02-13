import { Metadata } from 'next';

import { Icons } from '@/src/components/base/icons';
import { UserAuthForm } from '@/src/components/form/user-auth-form';
import { buttonVariants } from '@/src/components/ui/button';
import { Locale } from '@/src/lib/lang/i18.config';
import { getDictionary } from '@/src/lib/lang/lang';
import { cn } from '@/src/lib/utils';
import Link from 'next/link';
import { Suspense } from 'react';

export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: 'Appointment Bookings',
    description: 'Book your appointment now!',
  };
}

export default async function LoginPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { page } = await getDictionary(lang);

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href={'/'}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute left-4 top-4 md:left-8 md:top-8'
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            {page.login.headline}
          </h1>
          <p className="text-sm text-muted-foreground">
            {page.login.description}
          </p>
        </div>
        <Suspense fallback={'Loading...'}>
          <UserAuthForm lang={lang} />
        </Suspense>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href={'/de/register'}
            className="hover:text-brand underline underline-offset-4"
          >
            {page.login.noAccount}
          </Link>
        </p>
      </div>
    </div>
  );
}
