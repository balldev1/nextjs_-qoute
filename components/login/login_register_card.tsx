import {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/navigation";
import Swal from "sweetalert2";

const LoginRegisterCard = () => {

    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:3001/auth/register', {
                email: email,
                password: password
            });

            // แสดง Swal.alert เมื่อการลงทะเบียนสำเร็จ
            await Swal.fire({
                title: 'Success',
                text: 'Registration successful!',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            // ตั้งค่าเป็นสถานะล็อกอินหลังจากการลงทะเบียนสำเร็จ
            setIsLogin(true);
            console.log('Response from API:', response.data);

        } catch (error) {
            console.error('Error registering:', error);

            // แสดง Swal.alert เมื่อเกิดข้อผิดพลาดในการลงทะเบียน
            Swal.fire({
                title: 'Error',
                text: 'Registration failed! Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };


    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3001/auth/login', {
                email: email,
                password: password
            });

            // ได้รับ access_token จาก response
            const accessToken = response.data.access_token;

            // เก็บ access_token ลงใน localStorage
            localStorage.setItem('accessToken', accessToken);

            // แสดง Swal.alert เมื่อเข้าสู่ระบบสำเร็จ
            await Swal.fire({
                title: 'Success',
                text: 'Login successful!',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            // ถ้าสำเร็จ ให้ไปที่หน้าแรก
            router.push('/');
            console.log('Login successful, token stored in localStorage:', accessToken);
        } catch (error) {
            console.error('Error logging in:', error);

            // แสดง Swal.alert เมื่อเกิดข้อผิดพลาดในการเข้าสู่ระบบ
            Swal.fire({
                title: 'Error',
                text: 'Login failed! Please check your credentials.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            console.log(token)
            if (token) {
                router.push('/');
                return;
            }
        }
    }, [router]);

    return (
        <div>
            <div className="flex flex-col space-y-5 shadow-sm shadow-gray-950 rounded-md bg-white p-5">
                <h1 className="text-2xl font-semibold flex text-center items-center justify-center">
                    {isLogin ? 'Login qoute🤣' : 'Register qoute🤣'}
                </h1>

                <div>
                    <div className="label">
                        <span className="text-sm">What is your email?</span>
                    </div>
                    <input
                        type="text"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input input-bordered input-md focus:border-sky-950 focus:border-2 bg-white focus:outline-none shadow-sm shadow-gray-950 w-96"
                    />
                </div>

                <div>
                    <div className="label">
                        <span className="text-sm">What is your password?</span>
                    </div>
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input input-bordered input-md focus:border-sky-950 focus:border-2 bg-white focus:outline-none shadow-sm shadow-gray-950 w-96"
                    />
                </div>

                <div className="flex items-center justify-center gap-5">
                    <button
                        className="btn text-white w-32 hover:bg-opacity-90"
                        onClick={isLogin ? handleLogin : handleRegister}
                    >
                        {isLogin ? 'LOGIN' : 'REGISTER'}
                    </button>
                </div>

                <div
                    onClick={() => setIsLogin(!isLogin)}
                    className="flex gap-2 items-center justify-center text-sm hover:cursor-pointer"
                >
                    <span className="text-gray-500">
                        {isLogin ? "Don't have account?" : 'I have account!'}
                    </span>
                    <span className="text-sky-700 font-semibold">
                        {isLogin ? 'Register Account?' : 'Login '}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LoginRegisterCard;
