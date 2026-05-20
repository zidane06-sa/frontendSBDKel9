'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
    } catch (err) {
      console.error('[v0] Logout failed:', err);
    } finally {
      setLoggingOut(false);
    }
  };

  if (authLoading) return null;
  if (!isAuthenticated) return null;

  return (
    <>
      <Header />
      <div className="flex h-[calc(100vh-64px)]">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground mt-2">Manage your account settings</p>
              </div>

              {/* Account Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Your profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Name</label>
                    <p className="font-semibold">{user?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Email</label>
                    <p className="font-semibold">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Member Since</label>
                    <p className="font-semibold">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : '—'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold mb-2">Logout</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Sign out of your account. You&apos;ll be logged out from all devices.
                    </p>
                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                      disabled={loggingOut}
                    >
                      {loggingOut ? 'Logging out...' : 'Logout'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
