"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaUserAlt,
  FaFileAlt,
  FaChartBar,
  FaInfoCircle,
} from "react-icons/fa"; // React Icons
import Modal from "react-modal";
import { Document, Page } from "react-pdf";
import DetailBerkas from "./DetailBerkas";
import DetailProses from "./DetailProses";
import { useSession } from "next-auth/react";
import DetailSubmission from "./DetailSubmission";

const DetailPengajuan = ({ submissionId }: { submissionId: string }) => {
  const [submissionData, setSubmissionData] = useState<any>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0); // State for active tab
  const router = useRouter();
  const { data: session } = useSession();

  console.log(selectedFileUrl);

  useEffect(() => {
    const fetchSubmissionData = async () => {
      try {
        const response = await fetch(`/api/submission/${submissionId}`);
        const data = await response.json();
        if (response.ok) {
          setSubmissionData(data.formattedSubmission);
        } else {
          console.error("Failed to fetch submission data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching submission data:", error);
      }
    };

    fetchSubmissionData();
  }, [submissionId]);
  console.log(submissionData);

  console.log(session?.user.role);

  const isAdmin =
    session?.user.role !== "Mahasiswa" && session?.user.role !== "Dosen";

  if (!submissionData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="loader h-32 w-32 rounded-full border-8 border-t-8 border-gray-200 ease-linear"></div>
      </div>
    );
  }

  const { User, Type, RequiredFiles, title, status, createdAt } =
    submissionData;

  const { formats } = submissionData.Type;
  console.log(formats[0].is_newtitle_submission);

  const tabs = formats[0].is_newtitle_submission && !isAdmin
    ? [
        { label: "Detail", icon: <FaInfoCircle /> }, // Changed icon for "Detail"
        { label: "Berkas", icon: <FaFileAlt /> },
        { label: "Hasil Keputusan", icon: <FaChartBar /> },
    ]
    : [
        { label: "Detail", icon: <FaInfoCircle /> }, // Changed icon for "Detail"
        { label: "Berkas", icon: <FaFileAlt /> },
        { label: "Ajukan Proses", icon: <FaCheckCircle /> },
        { label: "Hasil Keputusan", icon: <FaCalendarAlt /> },
        { label: "Revisi", icon: <FaUserAlt /> },
        { label: "Diskusi", icon: <FaUserAlt /> },
        { label: "Hasil", icon: <FaChartBar /> }, // Added icon for "Hasil"
      ];

  const openModal = (fileUrl: string) => {
    setSelectedFileUrl(fileUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedFileUrl(null);
    setModalIsOpen(false);
  };

  return (
    <div className="container mx-auto p-8">
      {/* Header Section */}
      <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        {/* Title and Status Section */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {title}
            </h2>
            <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <FaCheckCircle
                className={`mr-2 ${status === "approved" ? "text-green-500" : status === "rejected" ? "text-red-500" : "text-yellow-500"}`}
              />
              <span
                className={`font-semibold ${status === "approved" ? "text-green-500" : status === "rejected" ? "text-red-500" : "text-yellow-500"}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <FaCalendarAlt className="mr-2" />
              <span>
                {new Date(createdAt).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <strong> {Type.name} </strong> - {Type.description}
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-200 text-white">
              <FaUserAlt />
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {User.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {User.nim}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-8">
          <div className="flex space-x-6">
            {tabs.map((tab, index) => (
              <div
            key={index}
            className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium ${
              activeTab === index
                ? "bg-blue-500 text-white"
                : "text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-700 dark:hover:text-white"
            }`}
            onClick={() => setActiveTab(index)} // Update active tab on click
              >
            <div className="flex items-center space-x-2">
              {tab.icon}
              <span>{tab.label}</span>
            </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider Section */}
        <div className="my-8 border-t-2 border-gray-400 dark:border-gray-600"></div>

        {/* Files Section */}
        {activeTab === tabs.findIndex(tab => tab.label === "Berkas") && (
          <DetailBerkas
            requiredFiles={RequiredFiles}
            openModal={openModal}
            closeModal={closeModal}
            modalIsOpen={modalIsOpen}
            selectedFileUrl={selectedFileUrl}
            isAdmin={isAdmin}
          />
        )}

        {/* Detail Proses Section */}
        {activeTab === tabs.findIndex(tab => tab.label === "Ajukan Proses") && (
          <DetailProses submissionData={submissionData} />
        )}

        {/* Hasil Keputusan Section */}
        {activeTab === tabs.findIndex(tab => tab.label === "Hasil Keputusan") && (
          <div>Hasil Keputusan Content</div>
        )}

        {/* Revisi Section */}
        {activeTab === tabs.findIndex(tab => tab.label === "Revisi") && (
          <div>Revisi Content</div>
        )}

        {/* Diskusi Section */}
        {activeTab === tabs.findIndex(tab => tab.label === "Diskusi") && (
          <div>Diskusi Content</div>
        )}

        {/* Hasil Section */}
        {activeTab === tabs.findIndex(tab => tab.label === "Hasil") && (
          <div>Hasil Content</div>
        )}

        {/* Detail Section */}
        {activeTab === tabs.findIndex(tab => tab.label === "Detail") && (
          <DetailSubmission submissionData={submissionData} />
        )}

        {/* Back Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => router.back()}
            className="rounded-lg bg-gray-500 px-8 py-3 font-medium text-white transition duration-300 ease-in-out hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPengajuan;
