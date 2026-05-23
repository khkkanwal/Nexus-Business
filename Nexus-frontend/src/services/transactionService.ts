const API_URL = "http://localhost:5000/api/transactions";

const getToken = () => {
  return localStorage.getItem("token");
};

export const depositMoney = async (amount: number) => {
  const res = await fetch(`${API_URL}/deposit`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${getToken()}`,
    },

    body: JSON.stringify({
      amount,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Deposit failed");
  }

  return data;
};

export const withdrawMoney = async (amount: number) => {
  const res = await fetch(`${API_URL}/withdraw`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${getToken()}`,
    },

    body: JSON.stringify({
      amount,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Withdraw failed");
  }

  return data;
};

export const transferMoney = async (amount: number, recipient: string) => {
  const res = await fetch(`${API_URL}/transfer`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${getToken()}`,
    },

    body: JSON.stringify({
      amount,

      recipient,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Transfer failed");
  }

  return data;
};

export const getTransactions = async () => {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch transactions");
  }

  return data;
};
