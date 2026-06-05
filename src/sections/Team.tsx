import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const team = [
  {
    name: 'Алексей Воронов',
    role: 'CEO & Co-founder',
    bio: 'Ex-Head of Growth Яндекс.Маркет. 12 лет в e-commerce. Запустил 3 стартапа, два с exit.',
    avatar: { bg: '#E8845A', initials: 'АВ' },
    links: ['LinkedIn', 'Twitter'],
    tags: ['Growth', 'Strategy', 'M&A'],
  },
  {
    name: 'Мария Кузнецова',
    role: 'CTO & Co-founder',
    bio: 'Ex-Principal ML Engineer Ozon. PhD МФТИ по machine learning. Автор 12 патентов в области рекомендательных систем.',
    avatar: { bg: '#60A5FA', initials: 'МК' },
    links: ['LinkedIn', 'GitHub'],
    tags: ['ML/AI', 'RecSys', 'Architecture'],
  },
  {
    name: 'Дмитрий Лебедев',
    role: 'Head of AI Products',
    bio: 'Бывший Team Lead NLP в Сбере. Строил голосовые ассистенты и поисковые ML-платформы. Открытый евангелист LLM.',
    avatar: { bg: '#4ADE80', initials: 'ДЛ' },
    links: ['LinkedIn'],
    tags: ['NLP', 'LLM', 'Product'],
  },
  {
    name: 'Анна Петрова',
    role: 'Head of Client Success',
    bio: 'Управляла портфелем топ-20 клиентов в Criteo Russia. Специализируется на кросс-канальной аналитике и attribution.',
    avatar: { bg: '#F472B6', initials: 'АП' },
    links: ['LinkedIn'],
    tags: ['Performance', 'Analytics', 'Attribution'],
  },
  {
    name: 'Игорь Семёнов',
    role: 'Lead Data Scientist',
    bio: 'Kaggle Grandmaster. Победитель RecSys Challenge 2022. Строит production ML-пайплайны под нагрузку 50M+ событий/день.',
    avatar: { bg: '#A78BFA', initials: 'ИС' },
    links: ['LinkedIn', 'Kaggle'],
    tags: ['Data Science', 'MLOps', 'Kaggle GM'],
  },
  {
    name: 'Елена Чернова',
    role: 'Creative & Brand AI Lead',
    bio: 'Экс-директор диджитал-агентства BBDO Russia. Специализируется на AI-контенте и бренд-голосе в генеративных системах.',
    avatar: { bg: '#FB923C', initials: 'ЕЧ' },
    links: ['LinkedIn', 'Behance'],
    tags: ['Creative AI', 'Brand Voice', 'Content'],
  },
]

export default function Team() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section id="team" className="py-28 px-6">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div ref={ref} className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="pill mb-5">Команда</motion.div>
            <motion.h2 initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .1 }}
              className="font-display font-black text-4xl lg:text-5xl text-white tracking-tight">
              Люди, которые<br /><span className="ty">делают результат</span>
            </motion.h2>
          </div>
          <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: .2 }}
            className="text-white/40 text-sm leading-relaxed max-w-xs">
            Бывшие сотрудники Яндекса, Сбера, Ozon и международных агентств. Только практики.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {team.map(({ name, role, bio, avatar, tags }, i) => (
            <motion.div key={name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: .5, delay: .08 * i }}
              className="card card-hover p-6 group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-black text-lg text-white shrink-0"
                  style={{ background: `${avatar.bg}30`, border: `2px solid ${avatar.bg}50` }}>
                  <span style={{ color: avatar.bg }}>{avatar.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-white text-base leading-tight">{name}</div>
                  <div className="text-xs text-white/40 mt-0.5">{role}</div>
                </div>
                <ArrowUpRight size={15}
                  className="text-white/15 group-hover:text-[#FFE135] transition-colors shrink-0 mt-1" />
              </div>

              <p className="text-sm text-white/50 leading-relaxed mb-4">{bio}</p>

              <div className="flex flex-wrap gap-1.5">
                {tags.map(t => (
                  <span key={t} className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.04] text-white/35 border border-white/[0.06]">{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Join us */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .6 }}
          className="mt-8 card p-6 flex flex-col sm:flex-row items-center gap-5 justify-between">
          <div>
            <div className="font-display font-bold text-white text-lg mb-1">Хочешь строить AI-будущее?</div>
            <div className="text-white/40 text-sm">Открыты вакансии: ML Engineer, Data Scientist, Growth Hacker</div>
          </div>
          <button className="btn btn-ghost text-sm shrink-0">
            Смотреть вакансии <ArrowUpRight size={15} />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
