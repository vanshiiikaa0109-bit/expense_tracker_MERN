// src/controllers/wallet.controller.js
// Handles multiple wallet/account management

import * as walletService from "../services/auth.service.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { WALLET_MESSAGES } from "../constants/messages.js";

// @desc    Create a new wallet
// @route   POST /api/wallets
// @access  Private
export const createWallet = async (req, res) => {
  try {
    const data = await walletService.createWallet(req.user.id, req.body);

    return res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: WALLET_MESSAGES.CREATED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all wallets for user
// @route   GET /api/wallets
// @access  Private
export const getAllWallets = async (req, res) => {
  try {
    const data = await walletService.getAllWallets(req.user.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: WALLET_MESSAGES.ALL_FETCHED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single wallet by ID
// @route   GET /api/wallets/:id
// @access  Private
export const getWalletById = async (req, res) => {
  try {
    const data = await walletService.getWalletById(req.user.id, req.params.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: WALLET_MESSAGES.FETCHED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update a wallet
// @route   PUT /api/wallets/:id
// @access  Private
export const updateWallet = async (req, res) => {
  try {
    const data = await walletService.updateWallet(req.user.id, req.params.id, req.body);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: WALLET_MESSAGES.UPDATED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a wallet
// @route   DELETE /api/wallets/:id
// @access  Private
export const deleteWallet = async (req, res) => {
  try {
    await walletService.deleteWallet(req.user.id, req.params.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: WALLET_MESSAGES.DELETED,
      data: null,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Transfer funds between wallets
// @route   POST /api/wallets/transfer
// @access  Private
export const transferFunds = async (req, res) => {
  try {
    const { fromWalletId, toWalletId, amount } = req.body;
    const data = await walletService.transferFunds(req.user.id, fromWalletId, toWalletId, amount);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Transfer successful",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
