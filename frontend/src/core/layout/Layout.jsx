import React from "react";
import Header from './Header/Header';

const Layout = ({ children, setIsSignup }) => {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <Header setIsSignup={setIsSignup} />
      <main className="max-w-full flex-1 min-h-0 flex flex-col">{children}</main>
    </div>
  );
};

export default Layout;
