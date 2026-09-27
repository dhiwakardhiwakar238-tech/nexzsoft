import About from "../Components/About/About";
import Aboutus from "../Components/Aboutus/Aboutus";
import Footer from "../Components/Footer/Footer";


function AboutPage({ openAuth }) {
  return (
    <>
      <Aboutus openAuth={openAuth} />
      <Footer />
    </>
  );
}

export default AboutPage;