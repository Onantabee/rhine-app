import React from "react";
import Header from "./Header/index";

const Layout = ({ children, setIsSignup }) => {
  return (
    <div className="flex flex-col h-screen">
      <Header setIsSignup={setIsSignup} />
      <main className="max-w-full h-full">{children}</main>
    </div>
  );
};

export default Layout;
