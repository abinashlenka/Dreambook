const URL = "https://dream-book-backend-main.vercel.app/api";

export const getAllCategories = async () => {
  try {
    const res = await fetch(`${URL}/categories`);
    const json = await res.json();
    return json;
  } catch (e) {
    console.error("❌ Failed to fetch categories", e);
    return { data: [] };
  }
};
