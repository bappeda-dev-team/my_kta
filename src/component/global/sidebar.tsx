'use client'

import { useState, useEffect } from 'react'
import { 
    ChevronDown, 
    ChevronRight, 
    LogOut, 
    Menu, 
    X, 
    FileCheck, 
    ClipboardList, 
    PanelLeft, 
    PanelRight,
    UserPlus,       // Ikon untuk Registrasi
    CreditCard,     // Ikon untuk KTA
    ScrollText      // Ikon untuk Izin Rekomendasi
} from 'lucide-react'

export default function Sidebar() {
    const [rekapOpen, setRekapOpen] = useState(false);
    const [verifikasiOpen, setVerifikasiOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // 1. Nilai default diubah menjadi false (collapsed) untuk render yang aman di server/mobile.
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); 

    // 2. Gunakan useEffect untuk mengatur state isSidebarExpanded berdasarkan lebar layar
    // Ini memastikan penentuan lebar (w-64 vs w-20) hanya terjadi di client setelah hydration.
    useEffect(() => {
        // Fungsi untuk menentukan apakah sidebar harus diperluas secara default (untuk desktop)
        const checkIsDesktop = () => typeof window !== 'undefined' && window.innerWidth >= 768; // Tailwind 'md' breakpoint

        // Atur state awal saat mount
        setIsSidebarExpanded(checkIsDesktop());
        
        // Tambahkan event listener untuk penyesuaian saat resize
        const handleResize = () => {
            setIsSidebarExpanded(checkIsDesktop());
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
        }
        
        // Cleanup function
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, []);

    const handleLogout = () => {
        // Simulasikan proses logout
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    // FUNGSI BARU: Menutup sidebar di tampilan mobile setelah link diklik
    const handleLinkClick = () => {
        // Cek jika sidebar terbuka (mode mobile)
        if (isSidebarOpen) {
            setIsSidebarOpen(false);
        }
    };

    // Helper component untuk item link sub-menu. Menerima onItemClick sebagai prop baru.
    type LinkItemProps = {
        href: string;
        icon: React.ComponentType<{ size?: number; className?: string }>;
        label: string;
        onItemClick?: () => void;
    };

    const LinkItem = ({ href, icon: Icon, label, onItemClick }: LinkItemProps) => (
        <a 
            href={href} 
            onClick={onItemClick} // Panggil handler saat diklik
            className="flex items-center space-x-2 p-2 rounded hover:bg-purple-100 transition-colors duration-150 text-gray-700"
        >
            <Icon size={16} className="text-purple-600 min-w-[16px]" />
            <span>{label}</span>
        </a>
    );

    return (
        <>
            {/* Mobile Sidebar Toggle Button */}
            <div className="md:hidden p-4 fixed top-0 left-0 z-50">
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                    className="p-2 text-purple-600 focus:outline-none"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
            
            {/* Overlay for mobile view to close sidebar */}
            {isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                ></div>
            )}

            {/* Main Sidebar */}
            <div className={`
                h-screen bg-white border-r p-4 shadow-sm font-inter 
                fixed md:relative transform transition-all duration-300 z-50
                ${isSidebarExpanded ? 'w-64' : 'w-20'} 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="flex justify-between items-center mb-6">
                    {isSidebarExpanded && <h2 className="text-xl font-bold text-purple-600">Halaman Admin</h2>}
                    <button 
                        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                        className="p-2 rounded hover:bg-purple-100 hidden md:block text-purple-600"
                    >
                        {isSidebarExpanded ? <PanelLeft size={20} /> : <PanelRight size={20} />}
                    </button>
                </div>
                
                <div className="space-y-2 text-gray-700">
                    {/* Verifikasi Section */}
                    <div>
                        <button
                            onClick={() => setVerifikasiOpen(!verifikasiOpen)}
                            className="flex items-center space-x-2 p-2 rounded hover:bg-purple-100 w-full justify-between transition-colors duration-150"
                        >
                            <span className="flex items-center space-x-2 text-purple-600">
                                <FileCheck size={18} />
                                {isSidebarExpanded && <span className="text-gray-700">Verifikasi</span>}
                            </span>
                            {isSidebarExpanded && (verifikasiOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                        </button>

                        {verifikasiOpen && isSidebarExpanded && (
                            <div className="ml-4 space-y-2 border-l border-gray-200 pl-4 py-1">
                                <LinkItem 
                                    href="/admin/verifikasi/registrasi" 
                                    icon={UserPlus} 
                                    label="Data Registrasi"
                                    onItemClick={handleLinkClick} 
                                />
                                <LinkItem 
                                    href="/admin/verifikasi/pengajuan_kta" 
                                    icon={CreditCard} 
                                    label="Pengajuan KTA"
                                    onItemClick={handleLinkClick} 
                                />
                                <LinkItem 
                                    href="/admin/verifikasi/pengajuan-izin" 
                                    icon={ScrollText} 
                                    label="Pengajuan Izin Rekomendasi"
                                    onItemClick={handleLinkClick} 
                                />
                            </div>
                        )}
                    </div>

                    {/* Rekap Data Section */}
                    <div>
                        <button
                            onClick={() => setRekapOpen(!rekapOpen)}
                            className="flex items-center space-x-2 p-2 rounded hover:bg-purple-100 w-full justify-between transition-colors duration-150"
                        >
                            <span className="flex items-center space-x-2 text-purple-600">
                                <ClipboardList size={18} />
                                {isSidebarExpanded && <span className="text-gray-700">Rekap Data</span>}
                            </span>
                            {isSidebarExpanded && (rekapOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                        </button>

                        {rekapOpen && isSidebarExpanded && (
                            <div className="ml-4 space-y-2 border-l border-gray-200 pl-4 py-1">
                                <LinkItem 
                                    href="/admin/rekap_data/registrasi" 
                                    icon={UserPlus} 
                                    label="Data Registrasi"
                                    onItemClick={handleLinkClick} 
                                />
                                <LinkItem 
                                    href="/admin/rekap_data/rekap_kta" 
                                    icon={CreditCard} 
                                    label="Pengajuan KTA"
                                    onItemClick={handleLinkClick} 
                                />
                                <LinkItem 
                                    href="/admin/rekap_data/pengajuan_izin" 
                                    icon={ScrollText} 
                                    label="Pengajuan Izin Rekomendasi"
                                    onItemClick={handleLinkClick} 
                                />
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 mt-6 p-2 w-full justify-start rounded hover:bg-red-50 transition-colors duration-150"
                >
                    <LogOut size={18} />
                    {isSidebarExpanded && <span>Logout</span>}
                </button>
            </div>
        </>
    );
}