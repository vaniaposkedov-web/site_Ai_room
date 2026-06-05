/**
 * Фирменный знак AI ROOM — четырёхлучевая «искра».
 * Единый символ для всего приложения: разделители, иконки, акценты.
 * Цвет наследуется через currentColor, поэтому управляется классом text-*.
 */
export default function BrandMark({
  size = 16,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Главный 4-лучевой блик */}
      <path
        d="M12 0 C12.4 6.2 17.8 11.6 24 12 C17.8 12.4 12.4 17.8 12 24 C11.6 17.8 6.2 12.4 0 12 C6.2 11.6 11.6 6.2 12 0 Z"
        fill="currentColor"
      />
    </svg>
  )
}
