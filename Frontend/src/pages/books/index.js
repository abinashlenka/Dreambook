// // // import Button from "@/components/Button";
// // // import Layout from "@/layout/Layout";
// // // import Card from "@/modules/books/Card";
// // // import FilterBar from "@/modules/FilterBar";
// // // import Loader from "@/modules/Loader";
// // // import Pagination from "@/modules/Pagination";
// // // import { getAllBooks } from "@/services/APIs/books";
// // // import { debounce } from "@/Utilities/helpers";
// // // import { useRouter } from "next/router";
// // // import { useCallback, useEffect, useState } from "react";

// // // export default function Index({ role }) {
// // //   const [allData, setAllData] = useState([]);
// // //   const [visibleData, setVisibleData] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [paginationData, setPaginationData] = useState(null);
// // //   const router = useRouter();

// // //   const [filters, setFilters] = useState({
// // //     keyword: "",
// // //     status: "",
// // //     sort: "",
// // //     page: 1,
// // //     limit: 12,
// // //   });

// // //   const filterHandler = useCallback((keyword, status, page, limit, sort) => {
// // //     const newFilters = {
// // //       keyword: keyword ?? "",
// // //       status: status ?? "",
// // //       sort: sort ?? "",
// // //       page: page ?? 1,
// // //       limit: limit ?? 12,
// // //     };
// // //     setFilters(newFilters);
// // //     applyFilters(newFilters);
// // //   }, [allData]);

// // //   const debouncedFilterHandler = useCallback(
// // //     debounce((keyword, status, page, limit, sort) => {
// // //       filterHandler(keyword, status, page, limit, sort);
// // //     }, 400),
// // //     [filterHandler]
// // //   );

// // //   const applyFilters = (payload) => {
// // //     let filtered = [...allData];

// // //     if (payload.keyword) {
// // //       const keyword = payload.keyword.toLowerCase();
// // //       filtered = filtered.filter(book =>
// // //         book.title?.toLowerCase().includes(keyword) ||
// // //         book.author?.name?.toLowerCase().includes(keyword)
// // //       );
// // //     }

// // //     if (payload.status) {
// // //       filtered = filtered.filter(book => book.status === payload.status);
// // //     }

// // //     if (payload.sort === "newToOld") {
// // //       filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
// // //     } else if (payload.sort === "oldToNew") {
// // //       filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
// // //     }

// // //     const start = (payload.page - 1) * payload.limit;
// // //     const end = start + payload.limit;
// // //     const paginated = filtered.slice(start, end);

// // //     setVisibleData(paginated);
// // //     setPaginationData({
// // //       page: payload.page,
// // //       limit: payload.limit,
// // //       totalPages: Math.ceil(filtered.length / payload.limit),
// // //       totalResults: filtered.length,
// // //     });
// // //   };

// // //   const fetchData = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const response = await getAllBooks({}); // fetch all at once
// // //       if (response?.status) {
// // //         const books = response.data;
// // //         setAllData(books);
// // //         applyFilters(filters);
// // //       }
// // //     } catch (e) {
// // //       console.error("❌ Error fetching books:", e);
// // //       setAllData([]);
// // //       setVisibleData([]);
// // //     }
// // //     setLoading(false);
// // //   };

// // //   useEffect(() => {
// // //     fetchData();
// // //   }, []);

// // //   return (
// // //     <Layout role={role}>
// // //       <div className="w-full flex justify-between items-center">
// // //         <h1 className="text-2xl font-bold">Books</h1>
// // //         <Button variant="primary" onClick={() => router.push("/books/create")}>
// // //           + Create Book
// // //         </Button>
// // //       </div>

// // //       <div className="w-full mt-5 bg-white rounded-md p-4">
// // //         <FilterBar
// // //           data={allData}
// // //           sort={true}
// // //           handler={filterHandler}
// // //           debouncedHandler={debouncedFilterHandler}
// // //           currentFilters={filters}
// // //         />

// // //         {loading ? (
// // //           <Loader />
// // //         ) : visibleData.length > 0 ? (
// // //           <div className="grid grid-cols-3 gap-4 py-4">
// // //             {visibleData.map((book, index) => (
// // //               <Card
// // //                 key={book.id || book._id || index}
// // //                 data={book}
// // //                 variant={book.status}
// // //               />
// // //             ))}
// // //           </div>
// // //         ) : (
// // //           <div className="text-center py-10">
// // //             <img
// // //               src="/images/no-data.png"
// // //               alt="No books found"
// // //               className="mx-auto mb-3 w-32 h-32 object-contain"
// // //             />
// // //             <h3 className="text-gray-600 text-lg">No books found.</h3>
// // //           </div>
// // //         )}

