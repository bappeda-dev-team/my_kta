import React, { useState, useEffect } from 'react';


// Komponen utama aplikasi
export default function TabelOrganisasiKTA() {
    // Contoh data untuk tabel
    const [data, setData] = useState([
        {
            id: 1, nomor_induk: '32165445645', name: 'Setyo Wibowo', TTL: 'Madiun, 01-01-1999', jeniskelamin: 'Laki-laki', alamat: 'Madiun', induk: 'Pencak Silat', jumlah: '10',
            ktpPhoto: '',
            threeByFourPhoto: '',
            status: 'Pending',
            nomorInduk: '400.6/81/404.301/PB/12/2025',
            kabupaten: 'NGAWI',
            berlakuTgl: '22 JANUARI 2025',
            sampaiTgl: '31 DESEMBER 2026',
            indukOrganisasi: 'Pencak Silat',
            jumlahAnggota: '150 ORANG',
            kepalaDinas: 'Kepala Dinas Pendidikan Dan Kebudayaan Kabupaten Ngawi',
            pembinaUtamaMuda: 'SUMARSONO,SH.M.SI',
            nip: '1969070519903 1 012',
        },
    ]);

    // State untuk melacak status verifikasi per item
    const [verificationStatus, setVerificationStatus] = useState<Record<number, boolean>>({});

    // State untuk melacak kata kunci pencarian
    const [searchTerm, setSearchTerm] = useState('');

    // Mengatur judul dokumen saat komponen dimuat
    useEffect(() => {
        document.title = 'Halaman Tabel Interaktif';
    }, []);

    // Fungsi untuk menangani verifikasi
    const handleVerify = (id: number) => {
        setVerificationStatus(prevStatus => ({
            ...prevStatus,
            [id]: !prevStatus[id] // Toggle status (true/false)
        }));
        // menambahkan logika untuk menyimpan status ini ke backend di sini
    };

    // Filter data berdasarkan searchTerm
    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.indukOrganisasi.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // State untuk melacak URL foto KTP dan 3x4 per item
    const [photos, setPhotos] = useState(() => {
        const initialPhotos: { [key: number]: { ktp: string; threeByFour: string } } = {};
        data.forEach(item => {
            initialPhotos[item.id] = {
                ktp: item.ktpPhoto,
                threeByFour: item.threeByFourPhoto
            };
        });
        return initialPhotos;
    });

    const handlePhotoChange = (id: string | number, type: any, url: any) => {
        setPhotos(prevPhotos => ({
            ...prevPhotos,
            [id]: {
                ...prevPhotos[Number(id)],
                [type]: url
            }
        }));
        // menambahkan logika untuk menyimpan URL foto ini ke backend di sini
    };

    // Tipe data untuk item
    type DataItem = {
        id: number;
        nomor_induk: string;
        name: string;
        TTL: string;
        jeniskelamin: string;
        alamat: string;
        indukOrganisasi: string;
        jumlahAnggota: string;
        ktpPhoto: string;
        threeByFourPhoto: string;
        status: string;
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

                        {/* Input Filter Pencarian */}
                        <div className="mb-6 flex justify-center no-print">
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama, TTL, alamat, atau induk organisasi..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full max-w-xl px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Tabel Data */}
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-center min-w-[50px] text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">ID</th>
                                        <th scope="col" className="px-6 py-3 text-center min-w-[150px] text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Induk Ketua</th>
                                        <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                                        <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Tempat, Tanggal Lahir</th>
                                        <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Kelamin</th>
                                        <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                                        <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Induk Organisasi</th>
                                        <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Anggota</th>
                                        {/* <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Foto KTP</th>
                                        <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Foto 3x4</th> */}
                                        <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Status Verifikasi</th>
                                        <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg no-print">Aksi</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredData.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 rounded-bl-lg">{item.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.nomor_induk}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.TTL}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.jeniskelamin}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.alamat}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.induk}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.jumlah}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {/* <div className="flex flex-col items-center">
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
                                                </div> */}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${verificationStatus[item.id] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {verificationStatus[item.id] ? 'Terverifikasi' : 'Belum Terverifikasi'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 no-print">
                                                <button
                                                    onClick={() => handleVerify(item.id)}
                                                    className={`py-2 px-4 rounded-md text-white font-semibold transition-colors duration-200 ease-in-out shadow-md mr-2
                            ${verificationStatus[item.id] ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}
                        `}
                                                >
                                                    {verificationStatus[item.id] ? 'Batalkan Verifikasi' : 'Verifikasi'}
                                                </button>
                                                <button
                                                    onClick={() => handlePrintCard(item)}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105"
                                                >
                                                    <svg xmlns="http://www.w3.org/20+09okx00/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                                        <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                                                        <rect x="6" y="14" width="12" height="8"></rect>
                                                    </svg>
                                                    Cetak
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Kartu yang akan dicetak - Hanya terlihat saat itemToPrint tidak null dan saat dicetak */}
                        {itemToPrint && (
                            <div className="print-only-card fixed inset-0 flex items-start justify-right bg-white z-50 p-4">
                                <div className="card-container border border-gray-300 rounded-lg shadow-lg p-6 bg-white flex flex-col items-center justify-center">
                                    <h2 className="text-xl font-bold mb-2 text-center">{itemToPrint.name}</h2>
                                    <div className="flex justify-center mb-4">
                                        {photos[itemToPrint.id]?.threeByFour ? (
                                            <img src={photos[itemToPrint.id].threeByFour} alt="Foto 3x4" className="w-24 h-32 object-cover border-2 border-gray-300" />
                                        ) : (
                                            <img src="https://placehold.co/96x128/E0E0E0/555555?text=3x4" alt="Placeholder 3x4" className="w-24 h-32 object-cover border-2 border-gray-300" />
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-700 text-center">
                                        <p className="mb-1"><span className="font-semibold">Nomor Induk Ketua:</span> {itemToPrint.nomor_induk}</p>
                                        <p className="mb-1"><span className="font-semibold">Tempat/Tgl Lahir:</span> {itemToPrint.TTL}</p>
                                        <p className="mb-1"><span className="font-semibold">Jenis Kelamin:</span> {itemToPrint.jeniskelamin}</p>
                                        <p className="mb-1"><span className="font-semibold">Alamat:</span> {itemToPrint.alamat}</p>
                                        <p className="mb-1"><span className="font-semibold">Induk Organisasi:</span> {itemToPrint.indukOrganisasi}</p>
                                        <p className="mb-1"><span className="font-semibold">Jumlah Anggota:</span> {itemToPrint.jumlahAnggota}</p>

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
