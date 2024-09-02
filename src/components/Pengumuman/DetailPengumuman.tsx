"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnnouncementDetail } from "@/types/announcement";
import DOMPurify from "dompurify"; // Import DOMPurify

const DetailPengumuman = ({ params }: { params: { id: string } }) => {
  const [announcement, setAnnouncement] = useState<AnnouncementDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(`/api/pengumuman/${params.id}`);
        const data = await response.json();
        if (response.ok) {
          setAnnouncement(data.announcement);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!announcement) {
    return <div>Pengumuman tidak ditemukan.</div>;
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="dark:bg-gray-900 bg-white text-gray-800 dark:text-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-3xl  font-bold mb-4">{announcement.title}</h2>
        <div className="dark:bg-gray-800 bg-white p-4 rounded mb-4">
          {/* Sanitize the HTML content before rendering it */}
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(announcement.content) }} />
        </div>
        <p className="text-sm text-gray-400 mb-6">
          Diposting tanggal {new Date(announcement.postDate).toLocaleString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <button
          type="button"
          onClick={handleBack}
          className="bg-gray-500 dark:bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-600 dark:hover:bg-gray-700 transition duration-300"
        >
          Kembali
        </button>
      </div>
    </div>
  );
};

export default DetailPengumuman;