// // //         {!loading && paginationData && (
// // //           <Pagination
// // //             filters={filters}
// // //             data={paginationData}
// // //             handler={filterHandler}
// // //           />
// // //         )}
// // //       </div>
// // //     </Layout>
// // //   );
// // // }

// // // export async function getServerSideProps({ req }) {
// // //   const role = req.cookies._r || null;
// // //   return {
// // //     props: { role },
// // //   };
// // // }
// // import Button from "@/components/Button";
// // import Layout from "@/layout/Layout";
// // import Card from "@/modules/books/Card";
// // import FilterBar from "@/modules/FilterBar";
// // import Loader from "@/modules/Loader";
// // import Pagination from "@/modules/Pagination";
// // import { getAllBooks } from "@/services/APIs/books";
// // import { debounce } from "@/Utilities/helpers";
// // import { useRouter } from "next/router";
// // import { useCallback, useEffect, useState } from "react";

// // export default function Index({ role }) {
// //   const [data, setData] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const router = useRouter();

// //   const [filters, setFilters] = useState({
// //     keyword: "",
// //     status: "",
// //     sort: "",
// //     page: 1,
// //     limit: 100, // ✅ Increased limit
// //   });

// //   const [paginationData, setPaginationData] = useState(null);

// //   const filterHandler = useCallback((keyword, status, page, limit, sort) => {
// //     const newFilters = {
// //       keyword: keyword ?? "",
// //       status: status ?? "",
// //       sort: sort ?? "",
// //       page: page ?? 1,
// //       limit: limit ?? 100, // ✅ keep limit in sync
// //     };
// //     setFilters(newFilters);
// //     fetchData(newFilters);
// //   }, []);

// //   const debouncedFilterHandler = useCallback(
// //     debounce((keyword, status, page, limit, sort) => {
// //       filterHandler(keyword, status, page, limit, sort);
// //     }, 400),
// //     [filterHandler]
// //   );

// //   const fetchData = async (queryFilters = filters) => {
// //     setLoading(true);

// //     const payload = {
// //       page: queryFilters.page,
// //       limit: queryFilters.limit || 100, // ✅ Fallback limit
// //     };

// //     if (queryFilters.keyword) payload.keyword = queryFilters.keyword;
// //     if (queryFilters.status) {
// //       // ✅ Handle status label mapping
// //       if (queryFilters.status === "1") payload.status = "approved";
// //       else if (queryFilters.status === "0") payload.status = "pending";
// //       else if (queryFilters.status === "2") payload.status = "rejected";
// //     }

// //     if (queryFilters.sort) {
// //       switch (queryFilters.sort) {
// //         case "1":
// //           payload.sort = "oldToNew";
// //           break;
// //         case "2":
// //           payload.sort = "newToOld";
// //           break;
// //       }
// //     }

// //     console.log("🔍 Final payload sent to backend:", payload);
// //     const response = await getAllBooks(payload);

// //     // ✅ TEMP Manual filtering for frontend control
// //     if (response?.status) {
// //       let filtered = response.data;

// //       if (payload.keyword) {
// //         const keyword = payload.keyword.toLowerCase();
// //         filtered = filtered.filter(
// //           (book) =>
// //             book.title?.toLowerCase().includes(keyword) ||
// //             book.author?.name?.toLowerCase().includes(keyword)
// //         );
// //       }

// //       if (payload.status) {
// //         filtered = filtered.filter((book) => book.status === payload.status);
// //       }

// //       if (payload.sort === "newToOld") {
// //         filtered = filtered.sort(
// //           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
// //         );
// //       } else if (payload.sort === "oldToNew") {
// //         filtered = filtered.sort(
// //           (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
// //         );
// //       }

// //       setData(filtered);
// //       setPaginationData({
// //         page: payload.page,
// //         limit: payload.limit,
// //         totalPages: 1,
// //         totalResults: filtered.length,
// //       });
// //     } else {
// //       setData([]);
// //       setPaginationData({
// //         page: 1,
// //         limit: payload.limit,
// //         totalPages: 0,
// //         totalResults: 0,
// //       });
// //     }

