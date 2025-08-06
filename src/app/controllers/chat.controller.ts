import { NextFunction, Request, Response } from "express";
import { ChatService } from "../services/chat.service";
import httpStatus from "http-status";

const fetchChats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { spaceId } = req.params;
    const userId = (req.user as any).id;

    const chats = await ChatService.getChatsBySpace(spaceId, userId);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Chats fetched successfully",
      data: chats,
    });
  } catch (error) {
    next(error);
  }
};

const fetchMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;
    const messages = await ChatService.getMessagesByChat(chatId);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// We won’t POST messages over REST in real time—but you could:
const postMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chatId } = req.params;
    const { userId, content } = req.body;
    const message = await ChatService.createMessage(chatId, userId, content);
    res.status(httpStatus.CREATED).json({
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Message added successfully",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// create chat
const createChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { spaceId, userIds } = req.body;
    const profileId = (req.user as any).id;
    const concatedIds = [...userIds, profileId];
    const result = await ChatService.createChat(spaceId, concatedIds);
    res.status(httpStatus.CREATED).json({
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Chat created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const ChatController = {
  fetchChats,
  fetchMessages,
  postMessage,
  createChat,
};
