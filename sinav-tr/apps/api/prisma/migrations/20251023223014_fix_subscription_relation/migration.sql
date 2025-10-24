-- Step 1: Add new columns with default values first
ALTER TABLE "ExamAnswer" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "ExamAnswer" ADD COLUMN "flagged" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "ExamAnswer" ADD COLUMN "selectedOption" INTEGER NOT NULL DEFAULT 0;

-- Step 2: Add columns to ExamResult with default values
ALTER TABLE "ExamResult" ADD COLUMN "correctAnswers" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "ExamResult" ADD COLUMN "timeTaken" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "ExamResult" ADD COLUMN "totalQuestions" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "ExamResult" ALTER COLUMN "score" SET DATA TYPE DOUBLE PRECISION;

-- Step 3: Add columns to Payment
ALTER TABLE "Payment" ADD COLUMN "conversationId" TEXT;
ALTER TABLE "Payment" ADD COLUMN "errorMessage" TEXT;
ALTER TABLE "Payment" ADD COLUMN "paymentDetails" JSONB;
ALTER TABLE "Payment" ADD COLUMN "paymentId" TEXT;
ALTER TABLE "Payment" ADD COLUMN "planId" TEXT;
ALTER TABLE "Payment" ADD COLUMN "refundReason" TEXT;
ALTER TABLE "Payment" ADD COLUMN "refundedAt" TIMESTAMP(3);
ALTER TABLE "Payment" ADD COLUMN "subscriptionId" TEXT;

-- Step 4: Add columns to Question
ALTER TABLE "Question" ADD COLUMN "approvedAt" TIMESTAMP(3);
ALTER TABLE "Question" ADD COLUMN "likes" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Question" ADD COLUMN "rejectionReason" TEXT;
ALTER TABLE "Question" ADD COLUMN "reports" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Question" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'PENDING';
ALTER TABLE "Question" ADD COLUMN "views" INTEGER NOT NULL DEFAULT 0;

-- Step 5: Add columns to Subscription
ALTER TABLE "Subscription" ADD COLUMN "autoRenew" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Subscription" ADD COLUMN "cancelledAt" TIMESTAMP(3);
ALTER TABLE "Subscription" ADD COLUMN "planId" TEXT;
ALTER TABLE "Subscription" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'ACTIVE';

-- Set default planId for existing subscriptions
UPDATE "Subscription" SET "planId" = 'free' WHERE "planId" IS NULL;

-- Step 6: Add columns to User
ALTER TABLE "User" ADD COLUMN "banReason" TEXT;
ALTER TABLE "User" ADD COLUMN "bannedUntil" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "lastSeen" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "twoFactorSecret" TEXT;

-- CreateTable
CREATE TABLE "ExamSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "pausedAt" TIMESTAMP(3),
    "autoSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "questionsAttempted" INTEGER NOT NULL,
    "correctAnswers" INTEGER NOT NULL,
    "timeSpent" INTEGER NOT NULL,
    "successRate" DOUBLE PRECISION NOT NULL,
    "completedVideos" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicMastery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "masteryLevel" DOUBLE PRECISION NOT NULL,
    "lastPracticed" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TopicMastery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "points" INTEGER NOT NULL DEFAULT 10,
    "category" TEXT NOT NULL,
    "requirement" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "data" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "page" TEXT NOT NULL,
    "referrer" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PushSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "keys" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExamSession_userId_idx" ON "ExamSession"("userId");

-- CreateIndex
CREATE INDEX "ExamSession_examId_idx" ON "ExamSession"("examId");

-- CreateIndex
CREATE INDEX "ExamSession_status_idx" ON "ExamSession"("status");

-- CreateIndex
CREATE INDEX "LearningSession_userId_idx" ON "LearningSession"("userId");

-- CreateIndex
CREATE INDEX "LearningSession_topicId_idx" ON "LearningSession"("topicId");

-- CreateIndex
CREATE INDEX "LearningSession_createdAt_idx" ON "LearningSession"("createdAt");

-- CreateIndex
CREATE INDEX "TopicMastery_userId_idx" ON "TopicMastery"("userId");

-- CreateIndex
CREATE INDEX "TopicMastery_masteryLevel_idx" ON "TopicMastery"("masteryLevel");

-- CreateIndex
CREATE UNIQUE INDEX "TopicMastery_userId_topicId_key" ON "TopicMastery"("userId", "topicId");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_name_key" ON "Achievement"("name");

-- CreateIndex
CREATE INDEX "UserAchievement_userId_idx" ON "UserAchievement"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON "UserAchievement"("userId", "achievementId");

-- CreateIndex
CREATE INDEX "Notification_userId_read_idx" ON "Notification"("userId", "read");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "PageView_userId_idx" ON "PageView"("userId");

-- CreateIndex
CREATE INDEX "PageView_page_idx" ON "PageView"("page");

-- CreateIndex
CREATE INDEX "PageView_timestamp_idx" ON "PageView"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");

-- CreateIndex
CREATE INDEX "PushSubscription_userId_idx" ON "PushSubscription"("userId");

-- CreateIndex
CREATE INDEX "ExamAnswer_resultId_idx" ON "ExamAnswer"("resultId");

-- CreateIndex
CREATE INDEX "Question_status_idx" ON "Question"("status");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSession" ADD CONSTRAINT "ExamSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSession" ADD CONSTRAINT "ExamSession_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningSession" ADD CONSTRAINT "LearningSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningSession" ADD CONSTRAINT "LearningSession_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicMastery" ADD CONSTRAINT "TopicMastery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicMastery" ADD CONSTRAINT "TopicMastery_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
