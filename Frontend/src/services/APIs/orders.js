// import axios from "axios";

// const API_BASE_URL = "https://dream-book-backend-main.vercel.app/api";

// export const getAllOrders = async ({ bookId }) => {
//     try {
//       const res = await axios.get(`https://dream-book-backend-main.vercel.app/api/orders?bookId=${bookId}`);
//       return { status: true, data: res.data.results || [] }; // <-- ensure it's an array
//     } catch (error) {
//       console.error("❌ Error fetching orders:", error);
//       return { status: false, error };
//     }
//   };
// src/services/APIs/orders.js

import axios from "axios";

const API_BASE_URL = "https://dream-book-backend-main.vercel.app/api";

export const getAllOrders = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/orders${query ? `?${query}` : ""}`;

    const res = await axios.get(url);
    
    // Handle both array or wrapped response
    const orders = Array.isArray(res.data)
      ? res.data
      : res.data?.data || [];

    return { status: true, data: orders };
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return { status: false, error };
  }
};