#logout

import { useRouter } from 'next/router';

const LogoutButton = () => {
const router = useRouter();

    // ฟังก์ชันที่ทำงานเมื่อผู้ใช้กดปุ่ม Logout
    const handleLogout = () => {
        // ลบ JWT token จาก localStorage
        localStorage.removeItem('jwtToken');

        // ทำการ redirect ไปที่หน้า login
        router.push('/login');
    };

    return (
        <button
            onClick={handleLogout} // เรียกฟังก์ชัน handleLogout เมื่อกดปุ่ม
            className="btn text-white bg-red-500 hover:bg-red-600 p-2 rounded-md"
        >
            Logout
        </button>
    );
};

export default LogoutButton;


# api token

import { useEffect, useState } from 'react';
import axios from 'axios';

const ProtectedData = () => {
const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('jwtToken'); // ดึง JWT token จาก localStorage

            if (token) {
                try {
                    // เรียก API โดยส่ง JWT token ใน Authorization header
                    const response = await axios.get('http://localhost:3001/protected-route', {
                        headers: {
                            Authorization: `Bearer ${token}`, // ส่ง token ในรูปแบบ Bearer
                        },
                    });
                    setData(response.data); // เก็บข้อมูลจาก API ที่ตอบกลับมา
                } catch (error) {
                    console.error('Error fetching protected data:', error);
                }
            } else {
                console.log('No token found, please log in.');
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Protected Data</h1>
            {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
        </div>
    );
};

export default ProtectedData;

