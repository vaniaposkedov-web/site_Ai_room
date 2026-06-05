import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, Clock } from 'lucide-react'

const posts = [
  {
    cat: 'Исследование',
    catColor: '#FFE135',
    title: 'Как AI-рекомендации увеличивают AOV на маркетплейсах: данные по 34 брендам',
    excerpt: 'Анализ двухлетних данных нашего портфеля: какие рекомендательные сценарии дают максимальный эффект и почему collaborative filtering побеждает content-based в 80% случаев.',
    author: { name: 'Мария Кузнецова', role: 'CTO', avatar: '#60A5FA', initials: 'МК' },
    read: '8 мин',
    date: '28 мая 2025',
    tag: 'Recommender Systems',
  },
  {
    cat: 'Кейс',
    catColor: '#4ADE80',
    title: 'GPT-4o для карточек товаров: как мы сгенерировали 4 млн описаний за 2 недели',
    excerpt: 'Детальный рассказ о техническом решении, fine-tuning процессе и проблемах с качеством. Показатели SEO до и после: рост органического трафика на 78%.',
    author: { name: 'Игорь Семёнов', role: 'Lead DS', avatar: '#A78BFA', initials: 'ИС' },
    read: '12 мин',
    date: '14 мая 2025',
    tag: 'LLM Fine-tuning',
  },
  {
    cat: 'Мнение',
    catColor: '#F472B6',
    title: 'Почему большинство e-commerce AI-проектов проваливаются: 5 системных ошибок',
    excerpt: 'Разобрали 40+ провальных AI-внедрений у конкурентов и клиентов, которые к нам пришли после. Главная причина — не технология, а отсутствие data strategy.',
    author: { name: 'Алексей Воронов', role: 'CEO', avatar: '#E8845A', initials: 'АВ' },
    read: '6 мин',
    date: '2 мая 2025',
    tag: 'Strategy',
  },
]

export default function Insights() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section id="insights" className="py-28 px-6 bg-[#1e1e1e]">
      <div className="max-w-screen-xl mx-auto">
        <div ref={ref} className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="pill mb-5">Блог</motion.div>
            <motion.h2 initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .1 }}
              className="font-display font-black text-4xl lg:text-5xl text-white tracking-tight">
              Инсайты про AI<br /><span className="ty">в e-commerce</span>
            </motion.h2>
          </div>
          <motion.button initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: .3 }}
            className="btn btn-ghost text-sm shrink-0">
            Все статьи <ArrowUpRight size={15} />
          </motion.button>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {posts.map(({ cat, catColor, title, excerpt, author, read, date, tag }, i) => (
            <motion.article key={title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: .5, delay: .1 * i }}
              className="card card-hover group flex flex-col cursor-pointer"
            >
              {/* Top color line */}
              <div className="h-1 rounded-t-[20px]" style={{ background: catColor }} />

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: `${catColor}18`, color: catColor }}>
                    {cat}
                  </span>
                  <span className="text-[10px] text-white/25 px-2 py-0.5 rounded-full bg-white/[0.04]">{tag}</span>
                </div>

                <h3 className="font-display font-bold text-white text-base leading-snug mb-3 group-hover:ty transition-all flex-1">
                  {title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed mb-5">{excerpt}</p>

                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white shrink-0"
                    style={{ background: `${author.avatar}30`, color: author.avatar }}>
                    {author.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white/70 truncate">{author.name}</div>
                    <div className="text-[10px] text-white/30">{date}</div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-white/25">
                    <Clock size={10} />{read}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
