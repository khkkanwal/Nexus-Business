export const getUsers = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};
