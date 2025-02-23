const prisma = require('../config/db');

async function addUser(data) {
  await prisma.user.create({ data });
  await prisma.$disconnect();
}

module.exports = {
  addUser,
};
