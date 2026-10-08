import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const mentors = [
  { name: "Ravi Kumar", email: "ravi@codeyoung.com" },
  { name: "Priya Sharma", email: "priya@codeyoung.com" },
  { name: "Amit Patel", email: "amit@codeyoung.com" },
  { name: "Sneha Nair", email: "sneha@codeyoung.com" },
  { name: "Vikram Singh", email: "vikram@codeyoung.com" },
  { name: "Anjali Rao", email: "anjali@codeyoung.com" },
  { name: "Rahul Verma", email: "rahul@codeyoung.com" },
  { name: "Kavya Menon", email: "kavya@codeyoung.com" },
  { name: "Arjun Das", email: "arjun@codeyoung.com" },
  { name: "Meera Joshi", email: "meera@codeyoung.com" },
];

async function main() {
  console.log("🌱 Seeding mentors...");

  for (const mentor of mentors) {
    await prisma.mentor.upsert({
      where: { email: mentor.email },
      update: {},
      create: {
        ...mentor,
        timezone: "Asia/Kolkata",
      },
    });
    console.log(`  ✓ ${mentor.name}`);
  }

  console.log(`\n✅ Seeded ${mentors.length} mentors successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
