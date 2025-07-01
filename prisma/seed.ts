import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const peptidesPath = path.join(__dirname, '../public/data/peptides.json');
  const peptidesRaw = fs.readFileSync(peptidesPath, 'utf-8');
  const peptides = JSON.parse(peptidesRaw);

  for (const peptide of peptides) {
    await prisma.product.upsert({
      where: { id: peptide.id },
      update: {},
      create: {
        id: peptide.id,
        name: peptide.name,
        useCase: peptide.use_case,
        injectionSite: peptide.injection_site,
        description: peptide.description,
        tags: JSON.stringify(peptide.tags),
        price: peptide.price,
        dosage: peptide.dosage,
        cycleLength: peptide.cycle_length,
        image: peptide.image,
        stockQuantity: 100, // Default stock for demo
        isActive: true,
      },
    });
  }

  console.log('Seeded peptides!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 