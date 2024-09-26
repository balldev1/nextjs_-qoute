"use client";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const LazyComponent =
    dynamic(() => import('@/components/login/login_register_card'), {
    ssr: false,
});

const LoginPage = () => {
    return (
        <div>
            <Suspense fallback={<div>กำลังโหลด...</div>}>
                <LazyComponent />
            </Suspense>
        </div>
    )
}

export default LoginPage;
