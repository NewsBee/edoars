import React from 'react';

interface ProjectInfoProps {
    title: string;
    status: string;
    date: string;
    type: string;
    group: string;
    studentName: string;
    studentId: string;
    profileImage: string;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ title, status, date, type, group, studentName, studentId, profileImage }) => {
    return (
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                {title}
            </h1>
            <div className="flex flex-wrap items-center space-x-4 mb-4">
                <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded">{status}</span>
                </span>
                <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14.5A6.5 6.5 0 0110 3a6.5 6.5 0 010 13zm-.75-7.25h1.5v4h-1.5v-4zM10 7.25a.75.75 0 110 1.5.75.75 0 010-1.5z" />
                    </svg>
                    {date}
                </span>
                <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.293 9.293a1 1 0 011.414 0L12 10.586l1.293-1.293a1 1 0 111.414 1.414L12 13.414l-2.707-2.707a1 1 0 010-1.414z" />
                    </svg>
                    {type}
                </span>
                <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H4zm0 12V5h12v10H4z" />
                    </svg>
                    {group}
                </span>
            </div>
            <div className="flex items-center space-x-4 mb-4">
                <img src={profileImage} alt="Profile" className="w-10 h-10 rounded-full" />
                <span className="text-gray-800 dark:text-gray-100">
                    {studentName} - {studentId}
                </span>
            </div>
        </div>
    );
};

export default ProjectInfo;
