import React, { useEffect, useState } from "react";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Send,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import {
  depositMoney,
  withdrawMoney,
  transferMoney,
  getTransactions,
} from "../../services/transactionService";
import { getUsers } from "../../services/userService";

export const PaymentsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchUsers();
  }, []);

  const handleDeposit = async () => {
    try {
      setError(null);

      if (!depositAmount.trim()) {
        setError("Deposit amount is required");
        return;
      }

      const amount = Number(depositAmount);

      if (isNaN(amount) || amount <= 0) {
        setError("Deposit amount must be greater than 0");
        return;
      }

      await depositMoney(amount);

      alert("Deposit successful");
      setDepositAmount("");
      fetchTransactions();
    } catch (error: any) {
      console.log(error);
      setError(error.message || "Deposit failed");
    }
  };

  const handleWithdraw = async () => {
    try {
      setError(null);

      if (!withdrawAmount.trim()) {
        setError("Withdraw amount is required");
        return;
      }

      const amount = Number(withdrawAmount);

      if (isNaN(amount) || amount <= 0) {
        setError("Withdraw amount must be greater than 0");
        return;
      }

      await withdrawMoney(amount);

      alert("Withdraw successful");
      setWithdrawAmount("");
      fetchTransactions();
    } catch (error: any) {
      console.log(error);
      setError(error.message || "Withdraw failed");
    }
  };

  const handleTransfer = async () => {
    try {
      setError(null);

      if (!transferAmount.trim()) {
        setError("Transfer amount is required");
        return;
      }

      const amount = Number(transferAmount);

      if (isNaN(amount) || amount <= 0) {
        setError("Transfer amount must be greater than 0");
        return;
      }

      if (!recipient) {
        setError("Please select a recipient");
        return;
      }

      await transferMoney(amount, recipient);

      alert("Transfer successful");

      setTransferAmount("");
      setRecipient("");

      fetchTransactions();
    } catch (error: any) {
      console.log(error);
      setError(error.message || "Transfer failed");
    }
  };

  const totalDeposits = transactions
    .filter((t) => t.type === "deposit")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalWithdraws = transactions
    .filter((t) => t.type === "withdraw")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalTransfers = transactions
    .filter((t) => t.type === "transfer")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment Dashboard</h1>
        <p className="text-gray-600">
          Manage deposits, withdrawals and transfers
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md flex items-start">
          <AlertCircle size={18} className="mr-2 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100">
              <ArrowDownCircle className="text-green-600" size={28} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Deposits</p>

              <h3 className="text-2xl font-bold text-gray-900">
                ${totalDeposits}
              </h3>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-100">
              <ArrowUpCircle className="text-red-600" size={28} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Withdrawals</p>

              <h3 className="text-2xl font-bold text-gray-900">
                ${totalWithdraws}
              </h3>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <Send className="text-blue-600" size={28} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Transfers</p>

              <h3 className="text-2xl font-bold text-gray-900">
                ${totalTransfers}
              </h3>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Deposit Money
            </h2>
          </CardHeader>

          <CardBody className="space-y-4">
            <Input
              type="number"
              placeholder="Enter amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />

            <Button onClick={handleDeposit} className="w-full">
              Deposit
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Withdraw Money
            </h2>
          </CardHeader>

          <CardBody className="space-y-4">
            <Input
              type="number"
              placeholder="Enter amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />

            <Button
              variant="outline"
              onClick={handleWithdraw}
              className="w-full"
            >
              Withdraw
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Transfer Money
            </h2>
          </CardHeader>

          <CardBody className="space-y-4">
            <Input
              type="number"
              placeholder="Enter amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
            />

            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Select Recipient</option>

              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>

            <Button onClick={handleTransfer} className="w-full">
              Transfer
            </Button>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wallet size={22} />

            <h2 className="text-lg font-semibold text-gray-900">
              Transaction History
            </h2>
          </div>
        </CardHeader>

        <CardBody>
          {loading ? (
            <p className="text-gray-500">Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p className="text-gray-500">No transactions found</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {transaction.type}
                      </h3>

                      <Badge>{transaction.status}</Badge>
                    </div>

                    <p className="text-sm text-gray-500 mt-1">
                      ${transaction.amount}
                    </p>

                    {transaction.recipient && (
                      <p className="text-sm text-gray-500">
                        Recipient: {transaction.recipient?.name}
                      </p>
                    )}

                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    {transaction.type === "deposit" && (
                      <div className="text-green-600 font-semibold">
                        + ${transaction.amount}
                      </div>
                    )}

                    {transaction.type === "withdraw" && (
                      <div className="text-red-600 font-semibold">
                        - ${transaction.amount}
                      </div>
                    )}

                    {transaction.type === "transfer" && (
                      <div className="text-blue-600 font-semibold">
                        → ${transaction.amount}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
