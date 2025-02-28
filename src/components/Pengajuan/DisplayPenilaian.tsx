import React from "react";
import { useSession } from "next-auth/react";

interface DisplayPenilaianProps {
  submissionData: any;
}

const DisplayPenilaian: React.FC<DisplayPenilaianProps> = ({
  submissionData,
}) => {
  const { data: session } = useSession();

  const userVerificator = submissionData.Verificator.find(
    (v: any) => v.lecturerId === Number(session?.user.id),
  );
  console.log(userVerificator);
  console.log(submissionData);

  const otherVerificators = submissionData.Verificator.filter(
    (v: any) =>
      v.lecturerId !== Number(session?.user.id) &&
      submissionData.SubmissionRequiredValue.some(
        (value: any) => value.verificatorId === v.id,
      ),
  );
  console.log(otherVerificators);

  const renderPenilaian = (verificator: any) => {
    const penilaian = submissionData.SubmissionRequiredValue.filter(
      (value: any) => value.verificatorId === verificator.id,
    );
    console.log(verificator, penilaian);
    const getRequiredValueDetails = (requiredValueId: string) => {
      return submissionData.RequiredValues.find(
        (rv: any) => rv.id === requiredValueId,
      );
    };

    return (
      <div key={verificator.id} className="mb-8">
        <h3 className="mb-4 text-lg font-semibold">
          {verificator ? verificator.lecturerName : "Unknown Verificator"}
          {"  "} |
          <span
            className={`text-sm text-gray-500 dark:text-gray-400 ${
              verificator.type === "Pembimbing"
                ? "bg-green-200 dark:bg-green-600"
                : "bg-purple-200 dark:bg-purple-600"
            } rounded p-1`}
          >
            ({verificator ? verificator.type : "Unknown Type"})
          </span>
        </h3>
        <textarea
          value={verificator ? verificator.note : ""}
          disabled
          rows={9}
          className="w-full rounded-lg border border-gray-300 p-3 dark:bg-gray-700 dark:text-white"
        />
        <div className="relative my-6">
          <hr className="border-gray-300 dark:border-gray-600" />
        </div>
        {penilaian.map((value: any, index: number) => {
          const requiredValueDetails = getRequiredValueDetails(
            value.requiredValueId,
          );
          return (
            <div key={value.id} className="mb-4">
              {requiredValueDetails && (
                <div>
                  <label
                    htmlFor={`value-${value.id}`}
                    className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                  >
                    #{index + 1} - {requiredValueDetails.name} (
                    {requiredValueDetails.bobot}%)
                  </label>
                  {requiredValueDetails.note && (
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {requiredValueDetails.note
                        .split("\n")
                        .map((line: string, i: number) => (
                          <p key={i}>{line}</p>
                        ))}
                    </div>
                  )}
                </div>
              )}
              <input
                type="number"
                id={`value-${value.id}`}
                name={`value-${value.id}`}
                value={value.value}
                disabled
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 dark:bg-gray-700 dark:text-white"
              />

              {index < penilaian.length - 1 && (
                <div className="relative my-6">
                  <hr className="border-gray-300 dark:border-gray-600" />
                </div>
              )}
            </div>
          );
        })}
        <div className="mt-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Total Nilai:
            </span>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {verificator.totalScore}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Rata Rata Nilai (Sudah dengan Bobot):
            </span>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {verificator.averageScore}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-200">
        Penilaian Verifikator
      </h2>
      {userVerificator && renderPenilaian(userVerificator)}
      <div className="relative my-6">
        <hr className="border-gray-300 dark:border-gray-600" />
      </div>
      {otherVerificators.map((verificator: any) =>
        renderPenilaian(verificator),
      )}
    </div>
  );
};

export default DisplayPenilaian;
