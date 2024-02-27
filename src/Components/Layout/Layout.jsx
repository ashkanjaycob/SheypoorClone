import Footer from "./Footer";
import Header from "./Header";

// eslint-disable-next-line react/prop-types
function Layout({ children }) {
  return (
    <>
      <Header />
      <div className="mt-16 pt-12"> {children}</div>
      <Footer />
    </>
  );
}

export default Layout;
