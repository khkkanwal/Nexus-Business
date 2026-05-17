const API_URL = "http://localhost:5000/api/meetings";

// =========================
// CREATE MEETING
// =========================
export const createMeeting = async (meetingData: any) => {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(meetingData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create meeting");
  }

  return data;
};

// =========================
// GET ALL MEETINGS
// =========================
export const getMeetings = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch meetings");
  }

  return data;
};

// =========================
// GET SINGLE MEETING
// =========================
export const getMeetingById = async (id: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch meeting");
  }

  return data;
};

// =========================
// UPDATE MEETING
// =========================
export const updateMeeting = async (id: string, meetingData: any) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(meetingData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update meeting");
  }

  return data;
};

// =========================
// DELETE MEETING
// =========================
export const deleteMeeting = async (id: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete meeting");
  }

  return data;
};

// =========================
// ACCEPT MEETING
// =========================
export const acceptMeeting = async (id: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/${id}/accept`, {
    method: "PUT",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to accept meeting");
  }

  return data;
};

// =========================
// REJECT MEETING
// =========================
export const rejectMeeting = async (id: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/${id}/reject`, {
    method: "PUT",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to reject meeting");
  }

  return data;
};
