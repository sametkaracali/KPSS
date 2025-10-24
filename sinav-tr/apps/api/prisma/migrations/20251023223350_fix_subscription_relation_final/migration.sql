/*
  Warnings:

  - Made the column `planId` on table `Payment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `planId` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ExamAnswer" ALTER COLUMN "selectedOption" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ExamResult" ALTER COLUMN "correctAnswers" DROP DEFAULT,
ALTER COLUMN "timeTaken" DROP DEFAULT,
ALTER COLUMN "totalQuestions" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "planId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "planId" SET NOT NULL;
