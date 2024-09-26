'use client'
import { useRouter } from 'next/navigation';

export const NavbarCard = ({ userData }) => {

    const router = useRouter();
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        router.push('/login');
    };

    return (
        <div >
            {userData ? (
                <div className="flex items-center p-5 bg-white rounded-md shadow-sm shadow-gray-950">
                    <div>
                        <p>Welcome, {userData.email}</p>
                    </div>
                    <div className="ml-auto">
                        <button onClick={handleLogout}
                            className="btn  text-white w-28 hover:bg-opacity-80">
                            LOGOUT
                        </button>
                    </div>
                </div>
            ) : (
                <p></p>
            )}
        </div>
    )
}