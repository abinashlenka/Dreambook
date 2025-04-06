// import Button from "@/components/Button";
// import Layout from "@/layout/Layout";
// import SmallCard from "@/modules/books/SmallCard";
// import FilterBar from "@/modules/FilterBar";
// import Loader from "@/modules/Loader";
// import Pagination from "@/modules/Pagination";
// import { getAllEmployees } from "@/services/APIs/employees";
// import { debounce } from "@/Utilities/helpers";
// import { useRouter } from "next/router";
// import { useCallback, useEffect, useState } from "react";
// export default function Index({ role }) {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const [filters, setFilters] = useState({
//     keyword: "",
//     status: "",
//     page: 1,
//     limit: 10,
//   });

//   const filterHandler = useCallback((keyword, status, page, limit, sort) => {
//     const newFilters = {
//       keyword: keyword ?? "",
//       status: status ?? "",
//       sort: sort ?? "",
//       limit: limit ?? 10,
//     };

//     setFilters(newFilters);
//     fetchData(newFilters);
//   }, []);

//   const debouncedFilterHandler = useCallback(
//     debounce((keyword, status, limit, sort) => {
//       filterHandler(keyword, status, limit, sort);
//     }, 400),
//     [filterHandler]
//   );

//   const fetchData = async (queryFilters = filters) => {
//     setLoading(true);
//     const payload = {
//       page: 1,
//       limit: 10,
//       role: "employee",
//     };
    
//     if (queryFilters.keyword) {
//       payload.search = queryFilters.keyword;
//     }

//     if (queryFilters.status) {
//       switch (queryFilters.status) {
//         case "1":
//           payload.status = "verified";
//           break;
//         case "0":
//           payload.status = "pending";
//           break;
//         case "2":
//           payload.status = "declined";
//           break;
//         default:
//           break;
//       }
//     }

//     if (queryFilters.sort) {
//       switch (queryFilters.sort) {
//         case "1":
//           payload.sort = "oldToNew";
//           break;
//         case "2":
//           payload.sort = "newToOld";
//           break;
//         default:
//           break;
//       }
//     }

//     const response = await getAllEmployees(payload);

//     if (response.status) {
//       setData(response.data.results);
//       setLoading(false);
//     } else {
//       setData([]);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <Layout role={role}>
//       <div className="w-full flex flex-wrap items-center justify-between">
//         <h1 className="text-black-4 text-3xl font-semibold">Employees</h1>
//         <Button
//           variant="primary"
//           className="w-fit items-center"
//           onClick={() => router.push("/employees/create")}
//         >
//           <svg
//             className="mr-2 mt-[1px]"
//             xmlns="http://www.w3.org/2000/svg"
//             width="14"
//             height="14"
//             viewBox="0 0 14 14"
//             fill="none"
//           >
//             <path
//               fillRule="evenodd"
//               clipRule="evenodd"
//               d="M2.625 7C2.625 6.75838 2.78823 6.5625 2.98958 6.5625H11.0104C11.2118 6.5625 11.375 6.75838 11.375 7C11.375 7.24162 11.2118 7.4375 11.0104 7.4375H2.98958C2.78823 7.4375 2.625 7.24162 2.625 7Z"
//               fill="#FDFCFF"
//             />
//             <path
//               fillRule="evenodd"
//               clipRule="evenodd"
//               d="M7 2.625C7.24162 2.625 7.4375 2.78823 7.4375 2.98958V11.0104C7.4375 11.2118 7.24162 11.375 7 11.375C6.75838 11.375 6.5625 11.2118 6.5625 11.0104V2.98958C6.5625 2.78823 6.75838 2.625 7 2.625Z"
//               fill="#FDFCFF"
//             />
//           </svg>
//           Add Employee
//         </Button>
//       </div>
//       <div className="w-full bg-[#FDFCFF] mt-5 rounded-md">
//         <FilterBar
//           debouncedHandler={debouncedFilterHandler}
//           data={data}
//           sort={true}
//           handler={filterHandler}
//           currentFilters={filters}
//         />
//         {loading && <Loader />}
//         <div className="w-full bg-[#FDFCFF] grid grid-cols-5 gap-4 px-5 py-3 mb-4">
//           {!loading &&
//             data &&
//             data.length > 0 &&
//             data.map((item, index) => (
//               <SmallCard
//                 key={`Employee-${index}`}
//                 url={`/employees/${item._id}`}
//                 variant={!item.isBlocked}
//                 name={item.name}
//                 description={item.email}
//               />
//             ))}
//         </div>
//         {/* {data && <Pagination filters={filters} data={data} handler={filterHandler} />} */}
//       </div>
//     </Layout>
//   );
// }

