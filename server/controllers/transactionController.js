import Transaction from "../models/transactionModel.js";
import sanitizeHtml from "sanitize-html";

const transactionController = {};

transactionController.deposit = async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      type: "deposit",
      amount,
      status: "completed",
    });

    res.status(201).json({
      message: "Deposit successful",
      transaction,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

transactionController.withdraw = async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      type: "withdraw",
      amount,
      status: "completed",
    });

    res.status(201).json({
      message: "Withdraw successful",
      transaction,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

transactionController.transfer = async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    const recipient = sanitizeHtml(req.body.recipient || "").trim();

    if (!amount || amount <= 0 || !recipient) {
      return res.status(400).json({
        message: "Invalid transfer data",
      });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      recipient,
      type: "transfer",
      amount,
      status: "completed",
    });

    res.status(201).json({
      message: "Transfer successful",
      transaction,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

transactionController.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    })
      .populate("recipient", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      transactions,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export default transactionController;
