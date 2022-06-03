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
        name: 'UPT',
      },
    });

    await prisma.floor.createMany({
      data: [
        {
          building_id: 1,
          level: 1,
          id: 1,
        },
        {
          building_id: 1,
          level: 2,
          id: 2,
        },
        {
          building_id: 1,
          level: 3,
          id: 3,
        },
      ],
    });

    await prisma.space.createMany({
      data: [
        {
          id: 1,
          x: 0,
          y: 0,
          floor_id: 1,
        },
        {
          id: 2,
          x: 0,
          y: 1,
          floor_id: 1,
        },
        {
          id: 3,
          x: 1,
          y: 0,
          floor_id: 1,
        },
        {
          id: 4,
          x: 1,
          y: 1,
          floor_id: 1,
        },

        {
          id: 5,
          x: 0,
          y: 0,
          floor_id: 2,
        },
        {
          id: 6,
          x: 0,
          y: 1,
          floor_id: 2,
        },
        {
          id: 7,
          x: 1,
          y: 0,
          floor_id: 2,
        },
        {
          id: 8,
          x: 1,
          y: 1,
          floor_id: 2,
        },
        {
          id: 9,
          x: 0,
          y: 0,
          floor_id: 3,
        },
        {
          id: 10,
          x: 0,
          y: 1,
          floor_id: 3,
        },
        {
          id: 11,
          x: 1,
          y: 0,
          floor_id: 3,
        },
        {
          id: 12,
          x: 1,
          y: 1,
          floor_id: 3,
        },
      ],
    });

    const bf1 = moment().toISOString();
    const bu1 = moment().add(1, 'hours').toISOString();

    const bf2 = moment().add(2, 'hours').toISOString();
    const bu2 = moment().add(3, 'hours').toISOString();

    const bf3 = moment().add(4, 'hours').toISOString();
    const bu3 = moment().add(5, 'hours').toISOString();

    const bf4 = moment().add(8, 'hours').toISOString();
    const bu4 = moment().add(9, 'hours').toISOString();

    await prisma.booking.createMany({
      data: [
        {
          book_from: bf1,
          book_until: bu1,
          space_id: 1,
          user_id: 1,
        },
        {
          book_from: bf2,
          book_until: bu2,
          space_id: 1,
          user_id: 1,
        },
        {
          book_from: bf3,
          book_until: bu3,
          space_id: 1,
          user_id: 1,
        },
        {
          book_from: bf4,
          book_until: bu4,
          space_id: 1,
          user_id: 1,
        },
      ],
    });
  } catch (e) {
    console.error(e);
  } finally {
    prisma.$disconnect();
  }
};

main();
