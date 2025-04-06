// // export default SalesOverview;
// import React from 'react';
// import Table from '@/modules/Table';
// import Button from '@/components/Button';

// // Label map for better display
// const platformLabels = {
//   amazon: "Amazon",
//   flipkart: "Flipkart",
//   woocommerce: "DreamBook"
// };

// // Image logic
// const getPlatformImage = (platform) => {
//   switch (platform) {
//     case 'amazon': return '/images/amazon.jpg';
//     case 'flipkart': return '/images/flipkart.png';
//     case 'woocommerce': return '/images/dreambooks.png';
//     default: return '';
//   }
// };

// const SalesOverview = ({
//   data,
//   totalPayAmount,
//   openRazorpay,
//   showPayments,
//   setShowPayments,
//   dummyPayments,
//   platformSummary,
//   allPlatforms,
//   bookSales = []
// }) => {
//   return (
//     <div className="w-full bg-white rounded-lg p-4 mt-5">
//       {/* Sales Overview Header */}
//       <div className="w-full flex flex-wrap items-center justify-between mb-3">
//         <h2 className="font-medium text-sm">Sales Overview</h2>
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-medium whitespace-nowrap">Total Amount to pay:</span>
//             <span className="text-sm font-semibold whitespace-nowrap">₹{totalPayAmount}</span>
//           </div>
//           <Button variant='primary' className="px-4 py-1 text-sm" onClick={openRazorpay}>
//             Pay Now
//           </Button>
//           <Button variant='white-border' className="px-4 py-1 text-sm" onClick={() => setShowPayments(true)}>
//             Payment History
//           </Button>
//         </div>
//       </div>

//       {/* Sales Data Table */}
//       <Table>
//         <thead>
//           <tr className="border-b-1.5">
//             <th>Platform Name</th>
//             <th>Author Royalty</th>
//             <th>Sales</th>
//             <th>Total Earnings</th>
//             <th>Platform Earnings</th>
//             <th>Total Returned</th>
//             <th>Return Royalty</th>
//             <th>Total to pay</th>
//           </tr>
//         </thead>
//         <tbody>
//           {allPlatforms.map((platform) => {
//             const row = platformSummary[platform] || {
//               sales: 0,
//               returned: 0,
//               totalEarnings: 0,
//               returnRoyalty: 0
//             };
//             const royalty = data.platforms?.find((p) => p.platform === platform)?.royalty || 0;
//             const toPay = row.totalEarnings - row.returnRoyalty;

//             return (
//               <tr key={platform}>
//                 <td className="flex items-center gap-3">
//                   <img
//                     src={getPlatformImage(platform)}
//                     className="size-9 object-cover"
//                     alt={platform}
//                     onError={(e) => e.target.style.display = 'none'}
//                   />
//                   {platformLabels[platform] || platform}
//                 </td>
//                 <td className="text-center">₹{royalty}</td>
//                 <td className="text-center">{row.sales}</td>
//                 <td className="text-center">₹{row.totalEarnings}</td>
//                 <td className="text-center">₹{row.totalEarnings - royalty * row.sales}</td>
//                 <td className="text-center">{row.returned}</td>
//                 <td className="text-center text-orange">-₹{row.returnRoyalty}</td>
//                 <td className="text-center">₹{toPay}</td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </Table>

//       {/* Book-wise Sales Table */}
//       {bookSales?.length > 0 && (
//         <div className="mt-6">
//           <h3 className="font-medium mb-3 text-sm">Sales for this Book</h3>
//           <Table>
//             <thead>
//               <tr className="border-b-1.5">
//                 <th className="w-4/12 text-left text-light-grey">Platform</th>
//                 <th className="w-3/12 text-center text-light-grey">Quantity</th>
//                 <th className="w-3/12 text-center text-light-grey">Price</th>
//                 <th className="w-2/12 text-center text-light-grey">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {bookSales.map((entry, i) => (
//                 <tr key={i} className="border-b-1.5">
//                   <td className="text-left flex gap-2 items-center">
//                     <img src={`/images/${entry.platform.toLowerCase()}.jpg`} className="size-6" />
//                     {entry.platform}
//                   </td>
//                   <td className="text-center">{entry.quantity}</td>
//                   <td className="text-center">₹{entry.price}</td>
//                   <td className="text-center">{entry.date}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       )}

