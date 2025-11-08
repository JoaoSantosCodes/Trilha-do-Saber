import { InputHTMLAttributes, useState } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: string
  error?: string
  showPasswordToggle?: boolean
}

export default function Input({
  label,
  icon,
  error,
  showPasswordToggle = false,
  type,
  className = '',
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  return (
    <label className="flex flex-col min-w-40 flex-1">
      {label && (
        <p className="text-white text-base font-medium leading-normal pb-2">
          {label}
        </p>
      )}
      <div className="flex w-full flex-1 items-stretch rounded-xl bg-input-bg dark:bg-input-bg">
        {icon && (
          <div className="text-input-icon flex items-center justify-center pl-4 pr-2">
            <span className="material-symbols-outlined">{icon}</span>
          </div>
        )}
        <input
          type={isPassword && showPassword ? 'text' : type}
          className={`flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-transparent h-14 placeholder:text-input-icon p-0 pl-2 ${isPassword && showPasswordToggle ? 'pr-10' : 'pr-4'} text-base font-normal leading-normal ${className}`}
          {...props}
        />
        {isPassword && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-input-icon flex items-center justify-center pr-4 pl-2 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-sm mt-1 px-2">{error}</p>
      )}
    </label>
  )
}

