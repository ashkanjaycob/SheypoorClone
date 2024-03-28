import Footer from "./Footer";
import Header from "./Header";

// eslint-disable-next-line react/prop-types
function Layout({ children }) {
  return (
    <>
    <div className="flex flex-col min-h-screen max-desktop:mt-24 max-desktop:mb-16 mt-32">
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
    </>
  );
}

export default Layout;