//       {/* Payment History */}
//       {showPayments && (
//         <div className="mt-6 p-4 border rounded-md bg-gray-50">
//           <h3 className="text-lg font-semibold mb-2">Payment History</h3>
//           <Table>
//             <thead>
//               <tr>
//                 <th>Transaction ID</th>
//                 <th>Amount</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {dummyPayments.length === 0 ? (
//                 <tr>
//                   <td colSpan="3" className="text-center py-3">No payments made yet.</td>
//                 </tr>
//               ) : (
//                 dummyPayments.map((pay, idx) => (
//                   <tr key={idx}>
//                     <td>{pay.id}</td>
//                     <td>₹{pay.amount}</td>
//                     <td>{pay.date}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </Table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SalesOverview;

import React from 'react';
import Table from '@/modules/Table';
import Button from '@/components/Button';

// Label map for better display
const platformLabels = {
  amazon: "Amazon",
  flipkart: "Flipkart",
  woocommerce: "DreamBook"
};

// Image logic
const getPlatformImage = (platform) => {
  switch (platform) {
    case 'amazon': return '/images/amazon.jpg';
    case 'flipkart': return '/images/flipkart.png';
    case 'woocommerce': return '/images/dreambooks.png';
    default: return '';
  }
};

const SalesOverview = ({
  data,
  totalPayAmount,
  openRazorpay,
  showPayments,
  setShowPayments,
  dummyPayments,
  platformSummary,
  allPlatforms,
  bookSales = []
}) => {
  return (
    <div className="w-full bg-white rounded-lg p-4 mt-5">
      {/* Sales Overview Header */}
      <div className="w-full flex flex-wrap items-center justify-between mb-3">
        <h2 className="font-medium text-sm">Sales Overview</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium whitespace-nowrap">Total Amount to pay:</span>
            <span className="text-sm font-semibold whitespace-nowrap">₹{totalPayAmount}</span>
          </div>
          <Button variant='primary' className="px-4 py-1 text-sm" onClick={openRazorpay}>
            Pay Now
          </Button>
          <Button variant='white-border' className="px-4 py-1 text-sm" onClick={() => setShowPayments(true)}>
            Payment History
          </Button>
        </div>
      </div>

      {/* Sales Data Table */}
      <Table>
        <thead>
          <tr className="border-b-1.5">
            <th>Platform Name</th>
            <th>Author Royalty</th>
            <th>Sales</th>
            <th>Total Earnings</th>
            <th>Platform Earnings</th>
            <th>Total Returned</th>
            <th>Return Royalty</th>
            <th>Total to pay</th>
          </tr>
        </thead>
        <tbody>
          {allPlatforms.map((platform) => {
            const row = platformSummary[platform] || {
              sales: 0,
              returned: 0,
              totalEarnings: 0,
              returnRoyalty: 0
            };
            const royalty = data.platforms?.find((p) => p.platform === platform)?.royalty || 0;
            const toPay = row.totalEarnings - row.returnRoyalty;

            return (
              <tr key={platform}>
                <td className="flex items-center gap-3">
                  <img
                    src={getPlatformImage(platform)}
                    className="size-9 object-cover"
                    alt={platform}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                  {platformLabels[platform] || platform}
                </td>
                <td className="text-center">₹{royalty}</td>
                <td className="text-center">{row.sales}</td>
                <td className="text-center">₹{row.totalEarnings}</td>
                <td className="text-center">₹{row.totalEarnings - royalty * row.sales}</td>
                <td className="text-center">{row.returned}</td>
                <td className="text-center text-orange">-₹{row.returnRoyalty}</td>
                <td className="text-center">₹{toPay}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Book-wise Sales Table */}
      {bookSales?.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-3 text-sm">Sales for this Book</h3>
          <Table>
            <thead>
              <tr className="border-b-1.5">
                <th className="w-4/12 text-left text-light-grey">Platform</th>
                <th className="w-3/12 text-center text-light-grey">Quantity</th>
                <th className="w-3/12 text-center text-light-grey">Price</th>
                <th className="w-2/12 text-center text-light-grey">Date</th>
              </tr>
            </thead>
            <tbody>
              {bookSales.map((entry, i) => (
                <tr key={i} className="border-b-1.5">
                  <td className="text-left flex gap-2 items-center">
                    <img src={`/images/${entry.platform.toLowerCase()}.jpg`} className="size-6" />
                    {entry.platform}
                  </td>
                  <td className="text-center">{entry.quantity}</td>
                  <td className="text-center">₹{entry.price}</td>
                  <td className="text-center">{entry.date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Payment History */}
      {showPayments && (
        <div className="mt-6 p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Payment History</h3>
          <Table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {dummyPayments.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-3">No payments made yet.</td>
                </tr>
              ) : (
                dummyPayments.map((pay, idx) => (
                  <tr key={idx}>
                    <td>{pay.id}</td>
                    <td>₹{pay.amount}</td>
                    <td>{pay.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default SalesOverview;
