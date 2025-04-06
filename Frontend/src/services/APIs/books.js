import { getAuthToken } from "./helper";

const URL = "https://dream-book-backend-main.vercel.app/api";

// ✅ Add a new book (Fixed `fetch` URL & added Authorization)
export const addBook = async (payload) => {
  const token = await getAuthToken(); // Get the authentication token
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);

  const response = await fetch(`${URL}/books`, {
    method: "POST",
    headers,
    body: payload,
    redirect: "follow"
  });

  const json = await response.json();
  console.log("📦 addBook response:", json); // <-- debug log
  return json;
};

// ✅ Fetch single book with Firebase Bearer token
export const getSingleBook = async (id) => {
  const token = await getAuthToken();
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);

  const response = await fetch(`${URL}/books/${id}`, {
    method: "GET",
    headers,
    redirect: "follow"
  });

  return await response.json();
};

// ✅ Fetch all books with filters
export const getAllBooks = async (payload = { page: 1, limit: 1000 }) => {
  const query = new URLSearchParams();

  if (payload.page) query.append("page", payload.page);
  if (payload.limit) query.append("limit", payload.limit);
  if (payload.keyword) query.append("keyword", payload.keyword);
  if (payload.status) query.append("status", payload.status);
  if (payload.sort) query.append("sort", payload.sort);

  const response = await fetch(`${URL}/books?${query.toString()}`, {
    method: "GET",
    redirect: "follow"
  });

  return await response.json();
};

// ✅ Edit book (including status change)
export const editBook = async (payload, id) => {
  const token = await getAuthToken();

  if (!token) {
    return { status: false, code: 401, message: "Session expired" };
  }

  try {
    const response = await fetch(`${URL}/books/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    });

    const json = await response.json();
    return json;
  } catch (err) {
    console.error("❌ editBook error:", err);
    return { status: false, message: err.message };
  }
};

