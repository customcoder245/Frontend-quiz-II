"use client";

import { ToastContainer } from "react-toastify";

const ToastProvider = () => (
  <ToastContainer
    position="top-center"
    autoClose={5000}
    newestOnTop
    closeOnClick={false}
    closeButton={false}
    draggable={false}
    pauseOnHover={false}
    pauseOnFocusLoss={false}
    limit={1}
    theme="colored"
  />
);

export default ToastProvider;
