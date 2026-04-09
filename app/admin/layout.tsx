import { redirect } from 'next/navigation';
import { checkAdmin } from '@/lib/adminCheck';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await checkAdmin();

  if (!isAdmin) {
    redirect('/login');
  }

  return (
    <div className="col-span-12 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
