"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {Bar, Doughnut} from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,ArcElement } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,ArcElement, Tooltip, Legend);

const TableCard = ({ userData }) => {

    const [votes, setVotes] = useState([]);
    const [addQuote, setAddQuote] = useState('');
    const [quoteData, setQuoteData] = useState([]);
    const [voteParams, setVoteParams] = useState('');
    const [quoteParams, setQuotesParams] = useState('');
    const [createdParams, setCreatedParams] = useState('');
    const [quoteEdit, setQuoteEdit] = useState('');
    const [selectedQuoteId, setSelectedQuoteId] = useState(null);
    const [userDataList, setUserDataList] = useState([]);
    const [page, setPage] = useState(1);  // หน้าเริ่มต้น
    const [limit, setLimit] = useState(5); // แสดงข้อมูล 5 รายการต่อหน้า
    const [totalQuotes, setTotalQuotes] = useState(0);  // เก็บจำนวนข้อมูลทั้งหมด
    const [isLoading, setIsLoading] = useState(false); // เพิ่ม state สำหรับจัดการสถานะการโหลด


    const handleAddQuote = async () => {
        try {
            const token = localStorage.getItem('accessToken'); // ดึง JWT token จาก localStorage

            if (!addQuote.trim()) {
                document.getElementById('my_modal_2').close(); // ปิด modal หลังจากสำเร็จ

                Swal.fire({
                    title: 'Error',
                    text: 'Quote content is required!',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
                return;
            }

            // ส่งคำขอ POST เพื่อสร้างคำคมใหม่
            const response = await axios.post('http://localhost:3001/quotes', {
                content: addQuote, // ส่งค่า addQuote ใน body
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // ส่ง JWT token ใน headers
                }
            });
            document.getElementById('my_modal_2').close(); // ปิด modal หลังจากสำเร็จ
            // แสดงข้อความเมื่อเพิ่มสำเร็จ
            Swal.fire({
                title: 'Success',
                text: 'Your quote has been added successfully.',
                icon: 'success',
                confirmButtonText: 'OK',
            }).then(() => {
                window.location.reload(); // รีเฟรชหน้าเพื่ออัปเดตคำคมที่แสดง
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Something went wrong while adding the quote.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    // ฟังก์ชันค้นหา
    const handleSearch = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('accessToken');

            const params = {
                ...(quoteParams && { term: quoteParams }),
                ...(createdParams && { createdById: createdParams }),
                votes: voteParams ? voteParams : ['true', 'false'],
                page,  // ส่ง page ไปที่ API
                limit,  // ส่ง limit ไปที่ API
            };

            const response = await axios.get(`http://localhost:3001/search/quotes`, {
                params,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setQuoteData(response.data.quotes);  // ตั้งค่า quotes ที่ได้จากการค้นหา
            setTotalQuotes(response.data.total);  // ตั้งค่าจำนวนข้อมูลทั้งหมดที่ได้รับจาก API
            setIsLoading(false)

        } catch (error) {
            setIsLoading(false)
            console.error("Error fetching data", error);
            Swal.fire({
                title: 'Error',
                text: 'Something went wrong during the search process.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleEdit = async (quoteId) => {
        try {
            const token = localStorage.getItem('accessToken'); // ดึง JWT token จาก localStorage
            console.log(token);
            // ส่งคำขอ PUT เพื่ออัปเดต quote ที่เลือก
            const response = await axios.put(`http://localhost:3001/quotes/${quoteId}`,
                {
                    content: quoteEdit, // ส่ง quoteEdit เป็น content ใน body
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // ส่ง JWT token ใน headers
                    },
                }
            );
            document.getElementById('my_modal_1').close(); // ปิด modal ก่อน

            // แสดงข้อความว่าอัปเดตสำเร็จ
            Swal.fire({
                title: 'Updated!',
                text: 'Your quote has been updated successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.reload(); // รีเฟรชหน้าเว็บหลังจากปิด modal
            });
        } catch (error) {
            document.getElementById('my_modal_1').close(); // ปิด modal ก่อน

            console.error('Error updating quote:', error);
            Swal.fire({
                title: 'Error',
                text: 'Something went wrong while updating the quote.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleReset = async () => {
        try {
            // แสดงการแจ้งเตือนถามว่าผู้ใช้ต้องการรีเซ็ตหรือไม่
            const result = await Swal.fire({
                title: 'คุณต้องการรีเซ็ตหรือไม่?',
                text: "การกระทำนี้จะรีเซ็ตค่าทั้งหมด!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ใช่, รีเซ็ต!',
                cancelButtonText: 'ยกเลิก'
            });

            // ถ้าผู้ใช้ยืนยันการรีเซ็ต
            if (result.isConfirmed) {
                setVoteParams('');
                setQuotesParams('');
                setCreatedParams('');

                // แสดงการแจ้งเตือนว่าการรีเซ็ตเสร็จสิ้น
                await Swal.fire({
                    title: 'รีเซ็ตเรียบร้อยแล้ว!',
                    text: 'ข้อมูลทั้งหมดถูกรีเซ็ตแล้ว.',
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                });
            }
            window.location.reload();
        } catch (error) {
            console.error("Error resetting data", error);
        }
    };

    const fetchVotes = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get('http://localhost:3001/quotes/votes', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setVotes(response.data);
        } catch (error) {
            console.error("Error fetching votes:", error);
        }
    };

    const handleVote = async (quoteId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "Do you want to vote for this quote?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, vote it!',
                cancelButtonText: 'Cancel'
            });

            if (result.isConfirmed) {
                const token = localStorage.getItem('accessToken');
                const response = await axios.post(`http://localhost:3001/quotes/${quoteId}/vote`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                Swal.fire({
                    title: 'Voted!',
                    text: 'Your vote has been recorded.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.reload(); // รีเฟรชหน้าเมื่อกดยืนยัน
                });
            }
        } catch (error) {
            if (error.response && error.response.data.message === 'You have already voted for this quote') {
                Swal.fire({
                    title: 'Error',
                    text: '1 email can only vote once.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Something went wrong you have voted.!',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    };

    const handleDeleteVote = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "This will delete your vote for this quote.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
            });

            if (result.isConfirmed) {
                await axios.delete('http://localhost:3001/quotes/vote/delete', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                Swal.fire({
                    title: 'Vote deleted!',
                    text: 'Your vote has been removed.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.reload();
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Something went wrong. You haven\'t voted yet!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleDeleteQuote = async (quoteId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
            });

            if (result.isConfirmed) {
                const token = localStorage.getItem('accessToken');

                // เรียก API ลบคำคม
                await axios.delete(`http://localhost:3001/quotes/${quoteId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // แสดงข้อความสำเร็จ
                await Swal.fire({
                    title: 'Deleted!',
                    text: 'Your quote has been deleted.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });

                // รีเฟรชข้อมูลหรือหน้าหลังจากลบสำเร็จ
                window.location.reload();
            }
        } catch (error) {
            console.error('Error deleting quote:', error);
            Swal.fire({
                title: 'Error',
                text: 'Something went wrong while deleting the quote.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };


    const openEditModal = (quoteId, currentContent) => {
        setSelectedQuoteId(quoteId); // ตั้งค่า quoteId ที่ต้องการแก้ไข
        setQuoteEdit(currentContent); // ตั้งค่าเนื้อหา quote ที่ต้องการแก้ไขในฟิลด์อินพุต
        document.getElementById('my_modal_1').showModal(); // เปิด modal
    };


    // ฟังก์ชันสำหรับเปลี่ยนหน้า
    const handlePageChange = (newPage) => {
        if (newPage > 0 && (newPage - 1) * limit < totalQuotes) {
            setPage(newPage);  // อัปเดต page state
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get('http://localhost:3001/search/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUserDataList(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // โหลดข้อมูลผู้ใช้สำหรับ dropdown
    useEffect(() => {
        handleSearch();  // เรียก handleSearch เมื่อ component mount หรือเมื่อ page เปลี่ยนแปลง
        fetchVotes();
        fetchUsers()

    }, [page]);

    console.log(quoteData)

    // Prepare data for Chart.js
    const prepareChartData = () => {
        const labels = quoteData.map((quote) => quote.createdByEmail || 'Unknown');
        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Number of Quotes per User',
                    data: labels.reduce((acc, label) => {
                        acc[label] = (acc[label] || 0) + 1;
                        return acc;
                    }, {}),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        };

        return data;
    };

    const prepareDoughnutChartData = () => {
        const labels = quoteData.map((quote) => quote.createdByEmail || 'Unknown');
        const labelCount = labels.reduce((acc, label) => {
            acc[label] = (acc[label] || 0) + 1;
            return acc;
        }, {});

        const data = {
            labels: Object.keys(labelCount),
            datasets: [
                {
                    label: 'Number of Quotes per User',
                    data: Object.values(labelCount).map(Number),  // แปลงค่าเป็น number เพื่อให้ตรงกับประเภทที่คาดหวัง
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };

        return data;
    };

    const doughnutChartData = prepareDoughnutChartData();


    const chartData = prepareChartData();

    return (
        <div className="bg-white rounded-md space-y-5 p-5  shadow-sm shadow-gray-950">

            {/* search */}
            <div className="flex gap-5">
                <div>
                    <div className="label">
                        <span className="text-sm">What is your quote?</span>
                    </div>
                    <input
                        type="text"
                        placeholder="quote"
                        className="input input-bordered input-md focus:border-sky-950 focus:border-2 bg-white focus:outline-none shadow-sm shadow-gray-950 w-56"
                        value={quoteParams}
                        onChange={(e) => setQuotesParams(e.target.value)}
                    />
                </div>
                <div>
                    <div className="label">
                        <span className="text-sm">What is vote?</span>
                    </div>
                    <select
                        className="input input-bordered input-md focus:border-sky-950 focus:border-2 bg-white focus:outline-none shadow-sm shadow-gray-950 w-56"
                        value={voteParams}
                        onChange={(e) => setVoteParams(e.target.value)}
                    >
                        <option value="">Show All (both true and false)</option>
                        <option value="true">คำคมที่ได้รับการโหวต</option>
                        <option value="false">คำคมที่ยังไม่ได้รับการโหวต</option>
                    </select>
                </div>
                <div>
                    <div className="label">
                        <span className="text-sm">Who created it?</span>
                    </div>
                    <div>
                        <select
                            className="input input-bordered input-md focus:border-sky-950 focus:border-2 bg-white focus:outline-none shadow-sm shadow-gray-950 w-56"
                            value={createdParams}
                            onChange={(e) => setCreatedParams(e.target.value)}
                        >
                            <option value="">Select a User</option>
                            {userDataList.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.email}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex gap-5">
                    <div>
                        <div className="label">
                            <span className="text-sm ">What is search?</span>
                        </div>
                        <button
                            className="badge font-semibold w-28 rounded-md border-none text-white py-6 hover:bg-opacity-80 shadow-sm shadow-gray-950"
                            onClick={handleSearch}
                        >
                            SEARCH
                        </button>

                    </div>
                    <div>
                        <div className="label">
                            <span className="text-sm ">Need reset?</span>
                        </div>
                        <button onClick={handleReset}
                                disabled={quoteParams === '' && createdParams === '' && voteParams === ''}
                                className="badge font-semibold w-28 rounded-md border-none  text-white py-6  hover:bg-opacity-80 shadow-sm shadow-gray-950">
                            RESET
                        </button>
                    </div>
                    <div>
                        <div className="label">
                            <span className="text-sm ">delete vote?</span>
                        </div>
                        <button onClick={handleDeleteVote}
                                disabled={votes >= 0}
                                className="badge font-semibold w-28 rounded-md border-none  text-white py-6  hover:bg-opacity-80 shadow-sm shadow-gray-950">
                            DELETE VOTE
                        </button>
                    </div>
                </div>
            </div>


            {/* table */}
            <div className="shadow-sm shadow-gray-950 rounded-md ">
                <div className="overflow-x-auto ">
                    <table className="table text-center">
                        <thead>
                        <tr className="text-white text-[16px]">
                            <th className="bg-slate-500">
                                <button
                                    className="btn hover:bg-gray-200 btn-sm bg-white border-none rouned-sm shadow-sm shadow-gray-950 text-gray-950"
                                    onClick={() => document.getElementById('my_modal_2').showModal()}>
                                    + ADD Quote 🤣
                                </button>
                                <dialog id="my_modal_2" className="modal">
                                    <div className="modal-box bg-white shadow-sm shadow-gray-950 text-sky-950">
                                        <h3 className="font-bold text-lg text-sky-950">Add Quote 🤣!</h3>
                                        <div className="mt-4">
                                            <input
                                                type="text"
                                                placeholder="quote"
                                                className="input input-bordered input-md focus:border-sky-950 focus:border-2 bg-white focus:outline-none shadow-sm shadow-gray-950 w-56"
                                                value={addQuote} // ใช้ state quoteEdit เป็นค่าเริ่มต้น
                                                onChange={(e) => setAddQuote(e.target.value)}
                                            />
                                        </div>
                                        <p className="py-4">Please check the accuracy before pressing
                                            confirm.</p>
                                        <div className="flex gap-4 w-full items-center justify-center">
                                            <button onClick={handleAddQuote}
                                                    className="badge font-semibold rounded-md border-none text-white py-4 w-20 hover:bg-opacity-80 shadow-sm shadow-gray-950">
                                                ADD
                                            </button>

                                            <button
                                                onClick={() => document.getElementById('my_modal_2').close()}
                                                className="badge font-semibold rounded-md border-none text-white py-4 w-20 hover:bg-opacity-80 shadow-sm shadow-gray-950">
                                                ยกเลิก
                                            </button>
                                        </div>
                                    </div>
                                </dialog>
                            </th>
                            <th className="bg-slate-500">Quote</th>
                            <th className="bg-slate-500">Created By</th>
                            <th className="bg-slate-500">Voted</th>
                            <th className="bg-slate-500">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {quoteData.length > 0 ? (
                            quoteData.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{(page - 1) * limit + index + 1}</td>
                                    <td>{item.content}</td>
                                    <td>{item.createdByEmail ? item.createdByEmail : 'Unknown'}</td>
                                    <td>
                                        {item.voted ? (
                                            <div
                                                className="badge bg-lime-500 border-none text-white py-4 w-20 font-semibold shadow-sm shadow-gray-950 rounded-md">
                                                <h1>vote</h1>
                                            </div>
                                        ) : (
                                            <div
                                                className="badge bg-red-500 font-semibold rounded-md border-none text-white py-4 w-20 shadow-sm shadow-gray-950">
                                                no vote
                                            </div>
                                        )}
                                    </td>

                                    <td className="space-x-4">
                                        {item.voted ? (
                                            <button
                                                className="badge font-semibold hide rounded-md border-none text-white py-4 w-20 hover:bg-opacity-80 shadow-sm shadow-gray-950"
                                                disabled>
                                                x
                                            </button>
                                        ) : (
                                            <button
                                                className="badge font-semibold rounded-md border-none text-white py-4 w-20 hover:bg-opacity-80 shadow-sm shadow-gray-950"
                                                onClick={() => handleVote(item.id)}>
                                                VOTE
                                            </button>
                                        )}

                                        <button
                                            className="badge font-semibold rounded-md border-none text-white py-4 w-20 hover:bg-opacity-80 shadow-sm shadow-gray-950"
                                            onClick={() => openEditModal(item.id, item.content)}>
                                            EDIT
                                        </button>
                                        <dialog id="my_modal_1" className="modal">
                                            <div className="modal-box bg-white shadow-sm shadow-gray-950">
                                                <h3 className="font-bold text-lg">Edit Quote 🤣!</h3>
                                                <div className="mt-4">
                                                    <input
                                                        type="text"
                                                        placeholder="quote"
                                                        className="input input-bordered input-md focus:border-sky-950 focus:border-2 bg-white focus:outline-none shadow-sm shadow-gray-950 w-56"
                                                        value={quoteEdit} // ใช้ state quoteEdit เป็นค่าเริ่มต้น
                                                        onChange={(e) => setQuoteEdit(e.target.value)} // อัปเดตค่าที่ผู้ใช้พิมพ์
                                                    />
                                                </div>
                                                <p className="py-4">Please check the accuracy before pressing
                                                    confirm.</p>
                                                <div className="flex gap-4 w-full items-center justify-center">
                                                    <button onClick={() => handleEdit(selectedQuoteId)}
                                                            className="badge font-semibold rounded-md border-none text-white py-4 w-20 hover:bg-opacity-80 shadow-sm shadow-gray-950">
                                                        SAVE
                                                    </button>

                                                    <button
                                                        onClick={() => document.getElementById('my_modal_1').close()}
                                                        className="badge font-semibold rounded-md border-none text-white py-4 w-20 hover:bg-opacity-80 shadow-sm shadow-gray-950">
                                                        ยกเลิก
                                                    </button>
                                                </div>
                                            </div>
                                        </dialog>
                                        <button onClick={() => handleDeleteQuote(item.id)}
                                            className="badge font-semibold rounded-md border-none text-white py-4 w-20 hover:bg-opacity-80 shadow-sm shadow-gray-950"
                                            >
                                            Delete
                                        </button>
                                    </td>
                                </tr>

                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No data available</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Pagination */}
            {quoteData.length > 0 && (
                <div className="flex justify-center mt-5 ">
                    <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1} className="btn">
                        Previous
                    </button>
                    <span className="mx-5">Page {page}</span>
                    <button onClick={() => handlePageChange(page + 1)} disabled={page * limit >= totalQuotes}
                            className="btn">
                        Next
                    </button>
                </div>
            )}
            {/* Chart */}
            <div className="flex items-center justify-center shadow-sm   gap-10 ">
            <div className="chart-container   shadow-sm shadow-gray-950 rounded-md p-5 w-1/2" style={{height: '400px'}}>
                <Bar data={chartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                }}/>
            </div>
            <div className="chart-container   shadow-sm shadow-gray-950 rounded-md p-5 w-1/2" style={{height: '400px'}}>
                <Doughnut data={doughnutChartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                }}/>
            </div>
            </div>
        </div>

    );
};
export default TableCard;