// //     setLoading(false);
// //   };

// //   useEffect(() => {
// //     fetchData();
// //   }, []);

// //   return (
// //     <Layout role={role}>
// //       <div className="w-full flex justify-between items-center">
// //         <h1 className="text-2xl font-bold">Books</h1>
// //         <Button variant="primary" onClick={() => router.push("/books/create")}>
// //           + Create Book
// //         </Button>
// //       </div>

// //       <div className="w-full mt-5 bg-white rounded-md p-4">
// //         <FilterBar
// //           data={data}
// //           sort={true}
// //           handler={filterHandler}
// //           debouncedHandler={debouncedFilterHandler}
// //           currentFilters={filters}
// //         />

// //         {loading ? (
// //           <Loader />
// //         ) : data.length > 0 ? (
// //           <div className="grid grid-cols-3 gap-4 py-4">
// //             {data.map((book, index) => (
// //               <Card
// //                 key={book.id || book._id || index}
// //                 data={book}
// //                 variant={book.status}
// //               />
// //             ))}
// //           </div>
// //         ) : (
// //           <div className="text-center py-10">
// //             <img
// //               src="/images/no-data.png"
// //               alt="No books found"
// //               className="mx-auto mb-3 w-32 h-32 object-contain"
// //             />
// //             <h3 className="text-gray-600 text-lg">No books found.</h3>
// //           </div>
// //         )}

// //         {!loading && paginationData && (
// //           <Pagination
// //             filters={filters}
// //             data={paginationData}
// //             handler={filterHandler}
// //           />
// //         )}
// //       </div>
// //     </Layout>
// //   );
// // }

// // export async function getServerSideProps({ req }) {
// //   const role = req.cookies._r || null;
// //   return {
// //     props: {
// //       role,
// //     },
// //   };
// // }
// // import Button from "@/components/Button";
// // import Layout from "@/layout/Layout";
// // import Card from "@/modules/books/Card";
// // import FilterBar from "@/modules/FilterBar";
// // import Loader from "@/modules/Loader";
// // import Pagination from "@/modules/Pagination";
// // import { getAllBooks } from "@/services/APIs/books";
// // import { debounce } from "@/Utilities/helpers";
// // import { useRouter } from "next/router";
// // import { useCallback, useEffect, useState } from "react";

// // export default function Index({ role }) {
// //   const [data, setData] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const router = useRouter();

// //   const [filters, setFilters] = useState({
// //     keyword: "",
// //     status: "",
// //     sort: "",
// //     page: 1,
// //     limit: 10,
// //   });

// //   const [paginationData, setPaginationData] = useState(null);

// //   const filterHandler = useCallback((keyword, status, page, limit, sort) => {
// //     const newFilters = {
// //       keyword: keyword ?? "",
// //       status: status ?? "",
// //       sort: sort ?? "",
// //       page: page ?? 1,
// //       limit: limit ?? 10,
// //     };
// //     setFilters(newFilters);
// //     fetchData(newFilters);
// //   }, []);

// //   const debouncedFilterHandler = useCallback(
// //     debounce((keyword, status, page, limit, sort) => {
// //       filterHandler(keyword, status, page, limit, sort);
// //     }, 400),
// //     [filterHandler]
// //   );

// //   const fetchData = async (queryFilters = filters) => {
// //     setLoading(true);

// //     const payload = {
// //       page: queryFilters.page,
// //       limit: queryFilters.limit,
// //     };

// //     if (queryFilters.keyword) payload.keyword = queryFilters.keyword;
// //     if (queryFilters.status) payload.status = queryFilters.status;

// //     if (queryFilters.sort) {
// //       switch (queryFilters.sort) {
// //         case "1":
// //           payload.sort = "oldToNew";
// //           break;
// //         case "2":
// //           payload.sort = "newToOld";
// //           break;
// //       }
// //     }

// //     console.log("📦 Final payload sent to backend:", payload);

// //     const response = await getAllBooks();

// //     if (response?.status) {
// //       let filtered = response.data;

// //       // Search filter
// //       if (payload.keyword) {
// //         const keyword = payload.keyword.toLowerCase();
// //         filtered = filtered.filter(book =>
// //           book.title?.toLowerCase().includes(keyword) ||
// //           book.author?.name?.toLowerCase().includes(keyword)
// //         );
// //       }

