import React from "react";
import { FaChartLine } from "react-icons/fa"; // Keep if you want an icon for "Hasil Penilaian" or remove

interface VerificatorAverage {
  verificatorId: string;
  average: number;
  name: string;
  note?: string; // Assuming notes are newline-separated for the list
}

interface DetailHasilKeputusanProps {
  verificatorAverages?: VerificatorAverage[];
  requiredFiles?: {
    status?: string; // e.g., "approved"
    // You might want to add other relevant data here from your backend
    // For example:
    // finalGrade?: string; // e.g., "B+"
    // googleMeetStatus?: string; // e.g., "Rekaman seminar belum dilampirkan"
    // downloadUrl?: string;
    // previewUrl?: string;
  };
  submission?: any; // Optional, if you need to pass it for any reason
}

const DetailHasilKeputusan: React.FC<DetailHasilKeputusanProps> = ({
  verificatorAverages = [],
  requiredFiles = {},
  submission
}) => {
  if (!verificatorAverages.length && requiredFiles.status !== "approved") {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-4">
        <FaChartLine size={24} className="text-gray-400" />
        <p className="text-gray-500">Belum ada hasil keputusan.</p>
      </div>
    );
  }
  console.log(submission)

  const totalScore = verificatorAverages.reduce(
    (acc, verifier) => acc + verifier.average,
    0,
  );
  const overallAverage = verificatorAverages.length > 0 ? totalScore / verificatorAverages.length : 0;

  // Placeholder for grade, ideally this would come from props or be calculated
  const getGrade = (score: number): string => {
    if (score >= 85) return "A";
    if (score >= 75) return "B+";
    if (score >= 65) return "B";
    if (score >= 55) return "C+";
    if (score >= 45) return "C";
    if (score >= 35) return "D";
    return "E";
  };

  console.log(requiredFiles)
  
  const overallGrade = getGrade(overallAverage);


  return (
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen">
      {/* Status Pengajuan */}
      {submission.status === "approved" && (
        <div className="rounded-md bg-green-600 p-4 shadow">
          <h2 className="text-xl font-semibold text-white">
            Status Pengajuan: Disetujui
          </h2>
          <p className="text-green-100 text-sm">
            Hasil pengajuan mahasiswa sudah bersifat final dengan status: Disetujui
          </p>
        </div>
      )}

      {/* Hasil Penilaian Section */}
      <div className="bg-white p-6 shadow rounded-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Hasil Penilaian</h3>
        {verificatorAverages.length > 0 && (
             <p className="text-2xl font-bold text-blue-600">
                {overallAverage.toFixed(2)} ({overallGrade})
             </p>
        )}
        <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">Hasil Rekaman Google Meet</p>
            <p className="text-sm text-gray-500">
                {/* This could be dynamic from props */}
                Rekaman seminar belum dilampirkan 
            </p>
        </div>
      </div>


      {/* Pembimbing Details Section */}
      {verificatorAverages.map((verifier, index) => (
        <div key={index} className="bg-white p-6 shadow rounded-md">
          <h4 className="text-md font-semibold text-gray-700">
            Pembimbing {index + 1}
          </h4>
          <p className="text-gray-600 mb-3">{verifier.name}</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
            <span className="text-xs font-medium py-1 px-2.5 rounded-full bg-blue-100 text-blue-700">
              Seminar/Sidang Disetujui
            </span>
            <span className="text-sm font-semibold text-gray-700">
              Nilai: {verifier.average.toFixed(1)}
            </span>
            <span className="text-xs font-medium py-1 px-2.5 rounded-full bg-green-100 text-green-700">
              Final Revisi Disetujui
            </span>
          </div>

          {verifier.note && (
            <div>
              {/* The image shows notes only for the second supervisor, 
                  but this will render notes if they exist for any. 
                  The image also seems to imply these are specific points.
              */}
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 pl-2">
                {verifier.note.split('\n').map((line, i) => (
                  line.trim() && <li key={i}>{line.trim().replace(/^\d+\.\s*/, '')}</li> // Removes existing numbering if any
                ))}
              </ol>
            </div>
          )}
        </div>
      ))}
      
      {/* Action Buttons - Assuming status is approved to show these */}
      {requiredFiles.status === "approved" && (
        <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            // onClick={() => window.open(requiredFiles.downloadUrl, '_blank')} // Example action
            className="w-full sm:w-auto rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Download Berita Acara
          </button>
          <button
            type="button"
            // onClick={() => window.open(requiredFiles.previewUrl, '_blank')} // Example action
            className="w-full sm:w-auto rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Preview Berita Acara
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailHasilKeputusan;