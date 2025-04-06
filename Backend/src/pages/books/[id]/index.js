import React, { useEffect, useState } from 'react';
import Layout from '@/layout/Layout';
import { useRouter } from 'next/router';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import Table from '@/modules/Table';
import Loader from '@/modules/Loader';
import { permissionHandler } from '@/Utilities/permissions';
import { editBook, getSingleBook } from '@/services/APIs/books';
import { getAllOrders } from '@/services/APIs/orders';
import Script from 'next/script';
import SalesOverview from '@/components/SalesOverview';
import { toast } from '@/Utilities/toasters';

export default function BookDetail({ role }) {
  const router = useRouter();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [showPayments, setShowPayments] = useState(false);
  const [dummyPayments, setDummyPayments] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false); // Add this line

  const bookType = {
    paperBack: 'Paper Back',
    hardCover: 'Hard Cover',
    ebook: 'Ebook',
  };

  const fetchData = async (bookId) => {
    setLoading(true);
    try {
      const res = await getSingleBook(bookId);
      if (res.status) {
        setData(res.data);
      } else if (res.message?.toLowerCase().includes('session')) {
        toast('Session expired. Please login again', 'error');
        router.push('/auth/signin');  // Fixed login route
      } else {
        toast(res.message || 'Failed to fetch book details', 'error');
      }
    } catch (error) {
      console.error("Error fetching book:", error);
      if (error.message?.toLowerCase().includes('session')) {
        toast('Session expired. Please login again', 'error');
        router.push('/auth/signin');  // Fixed login route
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (bookId, title) => {
    try {
      const res = await getAllOrders({ bookId });
      if (res.status && Array.isArray(res.data)) {
        let matched = res.data.filter(order => {
          if (order.line_items?.some(item => item.bookId?.toString() === bookId.toString())) return true;
          if (order.source === "amazon" && order.bookId?.toString() === bookId.toString()) return true;
          return false;
        });

        if (matched.length === 0) {
          const fallback = res.data.filter(order =>
            order.line_items?.some(item => item.name?.toLowerCase().includes(title.toLowerCase()))
          );
          matched = fallback;
        }

        setOrders(matched);
      } else if (res.message?.toLowerCase().includes('session')) {
        toast('Session expired. Please login again', 'error');
        router.push('/auth/signin');  // Fixed login route
      } else {
        toast(res.message || 'Failed to fetch orders', 'error');
      }
    } catch (err) {
      console.error("❌ Failed to fetch orders:", err);
      if (err.message?.toLowerCase().includes('session')) {
        toast('Session expired. Please login again', 'error');
        router.push('/auth/signin');  // Fixed login route
      } else {
        toast('Failed to fetch orders', 'error');
      }
      setOrders([]);
    }
  };

  const updateStatus = async (status) => {
    try {
      setIsUpdating(true);
      setLoading(true);
  
      const bookId = router.query.id; // ✅ Use URL ID
      const payload = new FormData();
      payload.append('status', status);
  
      const res = await editBook(payload, bookId);
  
      if (res.status) {
        toast(`Book ${status} successfully`, 'success');
        await fetchData(bookId);
      } else if (res.code === 401 || res.message?.toLowerCase().includes('session')) {
        toast('Session expired. Please login again.', 'error');
        router.push('/login');
      } else {
        toast(res.message || 'Failed to update book status', 'error');
      }
    } catch (error) {
      console.error("❌ Status update error:", error);
      toast('An error occurred while updating book status', 'error');
    } finally {
      setIsUpdating(false);
      setLoading(false);
    }
  };
  
  
  

  useEffect(() => {
    const bookId = router.query.id;
    if (bookId) {
      fetchData(bookId);
    }
  }, [router.query.id]);

  useEffect(() => {
    const bookId = router.query.id;
    if (bookId && data.title) {
      fetchOrders(bookId, data.title);
    }
  }, [data.title, router.query.id]);

  const allPlatforms = ['amazon', 'flipkart', 'woocommerce'];

  const platformLabels = {
    amazon: "Amazon",
    flipkart: "Flipkart",
    woocommerce: "DreamBook"
  };

  const getPlatformImage = (platform) => {
    switch (platform) {
      case 'amazon': return '/images/amazon.jpg';
      case 'flipkart': return '/images/flipkart.png';
      case 'woocommerce': return '/images/dreambooks.png';
      default: return '';
    }
  };

  const platformWiseSummary = () => {
    const summary = {};
    orders.forEach(order => {
      const platform = order.source?.toLowerCase();
      if (!platform || !allPlatforms.includes(platform)) return;
      order.line_items?.forEach(item => {
        if (item.bookId?.toString() !== data._id?.toString()) return;
        const quantity = parseInt(item.quantity || 0);
        const itemPrice = parseFloat(item.price || 0);
        const totalAmount = itemPrice * quantity;
        if (!summary[platform]) {
          summary[platform] = {
            sales: 0,
            price: itemPrice,
            returned: 0,
            totalEarnings: 0,
            returnRoyalty: 0,
          };
        }
        summary[platform].sales += quantity;
        summary[platform].totalEarnings += totalAmount;
      });
    });
    return summary;
  };

  const platformSummary = platformWiseSummary();
  const totalPayAmount = Object.values(platformSummary).reduce((sum, item) => sum + (item.totalEarnings - item.returnRoyalty), 0);

  const bookSales = orders.flatMap(order => 
    (order.line_items || [])
      .filter(item => item.bookId?.toString() === data._id?.toString())
      .map(item => ({
        platform: order.source,
        quantity: item.quantity || 1,
        price: item.price || 0,
        date: new Date(order.createdAt).toLocaleDateString()
      }))
  );

  const openRazorpay = () => {
    const options = {
      key: 'rzp_test_dummyKey',
      amount: totalPayAmount * 100,
      currency: 'INR',
      name: 'DreamBooks Admin Payment',
      description: 'Royalty Payment to Author',
      handler: function (response) {
        alert(`Payment successful! Transaction ID: ${response.razorpay_payment_id}`);
        setDummyPayments(prev => [...prev, {
          id: response.razorpay_payment_id,
          amount: totalPayAmount,
          date: new Date().toLocaleString(),
        }]);
      },
      prefill: {
        name: data.author?.name || 'Author',
        email: data.author?.email || 'author@example.com'
      },
      theme: { color: '#5c6ac4' }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <Layout role={role}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="flex items-center gap-2 mb-4">
      <Button variant="white-border" className="w-fit mr-3 items-center" onClick={() => router.push(`/books/${router.query["id"]}`)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M14 8C14 8.27614 13.7761 8.5 13.5 8.5L2.5 8.5C2.22386 8.5 2 8.27614 2 8C2 7.72386 2.22386 7.5 2.5 7.5L13.5 7.5C13.7761 7.5 14 7.72386 14 8Z" fill="#8C8D8C"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M7.35355 3.14645C7.54882 3.34171 7.54882 3.65829 7.35355 3.85355L3.20711 8L7.35355 12.1464C7.54881 12.3417 7.54881 12.6583 7.35355 12.8536C7.15829 13.0488 6.84171 13.0488 6.64645 12.8536L2.14645 8.35355C1.95118 8.15829 1.95118 7.84171 2.14645 7.64645L6.64645 3.14645C6.84171 2.95118 7.15829 2.95118 7.35355 3.14645Z" fill="#8C8D8C"/>
                    </svg>
                </Button>

  <h1 className="text-black-4 text-2xl font-semibold">Book detail</h1>
</div>


      {loading ? <Loader /> : (
        <>
          <div className="w-full bg-[#FDFCFF] mt-5 rounded-lg p-5">
            <div className="w-full flex flex-wrap items-start justify-between relative">
              <div className="w-5/12">
                <img src={data.coverImage?.url} alt="book-cover" className="rounded-lg object-cover w-full max-h-[600px]" />
              </div>
              <div className="w-7/12 pl-3 flex flex-wrap justify-between">
                <div className="w-full flex flex-wrap items-center justify-between gap-2 relative">
                  <div className="flex items-center gap-2">
                    <Badge variant={data.status} className="capitalize px-3 py-1 text-sm">{data.status}</Badge>
                    {permissionHandler('editBook', role) && (
                      <select
                      className="bg-white border border-gray-300 text-sm rounded-md px-2 py-1 shadow-sm focus:outline-none"
    value={data.status}
    onChange={(e) => updateStatus(e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    )}
                  </div>
                  {permissionHandler('editBook', role) && (
                    <div className="absolute right-0 top-0">
                      <Button variant="primary" className="px-4 py-1 text-sm" onClick={() => router.push(`/books/${router.query.id}/edit`)}>Edit</Button>
                    </div>
                  )}
                </div>

                <div className="w-full mt-2">
                  <h1 className="text-2xl text-black font-bold capitalize">{data.title}</h1>
                  <p className="text-gray-500 text-sm mt-2">{data.description}</p>
                </div>

                <h3 className="text-light-grey mt-6 text-sm font-semibold">Book Info</h3>
                <div className="my-3 w-full grid grid-cols-3 gap-3 py-2.5 px-5 border rounded-md border-gray-200">
                  <div><h4 className="font-semibold">Price</h4><h4>₹{data.price}</h4></div>
                  <div><h4 className="font-semibold">Genre</h4><h4>{data.categories?.[0]}</h4></div>
                  <div><h4 className="font-semibold">Author</h4><h4>{data.author?.name}</h4></div>
                  <div><h4 className="font-semibold">Type</h4><h4>{bookType[data.bindingSize?.[0]] || 'N/A'}</h4></div>
                  <div><h4 className="font-semibold">Language</h4><h4>{data.language}</h4></div>
                  <div><h4 className="font-semibold">ISBN</h4><h4>{data.isbnNumber}</h4></div>

                  {data.offer?.expiry && (
                    <>
                      <div><h4 className="font-semibold">Offer Expiry</h4><h4>{new Date(data.offer.expiry).toLocaleDateString()}</h4></div>
                      <div><h4 className="font-semibold">Expiry Type</h4><h4 className="capitalize">{data.offer.expiryType}</h4></div>
                    </>
                  )}
                </div>

                {role !== 'author' && data.status === 'pending' && (
                  <div className="w-full flex items-center justify-between flex-wrap gap-3 mt-3">
                   <Button
  variant="danger"
  className="w-[150px]"
  onClick={() => updateStatus('rejected')}
>
  Reject
</Button>

<Button
  variant="success"
  className="w-[150px]"
  onClick={() => updateStatus('approved')}
>
  Approve
</Button>




                  </div>
                )}
              </div>
            </div>
          </div>

          {data.status === 'approved' && (
            <SalesOverview
              data={data}
              role={role}
              totalPayAmount={totalPayAmount}
              openRazorpay={openRazorpay}
              showPayments={showPayments}
              setShowPayments={setShowPayments}
              dummyPayments={dummyPayments}
              platformSummary={platformSummary}
              allPlatforms={allPlatforms}
              getPlatformImage={getPlatformImage}
              platformLabels={platformLabels}
              bookSales={bookSales}
            />
          )}
        </>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const role = req.cookies._r || null;
  return {
    props: { role },
  };
}