// export async function getServerSideProps({ req, res }) {
//   const role = req.cookies._r || null;
//   return {
//     props: {
//       role: role,
//     },
//   };
// }
import Button from "@/components/Button";
import Layout from "@/layout/Layout";
import SmallCard from "@/modules/books/SmallCard";
import FilterBar from "@/modules/FilterBar";
import Loader from "@/modules/Loader";
import Pagination from "@/modules/Pagination";
import { getAllEmployees } from "@/services/APIs/employees";
import { debounce } from "@/Utilities/helpers";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function Index({ role }) {
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationData, setPaginationData] = useState(null);

  const [filters, setFilters] = useState({
    keyword: "",
    status: "",
    sort: "",
    page: 1,
    limit: 10,
  });

  const router = useRouter();

  const fetchAllEmployees = async () => {
    setLoading(true);
    const response = await getAllEmployees({ role: "employee" });
    if (response.status) {
      setRawData(response.data.results);
      applyFilters(response.data.results, filters);
    } else {
      setRawData([]);
      setFilteredData([]);
    }
    setLoading(false);
  };

  const applyFilters = (data, query) => {
    let filtered = [...data];

    // 🔍 Search by name or email
    if (query.keyword) {
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(query.keyword.toLowerCase()) ||
          item.email?.toLowerCase().includes(query.keyword.toLowerCase())
      );
    }

    // 📌 Status filtering
    if (query.status === "1") {
      filtered = filtered.filter((item) => item.isBlocked === false); // Active
    } else if (query.status === "2") {
      filtered = filtered.filter((item) => item.isBlocked === true); // Suspended
    }

    // ↕️ Sort
    if (query.sort === "1") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // old to new
    } else if (query.sort === "2") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // new to old
    }

    // 📄 Pagination
    const startIndex = (query.page - 1) * query.limit;
    const paginated = filtered.slice(startIndex, startIndex + query.limit);

    setFilteredData(paginated);
    setPaginationData({
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(filtered.length / query.limit),
      totalResults: filtered.length,
    });
  };

  const filterHandler = useCallback((keyword, status, page, limit, sort) => {
    const updatedFilters = {
      keyword: keyword ?? "",
      status: status ?? "",
      sort: sort ?? "",
      page: page ?? 1,
      limit: limit ?? 10,
    };
    setFilters(updatedFilters);
    applyFilters(rawData, updatedFilters);
  }, [rawData]);

  const debouncedFilterHandler = useCallback(
    debounce((keyword, status, page, limit, sort) => {
      filterHandler(keyword, status, page, limit, sort);
    }, 400),
    [filterHandler]
  );

  useEffect(() => {
    fetchAllEmployees();
  }, []);

  return (
    <Layout role={role}>
      <div className="w-full flex flex-wrap items-center justify-between">
        <h1 className="text-black-4 text-3xl font-semibold">Employees</h1>
        <Button
          variant="primary"
          className="w-fit items-center"
          onClick={() => router.push("/employees/create")}
        >
          <svg
            className="mr-2 mt-[1px]"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.625 7C2.625 6.75838 2.78823 6.5625 2.98958 6.5625H11.0104C11.2118 6.5625 11.375 6.75838 11.375 7C11.375 7.24162 11.2118 7.4375 11.0104 7.4375H2.98958C2.78823 7.4375 2.625 7.24162 2.625 7Z"
              fill="#FDFCFF"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7 2.625C7.24162 2.625 7.4375 2.78823 7.4375 2.98958V11.0104C7.4375 11.2118 7.24162 11.375 7 11.375C6.75838 11.375 6.5625 11.2118 6.5625 11.0104V2.98958C6.5625 2.78823 6.75838 2.625 7 2.625Z"
              fill="#FDFCFF"
            />
          </svg>
          Add Employee
        </Button>
      </div>

      <div className="w-full bg-[#FDFCFF] mt-5 rounded-md">
        <FilterBar
          data={rawData}
          sort={true}
          handler={filterHandler}
          debouncedHandler={debouncedFilterHandler}
          currentFilters={filters}
          statusOptions={[
            { label: "All", value: "" },
            { label: "Active", value: "1" },
            { label: "Suspended", value: "2" },
          ]}
        />

        {loading && <Loader />}

        <div className="w-full bg-[#FDFCFF] grid grid-cols-5 gap-4 px-5 py-3 mb-4">
          {!loading &&
            filteredData?.map((item, index) => (
              <SmallCard
                key={`Employee-${index}`}
                url={`/employees/${item._id}`}
                variant={!item.isBlocked}
                name={item.name}
                description={item.email}
              />
            ))}
        </div>

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
    props: {
      role,
    },
  };
}