// //       // Status mapping
// //       const statusMap = {
// //         "1": "approved",
// //         "0": "pending",
// //         "2": "rejected",
// //       };

// //       if (payload.status && statusMap[payload.status]) {
// //         filtered = filtered.filter(book => book.status === statusMap[payload.status]);
// //       }

// //       // Sorting
// //       if (payload.sort === "newToOld") {
// //         filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
// //       } else if (payload.sort === "oldToNew") {
// //         filtered = filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
// //       }

// //       // Pagination slicing
// //       const startIndex = (payload.page - 1) * payload.limit;
// //       const paginated = filtered.slice(startIndex, startIndex + payload.limit);

// //       setData(paginated);
// //       setPaginationData({
// //         page: payload.page,
// //         limit: payload.limit,
// //         totalPages: Math.ceil(filtered.length / payload.limit),
// //         totalResults: filtered.length,
// //       });
// //     } else {
// //       setData([]);
// //       setPaginationData({
// //         page: 1,
// //         limit: payload.limit,
// //         totalPages: 0,
// //         totalResults: 0,
// //       });
// //     }

// //     setLoading(false);
// //   };

// //   useEffect(() => {
// //     fetchData();
// //   }, []);

// //   return (
// //     <Layout role={role}>
// //       <div className="w-full flex justify-between items-center">
// //         <h1 className="text-2xl font-bold">Books</h1>
// //         <Button variant="primary" onClick={() => router.push("/books/create")}>
// //           + Create Book
// //         </Button>
// //       </div>

// //       <div className="w-full mt-5 bg-white rounded-md p-4">
// //         <FilterBar
// //           data={data}
// //           sort={true}
// //           handler={filterHandler}
// //           debouncedHandler={debouncedFilterHandler}
// //           currentFilters={filters}
// //         />

// //         {loading ? (
// //           <Loader />
// //         ) : data.length > 0 ? (
// //           <div className="grid grid-cols-3 gap-4 py-4">
// //             {data.map((book, index) => (
// //               <Card
// //                 key={book.id || book._id || index}
// //                 data={book}
// //                 variant={book.status}
// //               />
// //             ))}
// //           </div>
// //         ) : (
// //           <div className="text-center py-10">
// //             <img
// //               src="/images/no-data.png"
// //               alt="No books found"
// //               className="mx-auto mb-3 w-32 h-32 object-contain"
// //             />
// //             <h3 className="text-gray-600 text-lg">No books found.</h3>
// //           </div>
// //         )}

// //         {!loading && paginationData && (
// //           <Pagination
// //             filters={filters}
// //             data={paginationData}
// //             handler={filterHandler}
// //           />
// //         )}
// //       </div>
// //     </Layout>
// //   );
// // }

// // export async function getServerSideProps({ req }) {
// //   const role = req.cookies._r || null;
// //   return {
// //     props: {
// //       role,
// //     },
// //   };
// // }
// // ------- default working code --------------
// // import Button from "@/components/Button";
// // import Layout from "@/layout/Layout";
// // import Card from "@/modules/books/Card";
// // import FilterBar from "@/modules/FilterBar";
// // import Loader from "@/modules/Loader";
// // import Pagination from "@/modules/Pagination";
// // import { getAllBooks } from "@/services/APIs/books";
// // import { debounce } from "@/Utilities/helpers";
// // import { useRouter } from "next/router";
// // import { useCallback, useEffect, useState } from "react";

// // export default function Index({ role }) {
// //   const [data, setData] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const router = useRouter();

// //   const [filters, setFilters] = useState({
// //     keyword: "",
// //     status: "",
// //     sort: "",
// //     page: 1,
// //     limit: 10,
// //   });

// //   const [paginationData, setPaginationData] = useState(null);

// //   const filterHandler = useCallback((keyword, status, page, limit, sort) => {
// //     const newFilters = {
// //       keyword: keyword ?? "",
// //       status: status ?? "",
// //       sort: sort ?? "",
// //       page: page ?? 1,
// //       limit: limit ?? 10,
// //     };
// //     setFilters(newFilters);
// //     fetchData(newFilters);
// //   }, []);

