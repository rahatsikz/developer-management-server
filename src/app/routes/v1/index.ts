import Express from "express";
import { AuthController } from "../../controllers/auth.controller";
import { CompanyController } from "../../controllers/company.controller";
import { TeamController } from "../../controllers/team.controller";
import { ProjectController } from "../../controllers/project.controller";
import { GithubController } from "../../controllers/github.controller";
import { RepositoryController } from "../../controllers/repository.controller";

const router = Express.Router();

router.post("/auth/request-code", AuthController.requestCode);
router.post("/auth/verify-code", AuthController.verifyCode);

router.post("/company", CompanyController.create);
router.get("/company/:id", CompanyController.getOne as any);
router.put("/company/:id", CompanyController.update);
router.delete("/company/:id", CompanyController.remove);

router.post("/team", TeamController.create);
router.get("/teams", TeamController.getAll);
router.get("/team/:id", TeamController.getOne as any);
router.put("/team/:id", TeamController.update);
router.delete("/team/:id", TeamController.remove);

router.post("/project", ProjectController.create);
router.get("/projects", ProjectController.getAll);
router.get("/project/:id", ProjectController.getOne as any);
router.put("/project/:id", ProjectController.update);
router.delete("/project/:id", ProjectController.remove);

router.get("/auth/github/login", GithubController.redirectToGithub);
router.get("/auth/github/callback", GithubController.githubCallback);

router.post("/repository", RepositoryController.create);
router.get("/repository/:id", RepositoryController.getOne as any);

export default router;
