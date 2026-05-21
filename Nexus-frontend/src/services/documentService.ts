const API_URL = "http://localhost:5000/api/documents";

export const uploadDocument = async (formData: FormData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: formData,
  });

  return await res.json();
};

export const getDocuments = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

export const uploadSignature = async (id: string, formData: FormData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/${id}/sign`, {
    method: "PUT",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: formData,
  });

  return await res.json();
};
