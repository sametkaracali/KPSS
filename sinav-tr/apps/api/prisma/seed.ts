import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test users first
  const hashedPassword = await bcrypt.hash('test123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: hashedPassword,
      name: 'Test Admin',
      role: 'ADMIN',
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@test.com' },
    update: {},
    create: {
      email: 'student@test.com',
      password: hashedPassword,
      name: 'Test Öğrenci',
      role: 'STUDENT',
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@test.com' },
    update: {},
    create: {
      email: 'teacher@test.com',
      password: hashedPassword,
      name: 'Test Eğitmen',
      role: 'TEACHER',
    },
  });

  console.log('✅ Test users created');

  // Create subjects
  const matematik = await prisma.subject.upsert({
    where: { slug: 'matematik' },
    update: {},
    create: {
      name: 'Matematik',
      slug: 'matematik',
      examType: 'YKS_TYT',
    },
  });

  const fizik = await prisma.subject.upsert({
    where: { slug: 'fizik' },
    update: {},
    create: {
      name: 'Fizik',
      slug: 'fizik',
      examType: 'YKS_AYT',
    },
  });

  const kimya = await prisma.subject.upsert({
    where: { slug: 'kimya' },
    update: {},
    create: {
      name: 'Kimya',
      slug: 'kimya',
      examType: 'YKS_AYT',
    },
  });

  const biyoloji = await prisma.subject.upsert({
    where: { slug: 'biyoloji' },
    update: {},
    create: {
      name: 'Biyoloji',
      slug: 'biyoloji',
      examType: 'YKS_AYT',
    },
  });

  console.log('✅ Subjects created');

  // Create topics for Matematik
  const turev = await prisma.topic.upsert({
    where: {
      subjectId_slug: {
        subjectId: matematik.id,
        slug: 'turev',
      },
    },
    update: {},
    create: {
      name: 'Türev',
      slug: 'turev',
      subjectId: matematik.id,
    },
  });

  const integral = await prisma.topic.upsert({
    where: {
      subjectId_slug: {
        subjectId: matematik.id,
        slug: 'integral',
      },
    },
    update: {},
    create: {
      name: 'İntegral',
      slug: 'integral',
      subjectId: matematik.id,
    },
  });

  const limit = await prisma.topic.upsert({
    where: {
      subjectId_slug: {
        subjectId: matematik.id,
        slug: 'limit',
      },
    },
    update: {},
    create: {
      name: 'Limit',
      slug: 'limit',
      subjectId: matematik.id,
    },
  });

  console.log('✅ Topics created');

  // Create sample questions
  const question1 = await prisma.question.create({
    data: {
      text: 'f(x) = x² + 3x + 2 fonksiyonunun türevi nedir?',
      subjectId: matematik.id,
      topicId: turev.id,
      createdBy: admin.id,
      difficulty: 'EASY',
      explanation: 'Türev kurallarını kullanarak: f\'(x) = 2x + 3',
      options: {
        create: [
          { text: '2x + 3', isCorrect: true },
          { text: 'x² + 3', isCorrect: false },
          { text: '2x + 2', isCorrect: false },
          { text: 'x + 3', isCorrect: false },
        ],
      },
    },
  });

  const question2 = await prisma.question.create({
    data: {
      text: '∫(2x + 1)dx integrali nedir?',
      subjectId: matematik.id,
      topicId: integral.id,
      createdBy: admin.id,
      difficulty: 'MEDIUM',
      explanation: 'İntegral kurallarını kullanarak: x² + x + C',
      options: {
        create: [
          { text: 'x² + x + C', isCorrect: true },
          { text: '2x² + x + C', isCorrect: false },
          { text: 'x² + 2x + C', isCorrect: false },
          { text: '2x + C', isCorrect: false },
        ],
      },
    },
  });

  const question3 = await prisma.question.create({
    data: {
      text: 'lim(x→0) (sin x / x) limitinin değeri nedir?',
      subjectId: matematik.id,
      topicId: limit.id,
      createdBy: admin.id,
      difficulty: 'HARD',
      explanation: 'Bu önemli bir limit kuralıdır: lim(x→0) (sin x / x) = 1',
      options: {
        create: [
          { text: '1', isCorrect: true },
          { text: '0', isCorrect: false },
          { text: '∞', isCorrect: false },
          { text: 'Tanımsız', isCorrect: false },
        ],
      },
    },
  });

  console.log('✅ Questions created');

  // Create exams
  const exam1 = await prisma.exam.create({
    data: {
      title: 'YKS TYT Deneme 1',
      examType: 'YKS_TYT',
      description: 'YKS TYT için kapsamlı deneme sınavı',
      duration: 135,
      totalQuestions: 120,
      passingScore: 60,
    },
  });

  const exam2 = await prisma.exam.create({
    data: {
      title: 'YKS AYT Matematik',
      examType: 'YKS_AYT',
      description: 'YKS AYT Matematik deneme sınavı',
      duration: 75,
      totalQuestions: 40,
      passingScore: 25,
    },
  });

  const exam3 = await prisma.exam.create({
    data: {
      title: 'KPSS Genel Yetenek',
      examType: 'KPSS',
      description: 'KPSS Genel Yetenek deneme sınavı',
      duration: 90,
      totalQuestions: 60,
      passingScore: 40,
    },
  });

  console.log('✅ Exams created');

  // Create subscription plans
  const freePlan = await prisma.subscription.create({
    data: {
      userId: student.id,
      plan: 'FREE',
      planId: 'free-plan-id',
      active: true,
      startDate: new Date(),
    },
  });

  console.log('✅ Subscription plans created');

  console.log('\n📧 Test Credentials:');
  console.log('Student: student@test.com / test123');
  console.log('Teacher: teacher@test.com / test123');
  console.log('Admin: admin@test.com / test123');

  console.log('\n🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
