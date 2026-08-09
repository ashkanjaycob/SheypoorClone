import Footer from "./Footer";
import Header from "./Header";

// eslint-disable-next-line react/prop-types
function Layout({ children }) {
  return (
    <>
    <div className="flex flex-col min-h-screen max-desktop:mt-24 max-desktop:mb-16 mt-32 max-desktop:px-[6px]">
      <Header />
      <div className="flex-grow w-full">{children}</div>
      <Footer />
    </div>
    </>
  );
}

export default Layout;
