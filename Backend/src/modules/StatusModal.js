// import React from "react";

// export default function StatusModal(props) {
//   const handler = (e) => {
//     props.handler(e.currentTarget.getAttribute("value"));
//   };
//   return (
//     <div className="w-28 bg-white p-4 rounded-xl absolute top-12 border border-[#ededed] left-0 z-50">
//       <label
//         htmlFor="verified"
//         className="w-full flex items-center gap-2 cursor-pointer"
//         value="1"
//         onClick={handler}
//       >
//         {props.value === "1" ? (
//           <input
//             type="radio"
//             name="status"
//             id="verified"
//             value="verified"
//             checked
//           />
//         ) : (
//           <input type="radio" name="status" id="verified" value="verified" />
//         )}
//         <h6 className="text-xs text-black font-normal">Verified</h6>
//       </label>
//       <label
//         htmlFor="pending"
//         className="w-full flex items-center gap-2 mt-4 cursor-pointer"
//         value="0"
//         onClick={handler}
//       >
//         {props.value === "0" ? (
//           <input
//             type="radio"
//             name="status"
//             id="pending"
//             value="pending"
//             checked
//           />
//         ) : (
//           <input type="radio" name="status" id="pending" value="pending" />
//         )}
//         <h6 className="text-xs text-black font-normal">Pending</h6>
//       </label>
//       <label
//         htmlFor="declined"
//         className="w-full flex items-center gap-2 mt-4 cursor-pointer"
//         value="2"
//         onClick={handler}
//       >
//         {props.value === "2" ? (
//           <input
//             type="radio"
//             name="status"
//             id="declined"
//             value="declined"
//             checked
//           />
//         ) : (
//           <input type="radio" name="status" id="declined" value="declined" />
//         )}
//         <h6 className="text-xs text-black font-normal">Declined</h6>
//       </label>
//       <label
//         htmlFor="all"
//         className="w-full flex items-center gap-2 mt-4 cursor-pointer"
//         value=""
//         onClick={handler}
//       >
//         {props.value === "" ? (
//           <input type="radio" name="status" id="all" value="all" checked />
//         ) : (
//           <input type="radio" name="status" id="all" value="all" />
//         )}
//         <h6 className="text-xs text-black font-normal">All</h6>
//       </label>
//     </div>
//   );
// }
// import React from "react";

// export default function StatusModal(props) {
//   const handler = (e) => {
//     props.handler(e.currentTarget.getAttribute("value"));
//   };

//   return (
//     <div className="w-28 bg-white p-4 rounded-xl absolute top-12 border border-[#ededed] left-0 z-50">
//       <label
//         htmlFor="verified"
//         className="w-full flex items-center gap-2 cursor-pointer"
//         value="approved"
//         onClick={handler}
//       >
//         <input
//           type="radio"
//           name="status"
//           id="verified"
//           value="approved"
//           checked={props.value === "approved"}
//           readOnly
//         />
//         <h6 className="text-xs text-black font-normal">Verified</h6>
//       </label>

//       <label
//         htmlFor="pending"
//         className="w-full flex items-center gap-2 mt-4 cursor-pointer"
//         value="pending"
//         onClick={handler}
//       >
//         <input
//           type="radio"
//           name="status"
//           id="pending"
//           value="pending"
//           checked={props.value === "pending"}
//           readOnly
//         />
//         <h6 className="text-xs text-black font-normal">Pending</h6>
//       </label>

//       <label
//         htmlFor="declined"
//         className="w-full flex items-center gap-2 mt-4 cursor-pointer"
//         value="rejected"
//         onClick={handler}
//       >
//         <input
//           type="radio"
//           name="status"
//           id="declined"
//           value="rejected"
//           checked={props.value === "rejected"}
//           readOnly
//         />
//         <h6 className="text-xs text-black font-normal">Declined</h6>
//       </label>

//       <label
//         htmlFor="all"
//         className="w-full flex items-center gap-2 mt-4 cursor-pointer"
//         value=""
//         onClick={handler}
//       >
//         <input
//           type="radio"
//           name="status"
//           id="all"
//           value=""
//           checked={props.value === ""}
//           readOnly
//         />
//         <h6 className="text-xs text-black font-normal">All</h6>
//       </label>
//     </div>
//   );
// }

import React from "react";

export default function StatusModal({ value, handler, options }) {
  const statusOptions = options || [
    { label: "Verified", value: "approved" },
    { label: "Pending", value: "pending" },
    { label: "Declined", value: "rejected" },
    { label: "All", value: "" },
  ];

  const onSelect = (e) => {
    handler(e.currentTarget.getAttribute("value"));
  };

  return (
    <div className="w-28 bg-white p-4 rounded-xl absolute top-12 border border-[#ededed] left-0 z-50">
      {statusOptions.map((item, index) => (
        <label
          key={index}
          htmlFor={item.value || `status-${index}`}
          className={`w-full flex items-center gap-2 ${index > 0 ? "mt-4" : ""} cursor-pointer`}
          value={item.value}
          onClick={onSelect}
        >
          <input
            type="radio"
            name="status"
            id={item.value || `status-${index}`}
            value={item.value}
            checked={value === item.value}
            readOnly
          />
          <h6 className="text-xs text-black font-normal">{item.label}</h6>
        </label>
      ))}
    </div>
  );
}