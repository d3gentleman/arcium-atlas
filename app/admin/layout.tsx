import { redirect } from 'next/navigation';
import { checkAdmin } from '@/lib/adminCheck';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await checkAdmin();

  if (!isAdmin) {
    redirect('/login');
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
