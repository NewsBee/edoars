export interface StatusProposalProps {
    data: ProposalData;
}

export interface ProposalData {
    title: string;
    studentName: string;
    studentId: string;
    status: string;
    decision: string;
    expertiseGroup: string;
    academicYear: string;
    semester: string;
    submissionDate: string;
    updatedDate: string;
    documentStatus: {
        submitted: number;
        approved: number;
        rejected: number;
    };
    seminarSchedule: string;
    room: string;
    supervisors: SupervisorData[];
    reviewers: ReviewerData[];
}

interface SupervisorData {
    name: string;
    status: string;
    revision: string;
}

export interface ReviewerData {
    name: string;
    status: string;
    revision: string;
}