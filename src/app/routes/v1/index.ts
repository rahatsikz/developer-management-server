import Express from "express";
import { AuthController } from "../../controllers/auth.controller";
import { CompanyController } from "../../controllers/company.controller";
import { ProjectController } from "../../controllers/project.controller";
import { GithubController } from "../../controllers/github.controller";
import { authenticate } from "../../middlewares/auth";
import { SpaceController } from "../../controllers/space.controller";
import { TaskController } from "../../controllers/task.controller";
import { ChatController } from "../../controllers/chat.controller";

const router = Express.Router();

router.post("/auth/request-code", AuthController.requestCode);
router.post("/auth/verify-code", AuthController.verifyCode);
router.post("/auth/logout", AuthController.logout);
router.post("/auth/invite-employee", AuthController.inviteEmployee);
router.get("/profile/me", authenticate, AuthController.getProfile);
router.put("/profile/update", authenticate, AuthController.updateUserProfile);

router.post("/company", CompanyController.create);
router.get("/company/:id", CompanyController.getOne);
router.put("/company/:id", CompanyController.update);
router.delete("/company/:id", CompanyController.remove);
router.get("/company/user/:id", CompanyController.getCompanyByUserId);

router.post("/project", ProjectController.create);
router.get("/projects", ProjectController.getAll);
router.get("/project/:id", ProjectController.getOne);
router.put("/project/:id", ProjectController.update);
router.delete("/project/:id", ProjectController.remove);

router.post("/space", SpaceController.create);
router.get("/spaces/project/:projectId", SpaceController.getAllByProjectId);
router.get("/space/:id", SpaceController.getById);
router.put("/space/:id", SpaceController.update);
router.delete("/space/:id", SpaceController.remove);

router.post("/task", TaskController.create);
router.put("/task/reorder", TaskController.updateOrderByIndex);
router.put("/task/:id", TaskController.update);
router.get("/tasks/space/:spaceId", TaskController.getAllBySpaceId);
router.post("/task/:taskId/comment", TaskController.createComment);
router.post("/task/:taskId/subtask", TaskController.createSubTask);
router.put("/task/subtask/:id", TaskController.updateSubTask);

router.post("/spaces/:spaceId/chats", authenticate, ChatController.createChat);
router.get("/spaces/:spaceId/chats", authenticate, ChatController.fetchChats);
router.get(
  "/chats/:chatId/messages",
  authenticate,
  ChatController.fetchMessages
);

router.get("/messages/:id", authenticate, ChatController.getMessageById);

router.post("/chats/:chatId/messages", ChatController.postMessage);
router.put(
  "/chats/:chatId/messages/seen",
  authenticate,
  ChatController.seenMessage
);

router.get("/auth/github/login", GithubController.redirectToGithub);
router.get("/auth/github/callback", GithubController.githubCallback);

export default router;
