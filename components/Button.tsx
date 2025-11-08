import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'flex items-center justify-center rounded-full font-bold leading-normal tracking-[0.015em] transition-all duration-200 min-w-[84px] max-w-[480px]'
  
  const variants = {
    primary: 'bg-primary text-background-dark hover:bg-primary/90 active:scale-95',
    secondary: 'bg-card-dark text-white hover:bg-card-dark/80 active:scale-95',
    outline: 'border border-primary/50 text-primary bg-transparent hover:bg-primary/10 active:scale-95',
  }
  
  // Permite sobrescrever cores via className para casos especiais
  
  const sizes = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-12 px-5 text-base',
    lg: 'h-14 px-6 text-lg',
  }

  const disabledStyles = disabled 
    ? 'opacity-50 cursor-not-allowed active:scale-100' 
    : ''

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full flex-1' : ''} ${disabledStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      <span className="truncate">{children}</span>
    </button>
  )
}

