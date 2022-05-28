import { PrismaClient } from '@prisma/client';
import moment from 'moment';

const prisma = new PrismaClient();

const main = async () => {
  try {
    await prisma.user.create({
      data: {
        id: 1,
        name: 'Sorin',
        password: 'Sorin',
      },
    });

    await prisma.building.create({
      data: {
        id: 1,
        user_id: 1,
      },
    });

    await prisma.space.create({
      data: {
        id: 1,
        x: 1,
        y: 2,
        z: 3,
        building_id: 1,
      },
    });

    const book_from = moment().toISOString();
    const book_until = moment().add(2, 'hours').toISOString();

    await prisma.booking.create({
      data: {
        book_from,
        book_until,
        space_id: 1,
        user_id: 1,
      },
    });
  } catch (e) {
    console.error(e);
  } finally {
    prisma.$disconnect();
  }
};

main();