// //   const debouncedFilterHandler = useCallback(
// //     debounce((keyword, status, page, limit, sort) => {
// //       filterHandler(keyword, status, page, limit, sort);
// //     }, 400),
// //     [filterHandler]
// //   );

// //   const fetchData = async (queryFilters = filters) => {
// //     setLoading(true);

// //     const payload = {
// //       page: queryFilters.page,
// //       limit: queryFilters.limit,
// //     };

// //     if (queryFilters.keyword) payload.keyword = queryFilters.keyword;

// //     // Map status values from filter
// //     const statusMap = {
// //       "1": "approved",
// //       "0": "pending",
// //       "2": "rejected",
// //     };
// //     if (queryFilters.status && statusMap[queryFilters.status]) {
// //       payload.status = statusMap[queryFilters.status];
// //     }

// //     if (queryFilters.sort) {
// //       switch (queryFilters.sort) {
// //         case "1":
// //           payload.sort = "oldToNew";
// //           break;
// //         case "2":
// //           payload.sort = "newToOld";
// //           break;
// //       }
// //     }

// //     const response = await getAllBooks();

// //     if (response?.status) {
// //       let filtered = response.data;

// //       // Apply filters manually (search, status, sort)
// //       if (payload.keyword) {
// //         const keyword = payload.keyword.toLowerCase();
// //         filtered = filtered.filter(
// //           (book) =>
// //             book.title?.toLowerCase().includes(keyword) ||
// //             book.author?.name?.toLowerCase().includes(keyword)
// //         );
// //       }

// //       if (payload.status) {
// //         filtered = filtered.filter((book) => book.status === payload.status);
// //       }

// //       if (payload.sort === "newToOld") {
// //         filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
// //       } else if (payload.sort === "oldToNew") {
// //         filtered = filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
// //       }

// //       // Pagination
// //       const startIndex = (payload.page - 1) * payload.limit;
// //       const paginated = filtered.slice(startIndex, startIndex + payload.limit);

// //       setData(paginated);
// //       setPaginationData({
// //         page: payload.page,
// //         limit: payload.limit,
// //         totalPages: Math.ceil(filtered.length / payload.limit),
// //         totalResults: filtered.length,
// //       });
// //     } else {
// //       setData([]);
// //       setPaginationData({
// //         page: 1,
// //         limit: payload.limit,
// //         totalPages: 0,
// //         totalResults: 0,
// //       });
// //     }

// //     setLoading(false);
// //   };

// //   useEffect(() => {
// //     fetchData();
// //   }, []);

// //   return (
// //     <Layout role={role}>
// //       <div className="w-full flex justify-between items-center">
// //         <h1 className="text-2xl font-bold">Books</h1>
// //         <Button variant="primary" onClick={() => router.push("/books/create")}>
// //           + Create Book
// //         </Button>
// //       </div>

// //       <div className="w-full mt-5 bg-white rounded-md p-4">
// //         <FilterBar
// //           data={data}
// //           sort={true}
// //           handler={filterHandler}
// //           debouncedHandler={debouncedFilterHandler}
// //           currentFilters={filters}
// //           statusOptions={[
// //             { label: "All", value: "" },
// //             { label: "Approved", value: "1" },
// //             { label: "Pending", value: "0" },
// //             { label: "Rejected", value: "2" },
// //           ]}
// //         />

// //         {loading ? (
// //           <Loader />
// //         ) : data.length > 0 ? (
// //           <div className="grid grid-cols-3 gap-4 py-4">
// //             {data.map((book, index) => (
// //               <Card
// //                 key={book._id || book.id || index}
// //                 data={book}
// //                 variant={book.status}
// //               />
// //             ))}
// //           </div>
// //         ) : (
// //           <div className="text-center py-10">
// //             <img
// //               src="/images/no-data.png"
// //               alt="No books found"
// //               className="mx-auto mb-3 w-32 h-32 object-contain"
// //             />
// //             <h3 className="text-gray-600 text-lg">No books found.</h3>
// //           </div>
// //         )}

// //         {!loading && paginationData && (
// //           <Pagination
// //             filters={filters}
// //             data={paginationData}
// //             handler={filterHandler}
// //           />
// //         )}
// //       </div>
// //     </Layout>
// //   );
// // }

