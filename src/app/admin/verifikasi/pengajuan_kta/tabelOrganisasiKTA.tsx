import React, { useState, useEffect } from 'react';
import { getCookie } from '@/component/lib/cookie';

//type data

// Komponen utama aplikasi
export default function TabelOrganisasiKTA() {
    // Contoh data untuk tabel
    const [data, setData] = useState([ ]);

    const [Id, setId] = useState<any>(null);
    
        const token = getCookie('token');
        useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchData = async () => {
            try {
               const response = await fetch(`${API_URL}/pengajuan`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const result = await response.json();
                if (data == null) {
                    setData([]);
                } else {
                    setData(result.data);
                }

                console.log(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, [])




    // State untuk melacak status verifikasi per item
    const [verificationStatus, setVerificationStatus] = useState<Record<string, boolean>>({});

    // State untuk melacak kata kunci pencarian
    const [searchTerm, setSearchTerm] = useState('');

    // Mengatur judul dokumen saat komponen dimuat
    useEffect(() => {
        document.title = 'Halaman Tabel Interaktif';
    }, []);

    // Fungsi untuk menangani verifikasi
    const handleVerify = (nama: string) => {
        setVerificationStatus(prevStatus => ({
            ...prevStatus,
            [nama]: !prevStatus[nama] // Toggle status (true/false)
        }));
        // menambahkan logika untuk menyimpan status ini ke backend di sini
    };

    // Filter data berdasarkan searchTerm
    // const filteredData = data.filter(item =>
    //     item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     item.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     item.induk_organisasi.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    // // State untuk melacak URL foto KTP dan 3x4 per item
    // const [photos, setPhotos] = useState(() => {
    //     const initialPhotos: { [key: number]: { ktp: string; threeByFour: string } } = {};
    //     data.forEach(item => {
    //         initialPhotos[item.id] = {
    //             ktp: item.ktpPhoto,
    //             threeByFour: item.threeByFourPhoto
    //         };
    //     });
    //     return initialPhotos;
    // });

    // const handlePhotoChange = (id: string | number, type: any, url: any) => {
    //     setPhotos(prevPhotos => ({
    //         ...prevPhotos,
    //         [id]: {
    //             ...prevPhotos[Number(id)],
    //             [type]: url
    //         }
    //     }));
    //     // menambahkan logika untuk menyimpan URL foto ini ke backend di sini
    // };

    // Tipe data untuk item
    interface DataItem {
        uuid?: string;
        induk_organisasi: string;
        nomor_induk: string;
        jumlah_anggota: string; // Diubah ke string untuk form input, lalu di-parse ke number saat submit
        daerah?: string;
        berlaku_dari?: string;
        berlaku_sampai?: string;
        nama: string; // Nama Organisasi
        tempat_lahir: string; // Tempat Lahir Ketua
        tanggal_lahir: string; // Tanggal Lahir Ketua
        jenis_kelamin: string; // Jenis Kelamin Ketua
        alamat: string; // Alamat Organisasi
        profesi?: string;
        dibuat_di?: string;
        keterangan?: string;
        status?: string;
        catatan?: string;
        file_pendukung?: string[];
        // tanggal_terbit?: string;
        tertanda?: {
            nama: string,
            tanda_tangan: string,
            jabatan: string,
            nip: string,
            pangkat?: string
        }
    };


    // State untuk data item yang akan dicetak sebagai kartu
    const [itemToPrint, setItemToPrint] = useState<DataItem | null>(null);

    // Fungsi untuk menangani pencetakan kartu
    const handlePrintCard = (item: any) => {
        setItemToPrint(item); // Set item yang akan dicetak
        // Beri sedikit jeda agar React memiliki waktu untuk merender kartu sebelum mencetak
        setTimeout(() => {
            window.print();
            setItemToPrint(null); // Reset setelah dialog cetak dimulai
        }, 100);
    };

    // State untuk modal penolakan
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedItemForRejection, setSelectedItemForRejection] = useState<DataItem | null>(null);


    // State untuk notifikasi (pesan dan tipe: 'success' atau 'error')
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');


    // Fungsi untuk menampilkan pesan notifikasi
    const showNotification = (msg: string, type: string) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 5000); // Pesan akan hilang setelah 5 detik
    };

    // Handler untuk menampilkan modal penolakan
    const handleRejectClick = (item: DataItem) => { // Modified to accept item
        setSelectedItemForRejection(item);
        setShowRejectModal(true);
        setRejectionReason(''); // Reset alasan setiap kali modal dibuka
    };

    const submitRejection = async () => {
        if (!rejectionReason.trim()) {
            showNotification('Alasan penolakan tidak boleh kosong!', 'error');
            return;
        }
        if (!selectedItemForRejection) {
            showNotification('Tidak ada item yang dipilih untuk ditolak.', 'error');
            return;
        }
        setIsSubmitting(true);
        // TODO: Add actual rejection logic and API call here
        console.log(`Rejecting item ${selectedItemForRejection.nama} with reason: ${rejectionReason}`);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        showNotification(`Item ${selectedItemForRejection.nama} berhasil ditolak.`, 'success');
        setShowRejectModal(false);
        setIsSubmitting(false);
        setSelectedItemForRejection(null); // Clear selected item
    };

    // Helper untuk menampilkan baris data
    type DataRowProps = {
        label: string;
        value: React.ReactNode;
        labelWidthClass?: string;
    };

    const DataRow: React.FC<DataRowProps> = ({ label, value, labelWidthClass = 'w-40' }) => (
        <div className="flex text-xs mb-0.5">
            <span className={`flex-shrink-0 ${labelWidthClass} font-normal`}>{label}</span>
            <span className="flex-shrink-0 mr-1">:</span>
            <span className="flex-grow font-bold">{value}</span>
        </div>
    );


    return (
        <>
            <div className="w-full">
                <div className="min-h-screen bg-gray-100 p-4 font-sans antialiased">
                    {/* Tailwind CSS CDN dan Font Inter - Dipindahkan ke sini untuk memastikan pemuatan */}
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
                    <style>
                        {`
            body {
                font-family: 'Inter', sans-serif;
            }
            /* Styling untuk print */
            @media print {
                .no-print {
                display: none !important;
                }
                body {
                background-color: #fff;
                }
                table {
                width: 100%;
                border-collapse: collapse;
                }
                th, td {
                border: 1px solid #ccc;
                padding: 8px;
                text-align: left;
                }
                th {
                background-color: #f2f2f2;
                }
            }
            `}
                    </style>

                    <main className="container mx-auto bg-white p-6 rounded-lg shadow-xl">
                        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Data Organisasi</h1>

                        {/* Notification Message */}
                        {message && (
                            <div className={`p-3 mb-4 rounded-md text-white ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                                {message}
                            </div>
                        )}

                        {/* Input Filter Pencarian */}
                        <div className="mb-6 flex justify-center no-print">
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama, TTL, alamat, atau induk organisasi..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Tabel Data */}
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-center min-w-[150px] text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Induk Ketua</th>
                                        <th scope="col" className="px-6 py-3 text-center min-w-[150px] text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                                        <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Tempat, Tanggal Lahir</th>
                                        <th scope="col" className="px-6 py-3 text-center min-w-[100x] text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Kelamin</th>
                                        <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                                        <th scope="col" className="px-6 py-3 text-center min-w-[90px] text-xs font-medium text-gray-500 uppercase tracking-wider">Induk Organisasi</th>
                                        <th scope="col" className="px-6 py-3 text-center min-w-[100px] text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Anggota</th>
                                        {/* <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Foto KTP</th>
                                        <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Foto 3x4</th> */}
                                        <th scope="col" className="px-6 py-3 text-center min-w-[100px] text-xs font-medium text-gray-500 uppercase tracking-wider">Status Verifikasi</th>
                                        <th scope="col" className="px-6 py-3 text-center min-w-[100px] text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg no-print">Aksi</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.map((item: DataItem, index) => (
                                        <tr key={index}>
                                            <td className="px-3 py-2 text-xs text-gray-700 font-medium">{item.nomor_induk || "-"}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.nama || "-"}</td>
                                            <td className="px-3 py-2 text-xs text-gray-700">{item.tempat_lahir}, {new Date(item.tanggal_lahir).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.jenis_kelamin}</td>
                                            <td className="px-3 py-2 text-xs text-gray-700 max-w-xs">{item.alamat}</td>
                                            <td className="px-3 py-2 text-xs text-gray-700">{item.induk_organisasi}</td>
                                            <td className="px-3 py-2 text-xs text-gray-700 text-center">{item.jumlah_anggota}</td>
                                            {/* <td className="px-6 py-4 text-sm text-gray-700">
                                                <div className="flex flex-col items-center">
                                                    {photos[item.id]?.ktp ? (
                                                        <img src={photos[item.id].ktp} alt="Foto KTP" className="w-24 h-auto rounded-md object-cover mb-2" onError={(e: any) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x64/E0E0E0/555555?text=KTP'; }} />
                                                    ) : (
                                                        <img src="https://placehold.co/96x64/E0E0E0/555555?text=KTP" alt="Placeholder KTP" className="w-24 h-auto rounded-md object-cover mb-2" />
                                                    )}
                                                    <input
                                                        type="text"
                                                        placeholder="URL Foto KTP"
                                                        value={photos[item.id]?.ktp || ''}
                                                        onChange={(e) => handlePhotoChange(item.id, 'ktp', e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 no-print"
                                                    />
                                                </div></td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                <div className="flex flex-col items-center">
                                                    {photos[item.id]?.threeByFour ? (
                                                        <img src={photos[item.id].threeByFour} alt="Foto 3x4" className="w-20 h-20 rounded-md object-cover mb-2" onError={(e: any) => { e.target.onerror = null; e.target.src = 'https://placehold.co/80x80/E0E0E0/555555?text=3x4'; }} />
                                                    ) : (
                                                        <img src="https://placehold.co/80x80/E0E0E0/555555?text=3x4" alt="Placeholder 3x4" className="w-20 h-20 rounded-md object-cover mb-2" />
                                                    )}
                                                    <input
                                                        type="text"
                                                        placeholder="URL Foto 3x4"
                                                        value={photos[item.id]?.threeByFour || ''}
                                                        onChange={(e) => handlePhotoChange(item.id, 'threeByFour', e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 no-print"
                                                    />
                                                </div>
                                            </td> */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${verificationStatus[item.nama] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {verificationStatus[item.nama] ? 'Terverifikasi' : 'Belum Terverifikasi'}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2 text-gray-900 no-print">
                                                <div className="flex flex-col space-y-1">
                                                    {/* Tombol Verifikasi/Batalkan Verifikasi */}
                                                    <button
                                                        onClick={() => handleVerify(item.nama)}
                                                        className={`py-1 px-3 text-xs rounded-md text-white font-semibold transition-colors duration-200 ease-in-out shadow-md
          ${verificationStatus[item.nama] ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}
        `}
                                                    >
                                                        {verificationStatus[item.nama] ? 'Batalkan Verifikasi' : 'Verifikasi'}
                                                    </button>

                                                    {/* Tombol Tolak */}
                                                    <button
                                                        onClick={() => handleRejectClick(item)}
                                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 text-xs rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                                                    >
                                                        Tolak
                                                    </button>

                                                    {/* Tombol Cetak */}
                                                    <button
                                                        onClick={() => handlePrintCard(item)}
                                                        className="inline-flex items-center justify-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                                            <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                                                            <rect x="6" y="14" width="12" height="8"></rect>
                                                        </svg>
                                                        Cetak
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {/* {filteredData.length === 0 && (
                                        <tr>
                                            <td colSpan={10} className="px-6 py-4 text-center text-gray-500">
                                                Tidak ada data yang cocok dengan pencarian Anda.
                                            </td>
                                        </tr>
                                    )} */}
                                </tbody>
                            </table>
                        </div>

                        {/* --- CSS untuk Cetak --- */}
                        <style>
                            {`
                @media print {
                    /* Sembunyikan semua elemen kecuali kartu cetak */
                    body > * {
                        visibility: hidden;
                    }

                    /* Tampilkan hanya kartu cetak */
                    .card-print-area {
                        visibility: visible !important;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        background: white;
                        box-shadow: none;
                    }

                    /* Atur ukuran kartu agar sesuai dengan format kertas horizontal (landscape) */
                    .card-container {
                        width: 250mm !important; /* Contoh lebar kartu: 250mm */
                        height: 92mm !important; /* Contoh tinggi kartu: 148mm (A5 landscape) */
                        margin: 10mm; /* Margin sedikit dari tepi kertas */
                        border: 4px solid black !important; /* Border hitam saat cetak */
                        box-shadow: none !important;
                        border-radius: 0 !important;
                    }

                    .text-3xs {
                        font-size: 7pt; /* Font sangat kecil untuk cetak */
                    }
                    .text-2xs {
                        font-size: 8pt;
                    }
                    .text-xs {
                        font-size: 9pt;
                    }
                    .text-sm {
                        font-size: 10pt;
                    }
                }
                `}
                        </style>


                        {/* --- Tampilan Kartu (Area Cetak) --- */}
                        {itemToPrint && (
                            <div className="card-print-area w-full max-w-4xl bg-white shadow-xl rounded-xl p-0.5">
                                <div className="card-container flex border border-gray-900 rounded-lg p-3 w-full h-auto min-h-[300px] text-gray-900">

                                    {/* --- Kolom Kiri: Header & Data Personal --- */}
                                    <div className="flex flex-col w-1/2 pr-3 border-r border-gray-900">

                                        {/* Header Instansi */}
                                        <div className="flex items-start mb-4 border-b border-gray-900 pb-2">
                                            {/* Logo (SVG Sederhana untuk simulasi) */}
                                            <div className="flex-shrink-0 w-12 h-12 mr-3 bg-red-800 flex items-center justify-center rounded-full">
                                                <img src="/logo.png" alt="logo kab ngawi" />
                                            </div>
                                            <div className="text-center leading-tight">
                                                <p className="text-2xs font-bold uppercase">PEMERINTAH KABUPATEN NGAWI</p>
                                                <p className="text-xl font-extrabold uppercase -mt-0.5">DINAS PENDIDIKAN DAN KEBUDAYAAN</p>
                                                <p className="text-3xs mt-0.5">Jalan A.Yani No.05 Ngawi, Telp: 0351-749198</p>
                                            </div>
                                        </div>

                                        {/* Judul Kartu */}
                                        <p className="text-sm font-bold text-center border border-gray-900 px-2 py-0.5 mb-2">
                                            KARTU NOMOR INDUK ORGANISASI KESENIAN
                                        </p>

                                        {/* Data Personal */}
                                        <div className="text-left flex flex-col space-y-0.5">
                                            <DataRow label="NAMA" value={itemToPrint.nama} labelWidthClass='w-24' />
                                            <DataRow label="JENIS KELAMIN" value={itemToPrint.jenis_kelamin} labelWidthClass='w-24' />
                                            <DataRow
                                                label="TEMPAT/TGL LAHIR"
                                                value={`${itemToPrint.tempat_lahir}, ${itemToPrint.tanggal_lahir ? new Date(itemToPrint.tanggal_lahir).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}`}
                                                labelWidthClass='w-24'
                                            />
                                            {/* Alamat menggunakan layout khusus karena panjang */}
                                            <div className="flex text-xs">
                                                <span className="w-24 flex-shrink-0 font-normal">ALAMAT</span>
                                                <span className="flex-shrink-0 mr-1">:</span>
                                                <span className="flex-grow font-bold leading-tight">
                                                    {itemToPrint.alamat}
                                                </span>
                                            </div>
                                            {/* Induk Organisasi menggunakan layout khusus karena panjang */}
                                            <div className="flex text-xs mt-1">
                                                <span className="w-24 flex-shrink-0 font-normal">INDUK ORGANISASI</span>
                                                <span className="flex-shrink-0 mr-1">:</span>
                                                <span className="flex-grow font-bold leading-tight">
                                                    {itemToPrint.induk_organisasi}
                                                </span>
                                            </div>
                                            <DataRow label="JUMLAH ANGGOTA" value={itemToPrint.jumlah_anggota} labelWidthClass='w-24' />
                                        </div>
                                    </div>

                                    {/* --- Kolom Kanan: Nomor Induk & Tanda Tangan --- */}
                                    <div className="text-left flex flex-col w-1/2 pl-3">

                                        {/* Header Kanan */}
                                        <div className="mb-4">
                                            <p className="text-xs font-bold uppercase mb-2">KARTU NOMOR INDUK ORGANISASI KESENIAN</p>
                                            <DataRow label="NOMOR INDUK" value={itemToPrint.nomor_induk} labelWidthClass='w-40' />
                                            <DataRow label="KABUPATEN/KODYA" value={itemToPrint.daerah} labelWidthClass='w-40' />
                                            <DataRow label="BERLAKU DARI TGL." value={itemToPrint.berlaku_dari} labelWidthClass='w-40' />
                                            <DataRow label="SAMPAI TGL." value={itemToPrint.berlaku_sampai} labelWidthClass='w-40' />
                                        </div>

                                        <div className="flex flex-col items-center mt-2 w-full">
                                            {/* 2. Container FOTO dan TANDA TANGAN (Berjejer Horizontal) */}
                                            {/* Menggunakan justify-center untuk menengahkan seluruh blok. items-end untuk meratakan foto dan teks di bagian bawah. */}
                                            <div className="flex justify-center w-full items-end">

                                                {/* BLOK KIRI: KOTAK FOTO 3X4 */}
                                                {/* Jarak 3x4 diletakkan di sisi kiri blok tanda tangan */}
                                                <div className="mr-12 flex-shrink-0 mb-4">
                                                    <div className="w-20 h-28 border-2 border-gray-600 bg-gray-50 flex items-center justify-center text-xs text-gray-500 font-semibold rounded-md shadow-sm">
                                                        {/* Foto 3x4 Placeholder */}
                                                        FOTO 3x4
                                                    </div>
                                                </div>

                                                {/* BLOK KANAN: DETAIL TANDA TANGAN (Vertikal) */}
                                                <div className="text-center text-xs leading-snug flex flex-col items-center">
                                                    {/* Title / Jabatan di Atas */}
                                                    {/* 1. Tanggal Terbit (Atas, rata kanan) */}
                                                    {/* <p className="text-xs text-center w-full mb-1">{itemToPrint.tanggal_terbit}</p> */}
                                                    <div className="leading-tight mb-2">
                                                        <p className="font-semibold">Kepala Dinas</p>
                                                        <p>Pendidikan Dan Kebudayaan</p>
                                                        <p>Kabupaten Ngawi</p>
                                                    </div>

                                                    {/* Placeholder area for signature/stempel (Ruang Kosong) */}
                                                    <div className="h-10 w-30 mb-2 mx-auto">
                                                        {/* Ruang Kosong untuk Tanda Tangan */}
                                                    </div>

                                                    {/* Name and NIP di Bawah */}
                                                    <div className="mt-4">
                                                        <p className="font-bold border-b border-gray-900 inline-block px-1">
                                                            {itemToPrint.tertanda?.nama}
                                                        </p>
                                                        <p className="mt-1">{itemToPrint.tertanda?.jabatan}</p>
                                                        <p>NIP: {itemToPrint.tertanda?.nip}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modal Penolakan */}
                        {showRejectModal && (
                            <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-[9999] p-4">
                                <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
                                    <h3 className="text-2xl font-bold mb-4 text-gray-600">Alasan Penolakan</h3>
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        rows={4}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700 resize-y"
                                        placeholder="Masukkan alasan penolakan di sini..."
                                    ></textarea>
                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            onClick={() => setShowRejectModal(false)}
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                                            disabled={isSubmitting}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            onClick={submitRejection}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                'Kirim Penolakan'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </main>
                </div>

            </div>
        </>
    );
}
