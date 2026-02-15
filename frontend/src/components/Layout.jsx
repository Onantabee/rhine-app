import React from "react";
import Header from "./Header/index";

const Layout = ({ children, setIsSignup }) => {
  return (
    <div>
      <Header setIsSignup={setIsSignup} />
      <main className="max-w-full">{children}</main>
    </div>
  );
};

export default Layout;
