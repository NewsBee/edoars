-- DropForeignKey
ALTER TABLE `activitysubmissionlog` DROP FOREIGN KEY `ActivitySubmissionLog_submissionId_fkey`;

-- DropForeignKey
ALTER TABLE `assignedlecturer` DROP FOREIGN KEY `AssignedLecturer_submissionId_fkey`;

-- DropForeignKey
ALTER TABLE `submissionrequiredfile` DROP FOREIGN KEY `SubmissionRequiredFile_submissionId_fkey`;

-- AlterTable
ALTER TABLE `activitysubmissionlog` ADD COLUMN `titleSubmissionId` INTEGER NULL,
    MODIFY `submissionId` INTEGER NULL;

-- AlterTable
ALTER TABLE `assignedlecturer` ADD COLUMN `source` VARCHAR(191) NULL,
    ADD COLUMN `titleSubmissionId` INTEGER NULL,
    MODIFY `submissionId` INTEGER NULL,
    MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `submission` ADD COLUMN `relatedTitleId` INTEGER NULL,
    MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `submissionrequiredfile` ADD COLUMN `titleSubmissionId` INTEGER NULL,
    MODIFY `submissionId` INTEGER NULL;

-- CreateTable
CREATE TABLE `TitleSubmission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `topic` VARCHAR(191) NULL,
    `abstract` TEXT NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    `reason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApprovalLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `submissionId` INTEGER NULL,
    `titleSubmissionId` INTEGER NULL,
    `action` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DiscussionRoom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `submissionId` INTEGER NOT NULL,
    `participantId` INTEGER NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DiscussionPoint` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `discussionRoomId` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `discussionRoomId` INTEGER NOT NULL,
    `discussionPointId` INTEGER NULL,
    `senderId` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NULL,
    `messageType` VARCHAR(191) NOT NULL DEFAULT 'text',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TitleSubmission` ADD CONSTRAINT `TitleSubmission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubmissionRequiredFile` ADD CONSTRAINT `SubmissionRequiredFile_titleSubmissionId_fkey` FOREIGN KEY (`titleSubmissionId`) REFERENCES `TitleSubmission`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubmissionRequiredFile` ADD CONSTRAINT `SubmissionRequiredFile_submissionId_fkey` FOREIGN KEY (`submissionId`) REFERENCES `Submission`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssignedLecturer` ADD CONSTRAINT `AssignedLecturer_titleSubmissionId_fkey` FOREIGN KEY (`titleSubmissionId`) REFERENCES `TitleSubmission`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssignedLecturer` ADD CONSTRAINT `AssignedLecturer_submissionId_fkey` FOREIGN KEY (`submissionId`) REFERENCES `Submission`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiscussionRoom` ADD CONSTRAINT `DiscussionRoom_submissionId_fkey` FOREIGN KEY (`submissionId`) REFERENCES `Submission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiscussionRoom` ADD CONSTRAINT `DiscussionRoom_participantId_fkey` FOREIGN KEY (`participantId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiscussionPoint` ADD CONSTRAINT `DiscussionPoint_discussionRoomId_fkey` FOREIGN KEY (`discussionRoomId`) REFERENCES `DiscussionRoom`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_discussionRoomId_fkey` FOREIGN KEY (`discussionRoomId`) REFERENCES `DiscussionRoom`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_discussionPointId_fkey` FOREIGN KEY (`discussionPointId`) REFERENCES `DiscussionPoint`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivitySubmissionLog` ADD CONSTRAINT `ActivitySubmissionLog_submissionId_fkey` FOREIGN KEY (`submissionId`) REFERENCES `Submission`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivitySubmissionLog` ADD CONSTRAINT `ActivitySubmissionLog_titleSubmissionId_fkey` FOREIGN KEY (`titleSubmissionId`) REFERENCES `TitleSubmission`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
