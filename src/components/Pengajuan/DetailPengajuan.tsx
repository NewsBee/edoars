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
  FaChartLine,
  FaGavel,
} from "react-icons/fa"; // React Icons
import Modal from "react-modal";
import { Document, Page } from "react-pdf";
import DetailBerkas from "./DetailBerkas";
import DetailProses from "./DetailProses";
import { useSession } from "next-auth/react";
import DetailSubmission from "./DetailSubmission";
import DetailHasilKeputusan from "./DetailHasilKeputusan";
import InputBerkas from "./InputBerkas";
import DetailPenilaian from "./DetailPenilaian";
import DisplayPenilaian from "./DisplayPenilaian";
import MemutuskanHasil from "./MemutuskanHasil";

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
  console.log(submissionData);
  console.log(submissionData.requiredFilesFormatted.length);

  const tabs = formats[0].is_newtitle_submission
    ? isAdmin
      ? [
          { label: "Detail", icon: <FaInfoCircle /> },
          { label: "Berkas", icon: <FaFileAlt /> },
          { label: "Hasil Keputusan", icon: <FaChartBar /> },
        ]
      : [
          { label: "Detail", icon: <FaInfoCircle /> },
          { label: "Berkas", icon: <FaFileAlt /> },
          { label: "Hasil Keputusan", icon: <FaChartBar /> },
        ]
    : session?.user.role === "Mahasiswa"
      ? [
          { label: "Detail", icon: <FaInfoCircle /> },
          { label: "Berkas", icon: <FaFileAlt /> },
          { label: "Ajukan Proses", icon: <FaCheckCircle /> },
          { label: "Hasil Keputusan", icon: <FaChartBar /> },
          { label: "Revisi", icon: <FaUserAlt /> },
        ]
      : [
          { label: "Detail", icon: <FaInfoCircle /> },
          { label: "Berkas", icon: <FaFileAlt /> },
          { label: "Penilaian", icon: <FaChartLine /> },
          { label: "Memutuskan Hasil", icon: <FaGavel /> },
          { label: "Hasil Keputusan", icon: <FaCalendarAlt /> },
          { label: "Revisi", icon: <FaUserAlt /> },
          // { label: "Diskusi", icon: <FaUserAlt /> },
          // { label: "Hasil", icon: <FaChartBar /> },
        ];

  const openModal = (fileUrl: string) => {
    setSelectedFileUrl(fileUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedFileUrl(null);
    setModalIsOpen(false);
  };

  const verificator = submissionData.Verificator.find(
    (v: any) => v.lecturerId === Number(session?.user.id),
  );
  const verificatorId = verificator ? verificator.id : null;
  // console.log(verificatorId);
  // console.log(verificator);

  const hasUserSubmittedPenilaian = submissionData.SubmissionRequiredValue.some(
    (value: any) => value.verificatorId === verificatorId,
  );
  // console.log(submissionData.SubmissionRequiredValue);
  // console.log(hasUserSubmittedPenilaian);

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
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="rounded bg-blue-200 px-2 py-1 text-blue-800">
                {submissionData.skillGroup}
              </span>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <FaCheckCircle
                className={`mr-2 ${
                  status === "approved"
                    ? "text-green-500"
                    : status === "rejected"
                      ? "text-red-500"
                      : status === "processed"
                        ? "text-blue-500"
                        : status === "repeated"
                          ? "text-orange-500"
                          : "text-yellow-500"
                }`}
              />
              <span
                className={`font-semibold ${
                  status === "approved"
                    ? "text-green-500"
                    : status === "rejected"
                      ? "text-red-500"
                      : status === "processed"
                        ? "text-blue-500"
                        : status === "repeated"
                          ? "text-orange-500"
                          : "text-yellow-500"
                }`}
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
              <strong> {Type.name} </strong>
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
                <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Jumlah SKS:</strong> 
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  {submissionData.amountOfSks}
                </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>IPK:</strong> 
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  {submissionData.ipkNow}
                </span>
                </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-8">
          <div className="flex space-x-6">
            {tabs.map((tab, index) => {
              const isDisabled =
                (session?.user.role === "Mahasiswa" &&
                  ((tab.label === "Hasil Keputusan" && status !== "approved") ||
                    (tab.label === "Ajukan Proses" &&
                      submissionData.approvedFiles !==
                        submissionData.requiredFilesFormatted.length))) ||
                (tab.label === "Berkas" &&
                  (!submissionData.RequiredFiles ||
                    submissionData.RequiredFiles.length === 0) &&
                  session?.user.role !== "Mahasiswa");
              return (
                <div
                  key={index}
                  className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium ${
                    activeTab === index
                      ? "bg-blue-500 text-white"
                      : isDisabled
                        ? "cursor-not-allowed bg-gray-200 text-gray-400"
                        : "text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  }`}
                  onClick={() => !isDisabled && setActiveTab(index)} // Update active tab on click if not disabled
                >
                  <div className="flex items-center space-x-2">
                    {tab.icon}
                    <span>{tab.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider Section */}
        <div className="my-8 border-t-2 border-gray-400 dark:border-gray-600"></div>

        {/* Files Section */}
        {activeTab === tabs.findIndex((tab) => tab.label === "Berkas") &&
          (RequiredFiles && RequiredFiles.length > 0 ? (
            <DetailBerkas
              submissionData={submissionData}
              requiredFiles={RequiredFiles}
              openModal={openModal}
              closeModal={closeModal}
              modalIsOpen={modalIsOpen}
              selectedFileUrl={selectedFileUrl}
              isAdmin={isAdmin}
            />
          ) : (
            <InputBerkas
              submissionData={submissionData}
              typeSlug={submissionData.Type.slug}
            />
          ))}

        {/* Detail Proses Section */}
        {activeTab ===
          tabs.findIndex((tab) => tab.label === "Ajukan Proses") && (
          <DetailProses submissionData={submissionData} />
        )}
        {activeTab === tabs.findIndex((tab) => tab.label === "Penilaian") &&
          (session?.user.role === "Dosen" ? (
            !hasUserSubmittedPenilaian ? (
              <DetailPenilaian
                Verificator={submissionData.Verificator}
                submissionId={submissionData.id}
                requiredValues={submissionData.RequiredValues}
              />
            ) : (
              <DisplayPenilaian submissionData={submissionData} />
            )
          ) : (
            <div>Anda tidak memiliki akses untuk melihat penilaian.</div>
          ))}

        {/* Hasil Keputusan Section */}
        {activeTab ===
          tabs.findIndex((tab) => tab.label === "Hasil Keputusan") && (
          <DetailHasilKeputusan
            requiredFiles={submissionData}
            verificatorAverages={submissionData.verificatorAverages}
          />
        )}

        {/* Revisi Section */}
        {activeTab === tabs.findIndex((tab) => tab.label === "Revisi") && (
          <div>Revisi Content</div>
        )}

        {/* Diskusi Section */}
        {activeTab === tabs.findIndex((tab) => tab.label === "Diskusi") && (
          <div>Diskusi Content</div>
        )}

        {/* Memutuskan Hasil Section */}
        {activeTab ===
          tabs.findIndex((tab) => tab.label === "Memutuskan Hasil") && (
          <MemutuskanHasil
            submissionId={submissionId}
            submissionData={submissionData}
          />
        )}

        {/* Hasil Section */}
        {activeTab === tabs.findIndex((tab) => tab.label === "Hasil") && (
          <div>Hasil Content</div>
        )}

        {/* Detail Section */}
        {activeTab === tabs.findIndex((tab) => tab.label === "Detail") && (
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
