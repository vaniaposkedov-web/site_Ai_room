import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Play, Clock, Users, Eye, BookOpen, Sparkles, X, ChevronRight } from 'lucide-react'

const featured = {
  id: 'demo-main',
  title: 'Полный обзор AIROOM: от регистрации до первого AI-агента',
  description: 'Покажем как за 10 минут запустить AI-ассистента, подключить данные и автоматизировать первый процесс.',
  duration: '10:42',
  views: '24.8K',
  category: 'Демо',
  categoryColor: '#FFE135',
  thumbnail: {
    bg: 'from-[#1a1a1a] to-[#0d0d0d]',
    accentFrom: '#FFE135',
    accentTo: '#FFF0A0',
    label: 'Full Demo',
  },
  tags: ['Быстрый старт', 'AI агент', 'Автоматизация'],
  instructor: { name: 'Артём Волков', role: 'Head of Product', avatar: '#5A9EE8', initials: 'АВ' },
}

const videos = [
  {
    id: 'v1',
    title: 'Создание AI-чат-бота для поддержки клиентов',
    duration: '7:15',
    views: '18.2K',
    category: 'Туториал',
    categoryColor: '#60a5fa',
    bg: 'from-[#1a1a2e] to-[#16213e]',
    accent: '#60a5fa',
    level: 'Начальный',
    tags: ['Чат-бот', 'Support'],
    instructor: { name: 'Мария Соколова', avatar: '#5AE89A', initials: 'МС' },
  },
  {
    id: 'v2',
    title: 'Аналитика продаж с AI: дашборды и прогнозы',
    duration: '12:30',
    views: '9.4K',
    category: 'Кейс',
    categoryColor: '#4ade80',
    bg: 'from-[#0d1f0d] to-[#0a1a0a]',
    accent: '#4ade80',
    level: 'Средний',
    tags: ['Аналитика', 'Sales'],
    instructor: { name: 'Игорь Петренко', avatar: '#E8845A', initials: 'ИП' },
  },
  {
    id: 'v3',
    title: 'Автоматизация HR: оффер, онбординг, напоминания',
    duration: '9:05',
    views: '6.1K',
    category: 'Туториал',
    categoryColor: '#a78bfa',
    bg: 'from-[#1a0d2e] to-[#100820]',
    accent: '#a78bfa',
    level: 'Начальный',
    tags: ['HR', 'Flow'],
    instructor: { name: 'Анна Козлова', avatar: '#E85AB1', initials: 'АК' },
  },
  {
    id: 'v4',
    title: 'Интеграция AIROOM с Salesforce за 5 минут',
    duration: '5:22',
    views: '4.8K',
    category: 'Интеграция',
    categoryColor: '#fb923c',
    bg: 'from-[#1f0e00] to-[#180b00]',
    accent: '#fb923c',
    level: 'Начальный',
    tags: ['Salesforce', 'CRM'],
    instructor: { name: 'Дмитрий Волков', avatar: '#5A9EE8', initials: 'ДВ' },
  },
]

/* ─── Thumbnail placeholder ─── */
function Thumbnail({ bg, accent, label, size = 'sm' }: { bg: string; accent: string; label?: string; size?: 'sm' | 'lg' }) {
  return (
    <div className={`relative w-full ${size === 'lg' ? 'h-48 lg:h-64' : 'h-36'} bg-gradient-to-br ${bg} rounded-xl overflow-hidden flex items-center justify-center`}>
      {/* Grid decoration */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(${accent}15 1px, transparent 1px), linear-gradient(90deg, ${accent}15 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />
      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full blur-3xl" style={{ background: `${accent}30` }} />
      </div>
      {/* Label */}
      {label && (
        <div className="relative z-10 text-center">
          <div className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: `${accent}80` }}>
            {label}
          </div>
          <div className="w-8 h-px mx-auto" style={{ background: accent }} />
        </div>
      )}
    </div>
  )
}

