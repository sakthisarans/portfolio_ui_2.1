"use client";

import { GoogleTagManager } from "@next/third-parties/google";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClientProviders() {
  return (
    <>
      <GoogleAnalytics gaMeasurementId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM} />
      <ToastContainer />
    </>
  );
}
