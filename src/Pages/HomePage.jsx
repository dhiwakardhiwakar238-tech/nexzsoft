import Hero from "../Components/Hero/Hero";
import Trusted from "../Components/Trusted/Trusted";
import Features from "../Components/Features/Features";
import About from "../Components/About/About";
import Pricing from "../Components/Pricing/PricingPreview";
import FAQ from "../Components/FAQ/FAQ";

import Footer from "../Components/Footer/Footer";

import DashboardShowcase from "../Components/DashboardShowcase/DashboardShowcase";

import WhyChooseUs from "../Components/WhyChooseUs/WhyChooseUs";
import SecuritySection from "../Components/SecuritySection/SecuritySection";
import Testimonials from "../Components/Testimonials/Testimonials";
import Stats from "../Components/Stats/Stats";
import CallToAction from "../Components/CallToAction/CallToAction";

function Home({ openAuth }) {
  return (
    <>
      {/* Hero Section */}
      <Hero openAuth={openAuth}/>

      {/* Trusted By
      <Trusted />*/}

      {/* Features */}
      <Features />

      {/* <DashboardShowcase />    */}

      {/* About */}
      {/* <About />  */}

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Security & Compliance */}
      <SecuritySection />    

      {/* Statistics */}
      <Stats />   

      {/* Testimonials */}
      <Testimonials />

      {/* Pricing */}
      <Pricing openAuth={openAuth} />

      {/* FAQ */}
      <FAQ />

      {/* Final CTA */}
      <CallToAction />

      <Footer/>

    </>
  );
}

export default Home;
