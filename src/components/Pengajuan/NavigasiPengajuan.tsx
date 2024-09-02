"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

const NavigasiPengajuan: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname()
    const [active, setActive] = useState<string>(pathname);
    const router = useRouter();

    console.log(pathname)

    const navItems: NavItem[] = [
        {
            label: 'Berkas', href: '/pengajuan/proposal/berkas', icon: <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.8967 9.92795L15.6334 13.8078C15.4573 14.1097 15.2051 14.3602 14.902 14.5343C14.5989 14.7084 14.2555 14.8001 13.9059 14.8H1.40703C0.828188 14.8 0.467531 14.1721 0.759188 13.6721L3.02244 9.7923C3.19857 9.49036 3.45076 9.23986 3.75388 9.06576C4.05699 8.89166 4.40044 8.80005 4.75 8.80005H17.2489C17.8277 8.80005 18.1884 9.42795 17.8967 9.92795ZM4.75 7.80005H15V6.30005C15 5.47161 14.3284 4.80005 13.5 4.80005H8.5L6.5 2.80005H1.5C0.671562 2.80005 0 3.47161 0 4.30005V12.989L2.15866 9.28842C2.69419 8.37036 3.68716 7.80005 4.75 7.80005Z" fill={active === '/pengajuan/proposal/berkas' ? '#FFFFFF' : '#5750F1'} />
            </svg>
        },
        {
            label: 'Ajukan Proses', href: '/pengajuan/proposal/ajukan-proses', icon: <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.29 9.7998C19.8213 9.7998 20.29 10.2686 20.29 10.7998V13.7998C20.29 14.3623 19.8213 14.7998 19.29 14.7998H1.29004C0.727539 14.7998 0.290039 14.3623 0.290039 13.7998V10.7998C0.290039 10.2686 0.727539 9.7998 1.29004 9.7998H3.29004V11.7998H2.57129C2.41504 11.7998 2.29004 11.9248 2.29004 12.0498V12.5498C2.29004 12.7061 2.41504 12.7998 2.57129 12.7998H17.9775C18.1338 12.7998 18.29 12.7061 18.29 12.5498V12.0498C18.29 11.9248 18.1338 11.7998 17.9775 11.7998H17.29V9.7998H19.29ZM16.29 11.7998H4.29004V1.83105C4.29004 1.26855 4.72754 0.799805 5.29004 0.799805H15.2588C15.8213 0.799805 16.29 1.26855 16.29 1.83105V11.7998ZM6.88379 6.1123C6.75879 6.26855 6.72754 6.45605 6.88379 6.6123L9.19629 8.9248C9.32129 9.08105 9.54004 9.08105 9.66504 8.9248L13.665 4.95605C13.8213 4.83105 13.8213 4.6123 13.665 4.4873L12.8838 3.70605C12.7588 3.5498 12.54 3.5498 12.415 3.6748L9.44629 6.64355L8.13379 5.33105C8.00879 5.20605 7.79004 5.20605 7.66504 5.33105L6.88379 6.1123Z" fill={active === '/pengajuan/proposal/ajukan-proses' ? '#FFFFFF' : '#5750F1'} />
            </svg>
        },
        {
            label: 'Hasil Keputusan', href: '/hasil-keputusan', icon: <svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.25586 12.55L1.06836 7.36255C0.755859 7.05005 0.755859 6.5188 1.06836 6.2063L2.19336 5.0813C2.50586 4.7688 3.00586 4.7688 3.31836 5.0813L6.84961 8.5813L14.3496 1.0813C14.6621 0.768799 15.1621 0.768799 15.4746 1.0813L16.5996 2.2063C16.9121 2.5188 16.9121 3.05005 16.5996 3.36255L7.41211 12.55C7.09961 12.8625 6.56836 12.8625 6.25586 12.55Z" fill={active === '/hasil-keputusan' ? '#FFFFFF' : '#5750F1'} />
            </svg>
        },
        {
            label: 'Revisi', href: '/revisi', icon: <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.1709 6.2688C16.4521 6.5813 16.4521 7.05005 16.1396 7.3313L6.88965 16.5813C6.6084 16.8938 6.13965 16.8938 5.8584 16.5813L0.608398 11.3313C0.295898 11.05 0.295898 10.5813 0.608398 10.2688L1.82715 9.05005C2.13965 8.73755 2.6084 8.73755 2.88965 9.05005L6.38965 12.5188L13.8584 5.05005C14.1396 4.73755 14.6396 4.73755 14.9209 5.05005L16.1709 6.2688ZM6.01465 9.5813L2.51465 6.0813C2.32715 5.8938 2.32715 5.5813 2.51465 5.36255L3.95215 3.9563C4.13965 3.7688 4.45215 3.7688 4.63965 3.9563L6.38965 5.7063L11.1084 0.956299C11.2959 0.768799 11.6084 0.768799 11.8271 0.956299L13.2334 2.36255C13.4209 2.5813 13.4209 2.8938 13.2334 3.0813L6.7334 9.5813C6.5459 9.80005 6.20215 9.80005 6.01465 9.5813Z" fill={active === '/revisi' ? '#FFFFFF' : '#5750F1'} />
            </svg>
        },
        {
            label: 'Diskusi', href: '/diskusi', icon: <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.1709 6.2688C16.4521 6.5813 16.4521 7.05005 16.1396 7.3313L6.88965 16.5813C6.6084 16.8938 6.13965 16.8938 5.8584 16.5813L0.608398 11.3313C0.295898 11.05 0.295898 10.5813 0.608398 10.2688L1.82715 9.05005C2.13965 8.73755 2.6084 8.73755 2.88965 9.05005L6.38965 12.5188L13.8584 5.05005C14.1396 4.73755 14.6396 4.73755 14.9209 5.05005L16.1709 6.2688ZM6.01465 9.5813L2.51465 6.0813C2.32715 5.8938 2.32715 5.5813 2.51465 5.36255L3.95215 3.9563C4.13965 3.7688 4.45215 3.7688 4.63965 3.9563L6.38965 5.7063L11.1084 0.956299C11.2959 0.768799 11.6084 0.768799 11.8271 0.956299L13.2334 2.36255C13.4209 2.5813 13.4209 2.8938 13.2334 3.0813L6.7334 9.5813C6.5459 9.80005 6.20215 9.80005 6.01465 9.5813Z" fill={active === '/diskusi' ? '#FFFFFF' : '#5750F1'} />
            </svg>
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-4 md:hidden">
                <button
                    className="px-4 py-2 text-[#5750F1] rounded-lg border border-[#5750F1] transition duration-300 flex items-center"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    Menu
                    <svg
                        className={`w-5 h-5 ml-2 transition-transform ${menuOpen ? 'rotate-180' : 'rotate-0'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                </button>
            </div>
            <nav className={`flex-col md:flex-row flex md:flex space-x-4 mb-4 ${menuOpen ? 'flex' : 'hidden md:flex'}`}>
                {navItems.map((item, index) => (
                    <Link key={index} href={item.href} legacyBehavior>
                        <a
                            className={`px-4 py-2 rounded-lg border border-transparent hover:border-[#5750F1] transition duration-300 flex items-center ${active === item.href ? 'bg-[#5750F1] text-white' : 'text-[#5750F1]'
                                }`}
                            onClick={() => setActive(item.href)}
                        >
                            <div className='flex gap-3 items-center'>
                                {item.icon}
                                {item.label}
                            </div>
                        </a>
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default NavigasiPengajuan;
