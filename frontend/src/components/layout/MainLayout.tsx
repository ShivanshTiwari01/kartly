import { type PropsWithChildren } from 'react';
import Header from '@components/layout/Header/Header';
import Footer from '@components/layout/Footer/Footer';

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className='flex min-h-screen flex-col bg-background text-text'>
      <Header />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
}
