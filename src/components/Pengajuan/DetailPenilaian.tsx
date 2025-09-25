import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

interface DetailPenilaianProps {
  submissionId: string;
  requiredValues: any[];
  Verificator: any[];
}

const DetailPenilaian: React.FC<DetailPenilaianProps> = ({
  submissionId,
  requiredValues,
  Verificator,
}) => {
  console.log(requiredValues)
  const { data: session } = useSession();
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const initialFormData: { [key: string]: string } = {};
    requiredValues.forEach((rv) => {
      initialFormData[rv.id] = "";
    });
    setFormData(initialFormData);
  }, [requiredValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: string,
  ) => {
    setFormData({ ...formData, [id]: e.target.value });
  };

  const verificator = Verificator.find(
    (v) => v.lecturerId === Number(session?.user.id),
  );
  const verificatorId = verificator ? verificator.id : null;
  console.log(formData)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `/api/submission/${submissionId}/penilaian`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            submissionId,
            verificatorId: verificatorId,
            values: formData,
          }),
        },
      );

      if (response.ok) {
        toast.success("Penilaian berhasil disimpan");
        window.location.reload();
      } else {
        const data = await response.json();
        toast.error(`Gagal menyimpan penilaian: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting penilaian:", error);
      toast.error("Terjadi kesalahan saat menyimpan penilaian");
    }
  };

  const handleConfirmSubmit = () => {
    setIsModalOpen(false);
    handleSubmit(new Event("submit") as unknown as React.FormEvent);
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-semibold">Penilaian</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }}
      >
        <div className="mb-4">
          <label
            htmlFor="verificator-note"
            className="block text-lg font-medium text-gray-700 dark:text-gray-300"
          >
            Catatan Verifikator
          </label>
          <textarea
            id="verificator-note"
            name="verificator-note"
            value={formData["verificatorNote"] || ""}
            placeholder="Masukkan catatan atau komentar"
            onChange={(e) => handleChange(e, "verificatorNote")}
            className="mt-2 w-full rounded-lg border border-gray-300 p-3 dark:bg-gray-700 dark:text-white"
            rows={6}
          />
        </div>
        {requiredValues.map((rv, index) => (
          <div key={rv.id} className="mb-4">
            <div className="mb-2">
              <label
                htmlFor={`value-${rv.id}`}
                className="block text-lg font-medium text-gray-700 dark:text-gray-300"
              >
                #{index + 1} - {rv.name} ({rv.bobot}%)
              </label>
              {rv.note && (
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {rv.note.split("\n").map((line: string, i: number) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}
            </div>
            <input
              type="number"
              id={`value-${rv.id}`}
              name={`value-${rv.id}`}
              value={formData[rv.id]}
              placeholder="Nilai (0-100)"
              onChange={(e) => handleChange(e, rv.id)}
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 dark:bg-gray-700 dark:text-white"
              min="0"
              max="100"
            />
            {index < requiredValues.length - 1 && (
              <div className="relative my-6">
                <hr className="border-gray-300 dark:border-gray-600" />
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="mt-4 rounded-lg bg-blue-500 px-6 py-2 text-white shadow hover:bg-blue-600"
        >
          Simpan Penilaian
        </button>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">Konfirmasi</h3>
            <p className="mb-4">
              Apakah Anda yakin? Penilaian tidak dapat diubah setelah
              dikirimkan.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mr-4 rounded-lg bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Yakin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailPenilaian;
