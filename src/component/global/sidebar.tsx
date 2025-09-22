'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, LogOut, Menu, X, FileCheck, ClipboardList, PanelLeft, PanelRight } from 'lucide-react'

export default function Sidebar() {
    const [rekapOpen, setRekapOpen] = useState(false);
    const [verifikasiOpen, setVerifikasiOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    const handleLogout = () => {
        // Simulasikan proses logout
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

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
                        className="p-2 rounded hover:bg-purple-500 hidden md:block"
                    >
                        {isSidebarExpanded ? <PanelLeft size={20} /> : <PanelRight size={20} />}
                    </button>
                </div>
                
                <div className="space-y-2">
                    {/* Verifikasi Section */}
                    <div>
                        <button
                            onClick={() => setVerifikasiOpen(!verifikasiOpen)}
                            className="flex items-center space-x-2 p-2 rounded hover:bg-purple-500 w-full justify-between"
                        >
                            <span className="flex items-center space-x-2">
                                <FileCheck size={18} />
                                {isSidebarExpanded && <span>Verifikasi</span>}
                            </span>
                            {isSidebarExpanded && (verifikasiOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                        </button>

                        {verifikasiOpen && isSidebarExpanded && (
                            <div className="ml-4 space-y-2">
                                <a href="/admin/verifikasi/registrasi" className="block p-2 rounded hover:bg-purple-500">
                                    Data Registrasi
                                </a>
                                <a href="/admin/verifikasi/pengajuan_kta" className="block p-2 rounded hover:bg-purple-500">
                                    Pengajuan KTA
                                </a>
                                <a href="/admin/verifikasi/pengajuan-izin" className="block p-2 rounded hover:bg-purple-500">
                                    Pengajuan Izin Rekomendasi
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Rekap Data Section */}
                    <div>
                        <button
                            onClick={() => setRekapOpen(!rekapOpen)}
                            className="flex items-center space-x-2 p-2 rounded hover:bg-purple-500 w-full justify-between"
                        >
                            <span className="flex items-center space-x-2">
                                <ClipboardList size={18} />
                                {isSidebarExpanded && <span>Rekap Data</span>}
                            </span>
                            {isSidebarExpanded && (rekapOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                        </button>

                        {rekapOpen && isSidebarExpanded && (
                            <div className="ml-4 space-y-2">
                                <a href="/admin/rekap_data/registrasi" className="block p-2 rounded hover:bg-purple-500">
                                    Data Registrasi
                                </a>
                                <a href="/admin/rekap_data/rekap_kta" className="block p-2 rounded hover:bg-purple-500">
                                    Pengajuan KTA
                                </a>
                                <a href="/admin/rekap_data/pengajuan_izin" className="block p-2 rounded hover:bg-purple-500">
                                    Pengajuan Izin Rekomendasi
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 mt-6 p-2 w-full justify-start"
                >
                    <LogOut size={18} />
                    {isSidebarExpanded && <span>Logout</span>}
                </button>
            </div>
        </>
    );
}
