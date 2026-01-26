import { deleteSubscriber } from "../controllers/subscriberController.js";
import { adminAuth } from "../middleware/adminAuth.js";

router.delete("/subscribers/:id", adminAuth, deleteSubscriber);
