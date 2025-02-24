const prisma = require('../config/db');

async function getFiles() {
  const files = await prisma.file.findMany();
  await prisma.$disconnect();
  return files;
}

async function getFileById(id) {
  const file = await prisma.file.findUnique({
    where: {
      id,
    },
  });
  await prisma.$disconnect();
  return file;
}

async function addUser(data) {
  await prisma.user.create({ data });
  await prisma.$disconnect();
}

async function addFile(data) {
  await prisma.file.create({ data });
  await prisma.$disconnect();
}

module.exports = {
  getFiles,
  getFileById,
  addUser,
  addFile,
};
