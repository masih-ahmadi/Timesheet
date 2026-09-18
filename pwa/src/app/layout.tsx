import { Metadata } from 'next';
import { FC, ReactNode } from 'react';

import { Providers } from '@/components/providers/Providers';
import '@/styles/globals.css';

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: 'FUNDED',
};

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <html className="h-full bg-slate-100" lang="en">
      <body className="min-h-full text-slate-900 antialiased">
        <Providers>
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