// // export async function getServerSideProps({ req }) {
// //   const role = req.cookies._r || null;
// //   return {
// //     props: {
// //       role,
// //     },
// //   };
// // }
// import Button from "@/components/Button";
// import Layout from "@/layout/Layout";
// import Card from "@/modules/books/Card";
// import FilterBar from "@/modules/FilterBar";
// import Loader from "@/modules/Loader";
// import Pagination from "@/modules/Pagination";
// import { getAllBooks } from "@/services/APIs/books";
// import { debounce } from "@/Utilities/helpers";
// import { useRouter } from "next/router";
// import { useCallback, useEffect, useState } from "react";

// export default function Index({ role }) {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const [filters, setFilters] = useState({
//     keyword: "",
//     status: "",
//     sort: "",
//     page: 1,
//     limit: 10,
//   });

//   const [paginationData, setPaginationData] = useState(null);

//   const filterHandler = useCallback((keyword, status, page, limit, sort) => {
//     const newFilters = {
//       keyword: keyword ?? "",
//       status: status ?? "",
//       sort: sort ?? "",
//       page: page ?? 1,
//       limit: limit ?? 10,
//     };
//     setFilters(newFilters);
//     fetchData(newFilters);
//   }, []);

//   const debouncedFilterHandler = useCallback(
//     debounce((keyword, status, page, limit, sort) => {
//       filterHandler(keyword, status, page, limit, sort);
//     }, 400),
//     [filterHandler]
//   );

//   const fetchData = async (queryFilters = filters) => {
//     setLoading(true);

//     const payload = {
//       page: queryFilters.page,
//       limit: queryFilters.limit,
//     };

//     // const statusMap = {
//     //   "1": "approved",
//     //   "0": "pending",
//     //   "2": "rejected",
//     // };
//     const statusMap = {
//       "1": "approved",
//       "0": "pending",
//       "2": "rejected",
//       approved: "approved",
//       pending: "pending",
//       rejected: "rejected",
//     };
    
//     if (payload.status && statusMap[payload.status]) {
//       filtered = filtered.filter(book => book.status === statusMap[payload.status]);
//     }
//     if (queryFilters.keyword) payload.keyword = queryFilters.keyword;
//     if (queryFilters.sort === "1") payload.sort = "oldToNew";
//     if (queryFilters.sort === "2") payload.sort = "newToOld";

//     const response = await getAllBooks();

//     if (response?.status) {
//       let filtered = response.data;

//       // 🔍 Search filter
//       if (payload.keyword) {
//         const keyword = payload.keyword.toLowerCase();
//         filtered = filtered.filter(
//           (book) =>
//             book.title?.toLowerCase().includes(keyword) ||
//             book.author?.name?.toLowerCase().includes(keyword)
//         );
//       }

//       // 🟠 Normalize status: if missing, assume pending
//       if (queryFilters.status && statusMap[queryFilters.status]) {
//         filtered = filtered.filter((book) => {
//           const bookStatus = book.status || "pending";
//           return bookStatus === statusMap[queryFilters.status];
//         });
//       }

//       // 📅 Sort
//       if (payload.sort === "newToOld") {
//         filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//       } else if (payload.sort === "oldToNew") {
//         filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//       }

//       // 🔢 Pagination
//       const startIndex = (payload.page - 1) * payload.limit;
//       const paginated = filtered.slice(startIndex, startIndex + payload.limit);

//       setData(paginated);
//       setPaginationData({
//         page: payload.page,
//         limit: payload.limit,
//         totalPages: Math.ceil(filtered.length / payload.limit),
//         totalResults: filtered.length,
//       });
//     } else {
//       setData([]);
//       setPaginationData({
//         page: 1,
//         limit: payload.limit,
//         totalPages: 0,
//         totalResults: 0,
//       });
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <Layout role={role}>
//       <div className="w-full flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Books</h1>
//         <Button variant="primary" onClick={() => router.push("/books/create")}>
//           + Create Book
//         </Button>
//       </div>

//       <div className="w-full mt-5 bg-white rounded-md p-4">
//         <FilterBar
//           data={data}
//           sort={true}
//           handler={filterHandler}
//           debouncedHandler={debouncedFilterHandler}
//           currentFilters={filters}
//         />

