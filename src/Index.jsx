import { Navbar } from './components/navbar/Navbar';
import {BookingSection} from './components/hero/Hero';
import {FeaturesSection} from './components/features/Features'
import { TestimonialSection } from './components/testimonials/Testimonials';
import { FAQSection } from './components/FAQs/Faqs';
import { Footer } from './components/footer/Footer';
export default function Index() {

  return (
    <>
      <Navbar/>
      <BookingSection/>
      <FeaturesSection/>
      <TestimonialSection/>
      <FAQSection/>
      <Footer/>
    </>
  )
}
  



