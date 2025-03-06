'use client';

import ClientLayout from './ClientLayout';
import ClientWrapper from '../ClientWrapper';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Inventory', href: '/inventory', icon: '📦' },
    { name: 'Sales', href: '/sales', icon: '💰' },
    { name: 'Transactions', href: '/transactions', icon: '📝' },
    { name: 'Billing', href: '/billing', icon: '🧾' },
    { name: 'Users', href: '/users', icon: '👥' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ClientLayout>
      <ClientWrapper>
        <div className="min-h-screen bg-gray-100">
          {/* Sidebar */}
          <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="p-4 border-b">
                <h1 className="text-xl font-bold text-gray-800">POS System</h1>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 ${
                      pathname === item.href ? 'bg-[#328f90]/10 text-[#328f90]' : ''
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* User Info */}
              <div className="p-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {session?.user?.name || 'Admin User'}
                    </p>
                    <p className="text-xs text-gray-500">{session?.user?.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                    title="Sign out"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="ml-64">
            <main className="p-8">
              {children}
            </main>
          </div>
        </div>
      </ClientWrapper>
    </ClientLayout>
  );
} 