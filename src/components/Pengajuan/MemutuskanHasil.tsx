import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Modal from "react-modal";

interface MemutuskanHasilProps {
  submissionId: string;
  submissionData: any;
}

const MemutuskanHasil: React.FC<MemutuskanHasilProps> = ({
  submissionId,
  submissionData,
}) => {
  const { data: session } = useSession();
  const [decision, setDecision] = useState(
    submissionData.decision || "MenungguKeputusan",
  );
  const [recommendationDate, setRecommendationDate] = useState(
    submissionData.jadwal || "",
  );
  const [recommendationTitle, setRecommendationTitle] = useState(
    submissionData.recommendTitleChange || "",
  );
  const [isRecommendationDateDisabled, setIsRecommendationDateDisabled] =
    useState(decision !== "Diulang" && decision !== "DiterimaDenganPerbaikan");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDecisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDecision(value);
    setIsRecommendationDateDisabled(
      value !== "Diulang" && value !== "DiterimaDenganPerbaikan",
    );
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `/api/submission/${submissionId}/memutuskan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            decision,
            recommendationTitle: recommendationTitle,
            recommendationDate:
              decision === "Diulang" ? recommendationDate : null,
          }),
        },
      );

      if (response.ok) {
        toast.success("Hasil keputusan berhasil disimpan");
        window.location.reload();
      } else {
        const data = await response.json();
        toast.error(`Gagal menyimpan hasil keputusan: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting decision:", error);
      toast.error("Terjadi kesalahan saat menyimpan hasil keputusan");
    }
  };

  const handleConfirmSubmit = () => {
    setIsModalOpen(false);
    handleSubmit();
  };

  const isPembimbing = submissionData.Verificator.some(
    (v: any) =>
      v.lecturerId === Number(session?.user.id) && v.type === "Pembimbing",
  );
  console.log(submissionData)
  console.log(isPembimbing)

const isDisabled = submissionData.decision !== "MenungguKeputusan";
console.log(isDisabled)

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-semibold">
        Penentuan Status Hasil Sidang/Seminar dan Penilaian
      </h2>
      <p className="mb-4 text-red-500">
        Hanya tim pembimbing yang dapat memutuskan hasil.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }}
      >
        <div className="mb-4">
          <label
            htmlFor="decision"
            className="block text-lg font-medium text-gray-700 dark:text-gray-300"
          >
            Hasil Keputusan
          </label>
          <select
            id="decision"
            name="decision"
            value={decision}
            onChange={handleDecisionChange}
            className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 dark:bg-gray-700 dark:text-white"
            disabled={!isPembimbing || isDisabled}
          >
            <option value="MenungguKeputusan">Menunggu Keputusan</option>
            <option value="DiterimaDenganPerbaikan">
              Diterima dengan Perbaikan
            </option>
            <option value="Diterima">Diterima</option>
            <option value="Diulang">Diulang</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>
        <div className="mb-4 rounded-lg border bg-gray-100 p-4 dark:bg-gray-800">
          <h3 className="mb-2 text-lg font-semibold">Catatan:</h3>
          <ul className="list-disc pl-5">
            <li className="mb-1">
              <strong>Menunggu Keputusan:</strong> Pilih hasil keputusan sidang
            </li>
            <li className="mb-1">
              <strong>Diterima dengan perbaikan:</strong> Mahasiswa mengupload
              dokumen final revisi dan perlu persetujuan diterima/ditolak oleh
              tim
            </li>
            <li className="mb-1">
              <strong>Diterima:</strong> Mahasiswa tidak perlu upload revisi dan
              berhak lanjut ke tahapan berikutnya
            </li>
            <li className="mb-1">
              <strong>Diulang:</strong> Mahasiswa akan mengulang seminar dengan
              memberikan rekomendasi jadwal
            </li>
            <li className="mb-1">
              <strong>Ditolak:</strong> Gugur sehingga mahasiswa tidak dapat
              revisi ataupun melanjutkan ke tahapan selanjutnya
            </li>
          </ul>
        </div>
        <div className="mb-4">
          <label
            htmlFor="recommendationDate"
            className="block text-lg font-medium text-gray-700 dark:text-gray-300"
          >
            Rekomendasi Waktu Seminar Hasil Ulang (Jika perlu sidang ulang)
          </label>
          <input
            type="date"
            id="recommendationDate"
            name="recommendationDate"
            value={recommendationDate}
            onChange={(e) => setRecommendationDate(e.target.value)}
            disabled={
              isRecommendationDateDisabled || !isPembimbing || isDisabled
            }
            className={`mt-2 w-full rounded-lg border border-gray-300 p-3 dark:bg-gray-700 dark:text-white ${
              isRecommendationDateDisabled || !isPembimbing || isDisabled
                ? "bg-gray-200 dark:bg-gray-600"
                : "bg-white dark:bg-gray-700"
            }`}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="recommendationTitle"
            className="block text-lg font-medium text-gray-700 dark:text-gray-300"
          >
            Rekomendasi Perubahan Judul
          </label>
          <input
            type="text"
            id="recommendationTitle"
            name="recommendationTitle"
            value={recommendationTitle}
            onChange={(e) => setRecommendationTitle(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 p-3 dark:bg-gray-700 dark:text-white"
            disabled={!isPembimbing || isDisabled}
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            *Jika terdapat rekomendasi perubahan judul dari hasil seminar/sidang
            yang diterima maka pada proses/tahapan selanjutnya akan diubah
            menjadi judul yang diinput disini, jika tidak ada maka cukup biarkan
            kosong.
          </p>
        </div>
        <button
          type="submit"
          className="mt-4 rounded-lg bg-blue-500 px-6 py-2 text-white shadow hover:bg-blue-600"
          disabled={!isPembimbing || isDisabled}
        >
          Simpan Keputusan
        </button>
      </form>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Konfirmasi Simpan Keputusan"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">
            Konfirmasi Simpan Keputusan
          </h2>
          <p className="mb-4">
            Apakah Anda yakin ingin menyimpan keputusan ini? Setelah disimpan,
            status ini akan menjadi final dan tidak dapat diubah.
          </p>
          <div className="flex justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="mr-4 rounded-lg bg-gray-500 px-6 py-2 text-white shadow hover:bg-gray-600"
            >
              Batal
            </button>
            <button
              onClick={handleConfirmSubmit}
              className="rounded-lg bg-blue-500 px-6 py-2 text-white shadow hover:bg-blue-600"
            >
              Simpan
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MemutuskanHasil;
