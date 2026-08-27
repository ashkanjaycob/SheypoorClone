import Footer from "./Footer";
import Header from "./Header";

// eslint-disable-next-line react/prop-types
function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Main content area with proper spacing for fixed header and mobile bottom nav */}
      <main className="flex-grow w-full mt-14 laptop:mt-24 mb-16 laptop:mb-0">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
