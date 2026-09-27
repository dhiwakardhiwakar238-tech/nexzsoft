import Blogs from "../Components/Blogs/Blogs";
import Footer from "../Components/Footer/Footer";


function BlogsPage({ openAuth }) {
  return (
    <>
      <Blogs openAuth={openAuth} />
      <Footer />
    </>
  );
}

export default BlogsPage;