
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Badge from '@/components/Badge';
import Button from '@/components/Button';

export default function Card({ data, variant }) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const handleView = () => {
    const bookId = data?.id || data?._id;
    if (bookId) {
      router.push(`/books/${bookId}`);
    } else {
      console.warn("❌ Book ID is missing.");
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Get appropriate image URL
  const getImageUrl = () => {
    if (imageError || !data?.coverImage?.url) {
      return "/images/default-book.png";
    }
    return data.coverImage.url;
  };

  return (
    <div className="w-full min-h-[300px] bg-white card-shadow rounded-2xl flex flex-col justify-between p-3">
      <div className="relative aspect-[3/4] w-full">
        <img
          src={getImageUrl()}
          alt={data.title || "Book cover"}
          onError={handleImageError}
          className="rounded-lg object-cover w-full h-full"
        />
      </div>

      <div className="flex flex-col justify-between flex-grow mt-2">
        <Badge variant={variant || data?.status} />

        <h2
          className="mt-2 mb-1 font-semibold text-sm text-start capitalize line-clamp-2 break-words"
          title={data.title}
        >
          {data.title}
        </h2>
        
        <h4 className="text-xs text-gray-500 text-start truncate">
          {data.author?.name || "Unknown Author"}
        </h4>
      </div>

      <div className="mt-2 text-start">
        {data.offer?.price && new Date(data.offer.expiry) > new Date() ? (
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-500 line-through">₹{data.price}</span>
            <span className="text-sm text-green-600 font-semibold">₹{data.offer.price}</span>
          </div>
        ) : (
          <span className="text-sm text-black font-semibold">₹{data.price}</span>
        )}
      </div>

      <Button variant="primary" onClick={handleView} className="mt-3">
        View
      </Button>
    </div>
  );
}