//         {loading ? (
//           <Loader />
//         ) : data.length > 0 ? (
//           <div className="grid grid-cols-3 gap-4 py-4">
//             {data.map((book, index) => (
//               <Card
//                 key={book.id || book._id || index}
//                 data={book}
//                 variant={book.status || "pending"} // fallback
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-10">
//             <img
//               src="/images/no-data.png"
//               alt="No books found"
//               className="mx-auto mb-3 w-32 h-32 object-contain"
//             />
//             <h3 className="text-gray-600 text-lg">No books found.</h3>
//           </div>
//         )}

//         {!loading && paginationData && (
//           <Pagination
//             filters={filters}
//             data={paginationData}
//             handler={filterHandler}
//           />
//         )}
//       </div>
//     </Layout>
//   );
// }

// export async function getServerSideProps({ req }) {
//   const role = req.cookies._r || null;
//   return {
//     props: {
//       role,
//     },
//   };
// }
import Button from "@/components/Button";
import Layout from "@/layout/Layout";
import Card from "@/modules/books/Card";
import FilterBar from "@/modules/FilterBar";
import Loader from "@/modules/Loader";
import Pagination from "@/modules/Pagination";
import { getAllBooks } from "@/services/APIs/books";
import { debounce } from "@/Utilities/helpers";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function Index({ role }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationData, setPaginationData] = useState(null);
  const router = useRouter();

  const [filters, setFilters] = useState({
    keyword: "",
    status: "",
    sort: "",
    page: 1,
    limit: 10,
  });

  const filterHandler = useCallback((keyword, status, page, limit, sort) => {
    const newFilters = {
      keyword: keyword ?? "",
      status: status ?? "",
      sort: sort ?? "",
      page: page ?? 1,
      limit: limit ?? 10,
    };
    setFilters(newFilters);
    fetchData(newFilters);
  }, []);

  const debouncedFilterHandler = useCallback(
    debounce((keyword, status, page, limit, sort) => {
      filterHandler(keyword, status, page, limit, sort);
    }, 400),
    [filterHandler]
  );

  const fetchData = async (queryFilters = filters) => {
    setLoading(true);

    const response = await getAllBooks();
    if (response?.status) {
      let books = response.data;

      // ✅ Normalize undefined status to "pending"
      books = books.map((book) => ({
        ...book,
        status: book.status || "pending",
      }));

      // ✅ Filter by keyword
      if (queryFilters.keyword) {
        const keyword = queryFilters.keyword.toLowerCase();
        books = books.filter(
          (book) =>
            book.title?.toLowerCase().includes(keyword) ||
            book.author?.name?.toLowerCase().includes(keyword)
        );
      }

      // ✅ Filter by status
      if (queryFilters.status) {
        books = books.filter((book) => book.status === queryFilters.status);
      }

      // ✅ Sort
      if (queryFilters.sort === "1") {
        books = books.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (queryFilters.sort === "2") {
        books = books.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      // ✅ Pagination
      const start = (queryFilters.page - 1) * queryFilters.limit;
      const paginated = books.slice(start, start + queryFilters.limit);

      setData(paginated);
      setPaginationData({
        page: queryFilters.page,
        limit: queryFilters.limit,
        totalPages: Math.ceil(books.length / queryFilters.limit),
        totalResults: books.length,
      });
    } else {
      setData([]);
      setPaginationData({
        page: 1,
        limit: filters.limit,
        totalPages: 0,
        totalResults: 0,
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout role={role}>
      <div className="w-full flex justify-between items-center flex-wrap md:flex-nowrap">
        <h1 className="text-2xl font-bold mb-2 md:mb-0">Books</h1>
        <Button
          variant="primary"
          className="md:w-auto w-full"
          onClick={() => router.push("/books/create")}
        >
          + Create Book
        </Button>
      </div>

      <div className="w-full mt-5 bg-white rounded-md p-4">
        <FilterBar
          data={data}
          sort={true}
          handler={filterHandler}
          debouncedHandler={debouncedFilterHandler}
          currentFilters={filters}
        />

        {loading ? (
          <Loader />
        ) : data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
            {data.map((book, index) => (
              <Card
                key={book._id || book.id || index}
                data={book}
                variant={book.status}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <img
              src="/images/no-data.png"
              alt="No books found"
              className="mx-auto mb-3 w-32 h-32 object-contain"
            />
            <h3 className="text-gray-600 text-lg">No books found.</h3>
          </div>
        )}

        {!loading && paginationData && (
          <Pagination
            filters={filters}
            data={paginationData}
            handler={filterHandler}
          />
        )}
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