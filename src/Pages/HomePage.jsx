import Hero from "../Components/Hero/Hero";
import Trusted from "../Components/Trusted/Trusted";
import Features from "../Components/Features/Features";
import About from "../Components/About/About";
import Pricing from "../Components/Pricing/Pricing";
import FAQ from "../Components/FAQ/FAQ";
import Footer from "../Components/Footer/Footer";

function Home() {
  return (
    <>
      <Hero />
      <Trusted />
      <Features />
      <About />
      <Pricing />
      <FAQ />
      <Footer />
    </>
  );
}

export default Home;