import ContactUs from "../Components/ContactUs/ContactUs";
import Footer from "../Components/Footer/Footer";


function ContactUsPage({ openAuth }) {
  return (
    <>
      <ContactUs openAuth={openAuth} />
      <Footer />
    </>
  );
}

export default ContactUsPage;