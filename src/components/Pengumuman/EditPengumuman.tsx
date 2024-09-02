"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnnouncementDetail } from "@/types/announcement";
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const EditAnnouncement = ({ params }: { params: { id: string } }) => {
    const [announcement, setAnnouncement] = useState<AnnouncementDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [postDate, setPostDate] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const response = await fetch(`/api/pengumuman/${params.id}`);
                const data = await response.json();
                if (response.ok) {
                    setAnnouncement(data.announcement);
                    setTitle(data.announcement.title);
                    setContent(data.announcement.content);
                    setPostDate(data.announcement.postDate);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error("Error fetching announcement:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncement();
    }, [params.id]);

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/pengumuman/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, content, postDate }),
            });

            if (response.ok) {
                toast.success("Pengumuman berhasil diperbarui!");
                setTimeout(() => {
                    router.push("/pengumuman");
                }, 2000);
            } else {
                const data = await response.json();
                console.error(data.message);
                toast.error("Gagal memperbarui pengumuman.");
            }
        } catch (error) {
            console.error("Error updating announcement:", error);
            toast.error("Terjadi kesalahan saat memperbarui pengumuman.");
        }
    };

    const handleBack = () => {
        router.back();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!announcement) {
        return <div>Pengumuman tidak ditemukan.</div>;
    }

    const formatPostDate = (date: string) => {
        const dateObj = new Date(date);
        return isNaN(dateObj.getTime()) ? "" : dateObj.toISOString().slice(0, 16);
    };

    return (
        <div className="container mx-auto p-4">
            <ToastContainer />
            <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-4">Edit Pengumuman</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                        Judul
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none"
                        placeholder="Masukkan judul pengumuman"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                        Isi Pengumuman
                    </label>
                    <ReactQuill
                        value={content}
                        onChange={setContent}
                        theme="snow"
                        className="bg-gray-800"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                        Tanggal Posting
                    </label>
                    <input
                        type="datetime-local"
                        value={formatPostDate(postDate)}
                        onChange={(e) => setPostDate(e.target.value)}
                        className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none"
                    />
                </div>
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition duration-300"
                    >
                        Kembali
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditAnnouncement;
