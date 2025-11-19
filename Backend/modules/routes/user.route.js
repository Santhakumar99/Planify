import express from 'express'
const router = express.Router();
import {getallusers, login, register} from "../controllers/user.controller.js"

router.post('/register' ,register);
router.post('/login', login);
router.get('/allusers',getallusers)

// module.exports = router;
export default router