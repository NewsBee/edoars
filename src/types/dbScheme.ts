export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  Submissions?: Submission[];
  Verifications?: Verificator[];
  UserLogs?: ActivityUserLog[];
  SubmissionLogs?: ActivitySubmissionLog[];
  SkillGroups?: SkillGroupLecturer[];
  Notifications?: Notification[];
  Gradings?: Grading[];
  TitleOffers?: TitleOffer[];
  Bookings?: TitleBooking[];
  StudentTypeAccessPermissions?: StudentTypeAccessPermission[];
}

export type Role = 'STUDENT' | 'SUPERVISOR' | 'EXAMINER' | 'ADMIN';

export interface Submission {
  id: number;
  userId: number;
  typeId: number;
  title: string;
  description: string;
  documentPath: string;
  createdAt: Date;
  updatedAt: Date;
  Verifications?: Verificator[];
  RequiredFiles?: SubmissionRequiredFile[];
  RequiredValues?: SubmissionRequiredValue[];
  Consultations?: SubmissionConsultation[];
  ActivityLogs?: ActivitySubmissionLog[];
  Grading?: Grading[];
  user?: User;
  type?: SubmissionType;
}

export interface SubmissionType {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  Formats?: DocumentFormat[];
  RequiredFiles?: RequiredFile[];
  RequiredValues?: RequiredValue[];
  Submissions?: Submission[];
  TypeAccessPermissions?: TypeAccessPermission[];
  StudentTypeAccessPermissions?: StudentTypeAccessPermission[];
}

export interface DocumentFormat {
  id: number;
  typeId: number;
  name: string;
  templatePath: string;
  createdAt: Date;
  updatedAt: Date;
  type?: SubmissionType;
}

export interface RequiredFile {
  id: number;
  typeId: number;
  fileName: string;
  templatePath: string;
  createdAt: Date;
  updatedAt: Date;
  type?: SubmissionType;
  SubmissionRequiredFiles?: SubmissionRequiredFile[];
}

export interface RequiredValue {
  id: number;
  typeId: number;
  key: string;
  createdAt: Date;
  updatedAt: Date;
  type?: SubmissionType;
  SubmissionRequiredValues?: SubmissionRequiredValue[];
}

export interface Verificator {
  id: number;
  userId: number;
  submissionId: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  submission?: Submission;
}

export interface SubmissionRequiredFile {
  id: number;
  submissionId: number;
  requiredFileId: number;
  path: string;
  createdAt: Date;
  updatedAt: Date;
  submission?: Submission;
  requiredFile?: RequiredFile;
}

export interface SubmissionRequiredValue {
  id: number;
  submissionId: number;
  requiredValueId: number;
  value: string;
  createdAt: Date;
  updatedAt: Date;
  submission?: Submission;
  requiredValue?: RequiredValue;
}

export interface SubmissionConsultation {
  id: number;
  submissionId: number;
  consultation: string;
  createdAt: Date;
  updatedAt: Date;
  submission?: Submission;
}

export interface SkillGroup {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  lecturers?: SkillGroupLecturer[];
}

export interface SkillGroupLecturer {
  id: number;
  skillGroupId: number;
  lecturerId: number;
  createdAt: Date;
  updatedAt: Date;
  skillGroup?: SkillGroup;
  lecturer?: User;
}

export interface ActivityUserLog {
  id: number;
  userId: number;
  activity: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface ActivitySubmissionLog {
  id: number;
  submissionId: number;
  userId: number;
  activity: string;
  createdAt: Date;
  updatedAt: Date;
  submission?: Submission;
  user?: User;
}

export interface Notification {
  id: number;
  userId: number;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface Grading {
  id: number;
  submissionId: number;
  lecturerId: number;
  grade: number;
  createdAt: Date;
  updatedAt: Date;
  submission?: Submission;
  lecturer?: User;
}

export interface TitleOffer {
  id: number;
  userId: number;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  TitleBookings?: TitleBooking[];
}

export interface TitleBooking {
  id: number;
  offerId: number;
  studentId: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  offer?: TitleOffer;
  student?: User;
}

export interface Setting {
  id: number;
  name: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemporaryFile {
  id: number;
  name: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TypeAccessPermission {
  id: number;
  typeId: number;
  roleId: Role;
  createdAt: Date;
  updatedAt: Date;
  type?: SubmissionType;
}

export interface StudentTypeAccessPermission {
  id: number;
  userId: number;
  typeId: number;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  type?: SubmissionType;
}
