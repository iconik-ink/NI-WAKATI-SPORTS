import { Router } from 'express';
import { loginUser, logoutuser, registerUser } from '../controllers/user.controller.js';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutuser);

// Test route - confirms API is working
router.route('/').get((req, res) => {
  res.json({
    success: true,
    message: 'Users API is operational',
    endpoints: [
      'POST /api/v1/users/register',
      'POST /api/v1/users/login',
      'POST /api/v1/users/logout'
    ]
  });
});



export default router;