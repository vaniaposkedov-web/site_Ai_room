import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/sections/Hero'
import Marquee from '@/sections/Marquee'
import Solutions from '@/sections/Solutions'
import StepShowcase from '@/sections/StepShowcase'
import TryOnSimulator from '@/sections/TryOnSimulator'
import CategoriesGrid from '@/sections/CategoriesGrid'
import FlipDeck from '@/sections/FlipDeck'
import AgentConfigurator from '@/sections/AgentConfigurator'
import RoiCalculator from '@/sections/RoiCalculator'
import Cases from '@/sections/Cases'
import Testimonials from '@/sections/Testimonials'
import ContactForm from '@/sections/ContactForm'
import CTA from '@/sections/CTA'
import { useScrollSpy } from '@/hooks/useScrollSpy'

const SECTION_IDS = [
  'hero',
  'marquee',
  'solutions',
  'step-showcase',
  'try-on',
  'configurator',
  'flip-deck',
  'categories',
  'calculator',
  'cases',
  'testimonials',
  'contact',
  'cta',
]

export default function App() {
  useScrollSpy(SECTION_IDS)

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Solutions />
        <StepShowcase />
        <TryOnSimulator />
        <AgentConfigurator />
        <FlipDeck />
        <CategoriesGrid />
        <RoiCalculator />
        <Cases />
        <Testimonials />
        <ContactForm />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
