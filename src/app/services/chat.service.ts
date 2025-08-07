import prisma from "../../shared/prisma";

// create chat
const createChat = async (spaceId: string, userIds: string[]) => {
  return prisma.chat.create({
    data: {
      space: { connect: { id: spaceId } },
      users: { connect: userIds.map((id) => ({ id })) },
    },
  });
};
const getChatsBySpace = async (spaceId: string, userId: string) => {
  return prisma.chat.findMany({
    where: { spaceId, users: { some: { id: userId } } },
    include: {
      users: true,
      Message: { orderBy: { createdAt: "asc" }, include: { seenBy: true } },
    },
  });
};

const getMessagesByChat = async (chatId: string) => {
  return prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
    include: { seenBy: true },
  });
};

const createMessage = async (
  chatId: string,
  userId: string,
  content: string
) => {
  return prisma.message.create({
    data: {
      chat: { connect: { id: chatId } },
      content,
      sender: { connect: { id: userId } },
    },
  });
};

const seenMessages = async (messageIds: string[], userId: string) => {
  const updates = messageIds.map((id) =>
    prisma.message.update({
      where: { id },
      data: {
        seenBy: {
          connect: { id: userId },
        },
      },
    })
  );

  return await Promise.all(updates);
};

export const ChatService = {
  getChatsBySpace,
  getMessagesByChat,
  createMessage,
  createChat,
  seenMessages,
};
