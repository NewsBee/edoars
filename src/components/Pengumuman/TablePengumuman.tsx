"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmationModal from '../Modals/ConfirmModal';
import { useSession } from 'next-auth/react';
import { Announcement } from '@/types/announcement';

const TablePengumuman = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState<number | null>(null);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const router = useRouter();
    const { data: session } = useSession();

    const isAdmin = session?.user?.role === 'ADMIN';

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch('/api/pengumuman');
                const data = await response.json();
                setAnnouncements(data.announcements);
            } catch (error) {
                console.error('Failed to fetch announcements:', error);
            } finally {
                setLoading(false); // Set loading to false when data fetching is complete
            }
        };

        fetchAnnouncements();
    }, []);

    const handleDelete = async () => {
        if (announcementToDelete !== null) {
            try {
                const response = await fetch(`/api/pengumuman/${announcementToDelete}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setAnnouncements(announcements.filter(a => a.id !== announcementToDelete));
                    console.log(`Item deleted: ${announcementToDelete}`);
                } else {
                    console.error('Failed to delete the announcement');
                }
            } catch (error) {
                console.error('Failed to delete the announcement:', error);
            } finally {
                setAnnouncementToDelete(null);
                setIsModalOpen(false);
            }
        }
    };

    const openModal = (id: number) => {
        setAnnouncementToDelete(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setAnnouncementToDelete(null);
        setIsModalOpen(false);
    };

    const handleAnnouncementClick = (id: number) => {
        router.push(`/pengumuman/${id}`);
    };

    const handleEditClick = (id: number) => {
        router.push(`/pengumuman/${id}/edit/`);
    };

    const handleAddNewClick = () => {
        router.push('/pengumuman/tambah');
    };

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Daftar Pengumuman</h2>
                    {isAdmin && (
                        <button
                            onClick={handleAddNewClick}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                        >
                            Tambah Pengumuman
                        </button>
                    )}
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                                <span className="visually-hidden"></span>
                            </div>
                        </div>
                    ) : (
                        <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left text-sm leading-4 text-gray-600 dark:text-gray-300 tracking-wider">Pengumuman</th>
                                    <th className="px-6 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left text-sm leading-4 text-gray-600 dark:text-gray-300 tracking-wider">Tanggal</th>
                                    {isAdmin && (
                                        <th className="px-6 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left text-sm leading-4 text-gray-600 dark:text-gray-300 tracking-wider">Aksi</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {announcements.map((announcement) => (
                                    <tr key={announcement.id} className="odd:bg-gray-100 dark:odd:bg-gray-800 even:bg-white dark:even:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 cursor-pointer" onClick={() => handleAnnouncementClick(announcement.id)}>
                                            {announcement.title} {announcement.isNew && (
                                                <span className="ml-2 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                    Baru
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                                            {new Date(announcement.postDate).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        {isAdmin && (
                                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                                                <button onClick={() => handleEditClick(announcement.id)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition duration-300 mr-2">Edit</button>
                                                <button onClick={() => openModal(announcement.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300">Hapus</button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <ConfirmationModal
                title="Hapus Pengumuman"
                message="Apakah anda yakin ingin menghapus ini? Aksi ini tidak dapat dibatalkan."
                confirmLabel="Hapus"
                cancelLabel="Batal"
                onConfirm={handleDelete}
                onCancel={closeModal}
                isOpen={isModalOpen}
            />
        </div>
    );
};

export default TablePengumuman;
