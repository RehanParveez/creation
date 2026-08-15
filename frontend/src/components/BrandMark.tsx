interface BrandMarkProps {
  size?: number
  className?: string
}

export default function BrandMark({ size = 20, className = '' }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 18 L12 6 L20 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7.3 13.4 H16.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
