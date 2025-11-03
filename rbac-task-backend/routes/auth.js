// routes/auth.js
import express from "express";
// This named import is now valid because authController.js exports { login, logout, refresh }
import { login, logout, refresh } from '../controllers/authController.js'; 

const router = express.Router();

// Authentication routes
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);

// Placeholder for registration - assuming it will use a controller from users/auth
router.post("/register", (req, res) => {
  res.status(501).send("Register route not fully implemented yet - redirecting to user creation endpoint or adding logic here.");
});

export default router;