// src/routes/wallet.routes.js
// Wallet management and fund transfer routes

import express from "express";
import {
  createWallet,
  getAllWallets,
  getWalletById,
  updateWallet,
  deleteWallet,
  transferFunds,
} from "../controllers/wallet.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All wallet routes are private
router.use(protect);

// @route   POST /api/wallets/transfer
// @access  Private
// NOTE: Must be defined before /:id to avoid param conflict
router.post("/transfer", transferFunds);

// @route   GET  /api/wallets
// @route   POST /api/wallets
// @access  Private
router
  .route("/")
  .get(getAllWallets)
  .post(createWallet);

// @route   GET    /api/wallets/:id
// @route   PUT    /api/wallets/:id
// @route   DELETE /api/wallets/:id
// @access  Private
router
  .route("/:id")
  .get(getWalletById)
  .put(updateWallet)
  .delete(deleteWallet);

export default router;
