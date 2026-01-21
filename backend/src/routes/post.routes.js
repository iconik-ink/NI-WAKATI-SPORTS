import { Router } from 'express';
import { createPosts, getPosts, updatePosts, deletePosts} from '../controllers/post.controller.js';

const router = Router();

router.route('/create').post(createPosts);
router.route('/getPosts').get(getPosts);
router.route('/update/:id').patch(updatePosts);
router.route('/delete/:id').delete(deletePosts);

export default router;