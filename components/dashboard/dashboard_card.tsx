'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { NavbarCard } from '@/components/dashboard/navbar_card';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const TableCard = dynamic(() => import('@/components/dashboard/table_card'), {
    loading: () => <p>Loading Table...</p>,
    ssr: false,
});

export const DashboardCard = () => {
    const router = useRouter();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const decodedToken: any = jwtDecode(token);
                setUserData(decodedToken);
            } else {
                router.push('/login');
            }
        }
    }, [router]);

    return (
        <Suspense fallback={<div>Loading Table...</div>}
                  className="space-y-5"
        >
            <NavbarCard userData={userData} />
                <TableCard userData={userData} />
        </Suspense>
    );
};
