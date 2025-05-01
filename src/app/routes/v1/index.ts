import Express from "express";
import { AuthController } from "../../controllers/auth.controller";

const router = Express.Router();

router.post("/auth/request-code", AuthController.requestCode);
router.post("/auth/verify-code", AuthController.verifyCode);

export default router;
