import Layout from "@/layout/Layout";
import Table from "@/modules/Table";
import { getAllBooks } from "@/services/APIs/books";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Index({ role }) {
  const [dashboardData, setDashboardData] = useState({
    totalBooks: 0,
    totalAuthors: 0,
    totalSales: 0,
    totalRoyalty: 0,
    platformEarnings: 0,
  });

  const [platformStats, setPlatformStats] = useState([]);
  const [bookStats, setBookStats] = useState([]);
  const [topAuthors, setTopAuthors] = useState([]);
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const [bookPage, setBookPage] = useState(1);
  const booksPerPage = 10;

  const fetchDashboardData = async () => {
    const bookRes = await getAllBooks({ page: 1, limit: 1000 });
    const books = Array.isArray(bookRes?.data) ? bookRes.data : [];

    const authorsSet = new Set();
    books.forEach((book) => book.author?._id && authorsSet.add(book.author._id));

    setDashboardData({
      totalBooks: books.length,
      totalAuthors: authorsSet.size,
      totalSales: books.length * 10,
      totalRoyalty: books.length * 50,
      platformEarnings: books.length * 60,
    });
  };

  const fetchSalesData = async () => {
    try {
      const res = await axios.get("https://dream-book-backend-main.vercel.app/api/orders");
      const orders = res.data?.data || [];

      const selectedDate = new Date(selectedMonth + "-01");
      const selectedYear = selectedDate.getFullYear();
      const selectedMonthIndex = selectedDate.getMonth();

      const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getFullYear() === selectedYear &&
          orderDate.getMonth() === selectedMonthIndex
        );
      });

      const platformMap = {};
      const bookMap = {};
      const authorMap = {};
      let totalSales = 0;

      filteredOrders.forEach((order) => {
        const platform = order.source || "Unknown";
        const total = parseFloat(order.total || 0);
        platformMap[platform] = platformMap[platform] || { total: 0, count: 0 };
        platformMap[platform].total += total;
        platformMap[platform].count += 1;
        totalSales += total;

        order.line_items?.forEach((item) => {
          const title = item.name || "Untitled Book";
          const author = item.author || "Unknown Author";
          const qty = item.quantity || 1;
          const price = parseFloat(item.price || 0);

          bookMap[title] = bookMap[title] || { quantity: 0, earnings: 0 };
          bookMap[title].quantity += qty;
          bookMap[title].earnings += price * qty;



          authorMap[author] = authorMap[author] || { sales: 0, earnings: 0 };
  authorMap[author].sales += qty;
  authorMap[author].earnings += price * qty;
        });
      });

      setPlatformStats(Object.entries(platformMap).map(([p, val]) => ({
        platform: p,
        quantity: val.count,
        total: `₹${val.total.toFixed(2)}`
      })));

      const sortedBooks = Object.entries(bookMap)
        .map(([title, val]) => ({
          title,
          quantity: val.quantity,
          total: val.earnings,
        }))
        .sort((a, b) => b.total - a.total);

      setBookStats(sortedBooks);

      setTopAuthors(Object.entries(authorMap).map(([name, val]) => {
        const returned = 2;
        const returnRoyalty = val.earnings * 0.1;
        const toPay = val.earnings - returnRoyalty;
        return {
          name,
          sales: val.sales,
          earnings: val.earnings,
          returned,
          returnRoyalty,
          toPay,
        };
      }));

      setTotalSalesAmount(totalSales);
    } catch (err) {
      console.error("Failed to fetch order data", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchSalesData();
  }, [selectedMonth]);

  const paginatedBooks = bookStats.slice(
    (bookPage - 1) * booksPerPage,
    bookPage * booksPerPage
  );
  const totalBookPages = Math.ceil(bookStats.length / booksPerPage);

  const cards = [
    {
      title: "Platform Earnings",
      value: `₹${dashboardData.platformEarnings}`,
      bgColor: "#E9FFE0",
    },
    {
      title: "Total Royalty",
      value: `₹${dashboardData.totalRoyalty}`,
      bgColor: "#FFE9E0",
    },
    {
      title: "Total Books",
      value: dashboardData.totalBooks,
      bgColor: "#FFEAFB",
    },
    {
      title: "Total Sale",
      value: dashboardData.totalSales,
      bgColor: "#E6E9FF",
    },
    {
      title: "Total Authors",
      value: dashboardData.totalAuthors,
      bgColor: "#FFF6E4",
    }
  ];

  const iconMap = {
    "Platform Earnings": "Totalplatform.png",
    "Total Royalty": "Totalroyalty.png",
    "Total Books": "Totalbooks.png",
    "Total Sale": "Totalsale.png",
    "Total Authors": "Totalauthors.png"
  };

  return (
    <Layout role={role}>
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-black-4">Dashboard</h1>
      </div>

      {/* ✅ Dashboard Top Cards with Custom Icons */}
      <div className="w-full grid grid-cols-5 gap-4">
        {cards.map((card, index) => (
          <div key={index} className="p-4 rounded-[10px]" style={{ backgroundColor: card.bgColor }}>
            <div className="flex gap-2 items-center">
              <img src={`/images/${iconMap[card.title]}`} alt={card.title} className="w-6 h-6" />
              <span className="font-semibold text-black">{card.title}</span>
            </div>
            <div className="mt-4 text-2xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>

      {/* ✅ Platform-wise Sales Report with Monthly Filter */}
      <div className="w-full bg-white rounded-lg p-4 mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Sales Report</h2>
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {Array.from({ length: 12 }, (_, i) => {
              const date = new Date();
              date.setMonth(date.getMonth() - i);
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const label = date.toLocaleString("default", { month: "long", year: "numeric" });
              return (
                <option key={`${year}-${month}`} value={`${year}-${month}`}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>

        <div className="mb-4 text-sm font-medium text-gray-700">
          Total Sales: <span className="font-bold">₹{totalSalesAmount.toFixed(2)}</span>
        </div>

        <Table>
          <thead>
            <tr className="border-b-1.5">
              <th className="text-left">Platform</th>
              <th className="text-center">Orders</th>
              <th className="text-center">Earnings</th>
            </tr>
          </thead>
          <tbody>
            {platformStats.map((item, i) => {
              const platformKey = item.platform?.toLowerCase();
              const isWoo = platformKey.includes("woo");
              const platformName = isWoo ? "Dreambook" : item.platform;
              const imageName = isWoo ? "dreambooks" : platformKey;

              return (
                <tr key={i} className="border-b-1.5">
                  <td className="text-left flex items-center gap-2">
                    <img src={`/images/${imageName}.png`} alt={platformName} className="size-6" />
                    {platformName}
                  </td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-center">{item.total}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {/* ✅ Book Wise Report - Sorted & Paginated */}
      <div className="w-full bg-white rounded-lg p-4 mt-6">
        <h2 className="text-base font-semibold mb-3">Book-wise Sales</h2>
        <Table>
          <thead>
            <tr className="border-b-1.5">
              <th className="text-left">Title</th>
              <th className="text-center">Quantity</th>
              <th className="text-center">Total Earnings</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBooks.map((book, i) => (
              <tr key={i} className="border-b-1.5">
                <td>{book.title}</td>
                <td className="text-center">{book.quantity}</td>
                <td className="text-center">₹{book.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={() => setBookPage((p) => Math.max(p - 1, 1))}
            disabled={bookPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-2 py-1 text-sm">
            Page {bookPage} of {totalBookPages}
          </span>
          <button
            onClick={() => setBookPage((p) => Math.min(p + 1, totalBookPages))}
            disabled={bookPage === totalBookPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* ✅ Top Authors Table */}
      <div className="w-full bg-white rounded-lg p-4 mt-6">
        <h2 className="text-base font-semibold mb-3">Top Rated Authors</h2>
        <Table>
          <thead>
            <tr className="border-b-1.5">
              <th className="text-left">Author</th>
              <th className="text-center">Sales</th>
              <th className="text-center">Earnings</th>
              <th className="text-center">Returned</th>
              <th className="text-center">Return Royalty</th>
              <th className="text-center">To Pay</th>
            </tr>
          </thead>
          <tbody>
            {topAuthors.map((a, i) => (
              <tr key={i} className="border-b-1.5">
                <td>{a.name}</td>
                <td className="text-center">{a.sales}</td>
                <td className="text-center">₹{a.earnings.toFixed(2)}</td>
                <td className="text-center">{a.returned}</td>
                <td className="text-center text-orange">-₹{a.returnRoyalty.toFixed(2)}</td>
                <td className="text-center">₹{a.toPay.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const role = req.cookies._r || null;
  return {
    props: { role },
  };
}
