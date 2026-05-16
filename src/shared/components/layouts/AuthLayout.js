"use client";

import PropTypes from "prop-types";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col relative bg-bg overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 z-10 w-full h-full">
        {children}
      </main>
    </div>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
