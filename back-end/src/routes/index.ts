import { Router } from "express";

import { template } from "./template";
import { warehouse } from "./warehouse";

const router = Router();

router.use("/", warehouse);
router.use("/template", template);

export { router };
