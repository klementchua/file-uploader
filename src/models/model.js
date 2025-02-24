const prisma = require('../config/db');

async function getFolders() {
  const folders = await prisma.folder.findMany();
  await prisma.$disconnect();
  return folders;
}

async function getFolderWithFilesById(id) {
  const folder = await prisma.folder.findUnique({
    where: {
      id,
    },
    include: {
      files: true,
    },
  });
  await prisma.$disconnect();
  return folder;
}

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

async function addFile({ title, filename, size }, folderId) {
  await prisma.file.create({
    data: {
      title,
      filename,
      size,
      folder: {
        connect: { id: folderId },
      },
    },
  });
  await prisma.$disconnect();
}

async function addFolder(data) {
  await prisma.folder.create({ data });
  await prisma.$disconnect();
}

module.exports = {
  getFolders,
  getFolderWithFilesById,
  getFiles,
  getFileById,
  addUser,
  addFile,
  addFolder,
};
