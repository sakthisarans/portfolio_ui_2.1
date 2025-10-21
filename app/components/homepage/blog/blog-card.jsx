// @flow strict
// "use client"
import { useState } from 'react';
import { timeConverter } from '@/utils/time-converter';
import Image from 'next/image';
import { BsHeartFill } from 'react-icons/bs';
import { FaCommentAlt } from 'react-icons/fa';

function BlogCard({ blog }) {
  const [openUrl, setOpenUrl] = useState(null);

  return (
    <>
      <div
        onClick={() => setOpenUrl(blog.url)} 
        className="border border-[#1d293a] hover:border-[#464c6a] transition-all duration-500 bg-[#1b203e] rounded-lg relative group cursor-pointer"
      >
        <div className="h-44 lg:h-52 w-auto overflow-hidden rounded-t-lg">
          <Image
            src={blog?.cover_image}
            height={1080}
            width={1920}
            alt=""
            className="h-full w-full group-hover:scale-110 transition-all duration-300"
          />
        </div>
        <div className="p-2 sm:p-3 flex flex-col">
          <div className="flex justify-between items-center text-[#16f2b3] text-sm">
            <p>{timeConverter(blog.published_at)}</p>
            <div className="flex items-center gap-3">
              <p className="flex items-center gap-1">
                <BsHeartFill />
                <span>{blog.public_reactions_count}</span>
              </p>
              {blog.comments_count > 0 && (
                <p className="flex items-center gap-1">
                  <FaCommentAlt />
                  <span>{blog.comments_count}</span>
                </p>
              )}
            </div>
          </div>
          <p className="my-2 lg:my-3 text-lg text-white sm:text-xl font-medium group-hover:text-violet-500">
            {blog.title}
          </p>
          <p className="mb-2 text-sm text-[#16f2b3]">
            {`${blog.reading_time_minutes} Min Read`}
          </p>
          <p className="text-sm lg:text-base text-[#d3d8e8] pb-3 lg:pb-6 line-clamp-3">
            {blog.description}
          </p>
        </div>
      </div>

      
      {openUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative w-11/12 h-5/6 bg-white rounded-lg overflow-hidden">
            <button
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded"
              onClick={() => setOpenUrl(null)}
            >
              Close
            </button>
            <iframe
              src={openUrl}
              className="w-full h-full"
              frameBorder="0"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}

export default BlogCard;


// // @flow strict
// "use client";
// import { useState } from "react";
// import { timeConverter } from "@/utils/time-converter";
// import Image from "next/image";
// import { BsHeartFill } from "react-icons/bs";
// import { FaCommentAlt } from "react-icons/fa";

// function BlogCard({ blog }) {
//   const [openUrl, setOpenUrl] = useState(null);
//   const [iframeError, setIframeError] = useState(false);

//   const handleOpen = (url) => {
//     try {
//       // Allow same-origin or relative URLs to open in iframe
//       const isSameOrigin = new URL(url, window.location.origin).origin === window.location.origin;
//       if (isSameOrigin) {
//         setOpenUrl(url);
//       } else {
//         // Try to load external URLs — most will be CSP-blocked, so open in new tab
//         window.open(url, "_blank", "noopener,noreferrer");
//       }
//     } catch (err) {
//       window.open(url, "_blank", "noopener,noreferrer");
//     }
//   };

//   return (
//     <>
//       <div
//         onClick={() => handleOpen(blog.url)}
//         className="border border-[#1d293a] hover:border-[#464c6a] transition-all duration-500 bg-[#1b203e] rounded-lg relative group cursor-pointer"
//       >
//         <div className="h-44 lg:h-52 w-auto overflow-hidden rounded-t-lg">
//           <Image
//             src={blog?.cover_image || "/placeholder.jpg"}
//             height={1080}
//             width={1920}
//             alt={blog.title || "Blog cover"}
//             className="h-full w-full group-hover:scale-110 transition-all duration-300 object-cover"
//           />
//         </div>
//         <div className="p-2 sm:p-3 flex flex-col">
//           <div className="flex justify-between items-center text-[#16f2b3] text-sm">
//             <p>{timeConverter(blog.published_at)}</p>
//             <div className="flex items-center gap-3">
//               <p className="flex items-center gap-1">
//                 <BsHeartFill />
//                 <span>{blog.public_reactions_count}</span>
//               </p>
//               {blog.comments_count > 0 && (
//                 <p className="flex items-center gap-1">
//                   <FaCommentAlt />
//                   <span>{blog.comments_count}</span>
//                 </p>
//               )}
//             </div>
//           </div>
//           <p className="my-2 lg:my-3 text-lg text-white sm:text-xl font-medium group-hover:text-violet-500">
//             {blog.title}
//           </p>
//           <p className="mb-2 text-sm text-[#16f2b3]">
//             {`${blog.reading_time_minutes} Min Read`}
//           </p>
//           <p className="text-sm lg:text-base text-[#d3d8e8] pb-3 lg:pb-6 line-clamp-3">
//             {blog.description}
//           </p>
//         </div>
//       </div>

//       {openUrl && !iframeError && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//           <div className="relative w-11/12 h-5/6 bg-white rounded-lg overflow-hidden">
//             <button
//               className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded"
//               onClick={() => {
//                 setOpenUrl(null);
//                 setIframeError(false);
//               }}
//             >
//               Close
//             </button>
//             <iframe
//               src={openUrl}
//               className="w-full h-full"
//               frameBorder="0"
//               onError={() => setIframeError(true)}
//             ></iframe>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default BlogCard;
