import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/sections/Hero'
import Marquee from '@/sections/Marquee'
import Solutions from '@/sections/Solutions'
import StepShowcase from '@/sections/StepShowcase'
import TryOnSimulator from '@/sections/TryOnSimulator'
import CategoriesGrid from '@/sections/CategoriesGrid'
import FlipDeck from '@/sections/FlipDeck'
import Plans from '@/sections/Plans'
import Faq from '@/sections/Faq'
import Testimonials from '@/sections/Testimonials'
import ContactForm from '@/sections/ContactForm'
import CTA from '@/sections/CTA'
import { useScrollSpy } from '@/hooks/useScrollSpy'

const SECTION_IDS = [
  'hero',
  'marquee',
  'step-showcase',
  'solutions',
  'try-on',
  'flip-deck',
  'categories',
  'pricing',
  'faq',
  'testimonials',
  'contact',
  'cta',
]

export default function Landing() {
  useScrollSpy(SECTION_IDS)

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />
      <main>
        <Hero />
        <Marquee />
        <StepShowcase />
        <Solutions />
        <TryOnSimulator />
        <FlipDeck />
        <CategoriesGrid />
        <Plans />
        <Faq />
        <Testimonials />
        <ContactForm />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