/* ─── Video card ─── */
function VideoCard({ video, onClick }: { video: (typeof videos)[0]; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      className="group cursor-pointer"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] bg-[#1a1a1a] hover:border-white/[0.12] transition-all duration-300">
        {/* Thumbnail */}
        <div className="relative">
          <Thumbnail bg={video.bg} accent={video.accent} size="sm" />

          {/* Overlay on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 flex items-center justify-center"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: video.accent }}>
                  <Play size={18} className="text-[#262626] ml-0.5" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Duration badge */}
          <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1">
            <Clock size={9} />{video.duration}
          </div>

          {/* Category badge */}
          <div className="absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${video.categoryColor}20`, color: video.categoryColor, border: `1px solid ${video.categoryColor}30` }}>
            {video.category}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/35">{video.level}</span>
            {video.tags.map(t => (
              <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/35">{t}</span>
            ))}
          </div>

          <h4 className="font-display font-semibold text-white text-sm leading-snug mb-3 group-hover:text-[#FFE135] transition-colors">
            {video.title}
          </h4>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                style={{ background: video.instructor.avatar }}>
                {video.instructor.initials}
              </div>
              <span className="text-[11px] text-white/40">{video.instructor.name}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-white/30">
              <Eye size={10} />{video.views}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Play modal ─── */
function PlayModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-3xl aspect-video bg-[#111] rounded-2xl border border-white/[0.1] flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#FFE135] flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-105 transition-transform">
            <Play size={32} className="text-[#262626] ml-1" />
          </div>
          <p className="text-white/40 text-sm">Видео будет доступно после регистрации</p>
          <button className="btn-primary mt-4 text-sm px-6 py-2.5">Зарегистрироваться бесплатно</button>
        </div>
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
          <X size={16} className="text-white/60" />
        </button>
      </motion.div>
    </motion.div>
  )
}

/* ─── Main section ─── */
export default function VideoShowcase() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [playOpen, setPlayOpen] = useState(false)

  return (
    <>
      <section id="videos" className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full bg-[#FFE135]/5 blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div ref={ref} className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="inline-flex mb-4">
                <span className="section-tag"><BookOpen size={11} />Обучение и демо</span>
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
                className="font-display text-4xl lg:text-5xl font-bold text-white tracking-tight"
              >
                Видео-туториалы
                <br /><span className="text-gradient-yellow">и кейсы клиентов</span>
              </motion.h2>
            </div>
            <motion.button initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}
              className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors flex-shrink-0"
            >
              Вся библиотека <ChevronRight size={16} />
            </motion.button>
          </div>

          {/* Featured video */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="grid lg:grid-cols-[1fr_380px] gap-6 mb-8"
          >
            {/* Left — big thumbnail */}
            <div
              className="relative rounded-2xl overflow-hidden cursor-pointer group border border-white/[0.07] hover:border-white/[0.15] transition-all duration-300"
              onClick={() => setPlayOpen(true)}
            >
              <Thumbnail
                bg={featured.thumbnail.bg}
                accent={featured.thumbnail.accentFrom}
                label={featured.thumbnail.label}
                size="lg"
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-[#FFE135]/30 animate-ping" />
                  <div className="relative w-16 h-16 rounded-full bg-[#FFE135] flex items-center justify-center shadow-[0_0_40px_rgba(255,225,53,0.4)] group-hover:scale-105 transition-transform">
                    <Play size={24} className="text-[#262626] ml-1" />
                  </div>
                </div>
              </div>
              {/* Duration */}
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white text-xs font-mono px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <Clock size={11} />{featured.duration}
              </div>
              {/* Category */}
              <div className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: `${featured.categoryColor}25`, color: featured.categoryColor, border: `1px solid ${featured.categoryColor}30` }}>
                {featured.category}
              </div>
            </div>

            {/* Right — featured info */}
            <div className="flex flex-col justify-between p-6 rounded-2xl border border-white/[0.07] bg-[#1a1a1a]">
              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {featured.tags.map(t => (
                    <span key={t} className="text-[10px] bg-white/5 text-white/40 px-2.5 py-1 rounded-full border border-white/[0.06]">{t}</span>
                  ))}
                </div>
                <h3 className="font-display font-bold text-white text-xl leading-snug mb-3">{featured.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{featured.description}</p>
              </div>

              <div>
                <div className="flex items-center gap-3 py-4 border-t border-b border-white/[0.06] my-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: featured.instructor.avatar }}>
                    {featured.instructor.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{featured.instructor.name}</div>
                    <div className="text-xs text-white/35">{featured.instructor.role}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-5 text-sm text-white/40">
                  <span className="flex items-center gap-1.5"><Eye size={13} /> {featured.views} просмотров</span>
                  <span className="flex items-center gap-1.5"><Users size={13} /> 4.9 / 5</span>
                </div>

                <button onClick={() => setPlayOpen(true)}
                  className="btn-primary w-full justify-center">
                  <Play size={16} /> Смотреть сейчас
                </button>
              </div>
            </div>
          </motion.div>

          {/* Video grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {videos.map((v, i) => (
              <motion.div key={v.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <VideoCard video={v} onClick={() => setPlayOpen(true)} />
              </motion.div>
            ))}
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-14 pt-10 border-t border-white/[0.06]"
          >
            {[
              { icon: BookOpen, value: '120+', label: 'обучающих видео' },
              { icon: Users, value: '15K+', label: 'студентов' },
              { icon: Eye, value: '480K', label: 'просмотров' },
              { icon: Sparkles, value: '4.9', label: 'средняя оценка' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[rgba(255,225,53,0.08)] flex items-center justify-center">
                  <Icon size={16} className="text-[#FFE135]" />
                </div>
                <div>
                  <div className="font-display font-bold text-white text-lg leading-none">{value}</div>
                  <div className="text-xs text-white/35 mt-0.5">{label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {playOpen && <PlayModal onClose={() => setPlayOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
