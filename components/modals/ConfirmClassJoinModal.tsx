'use client'

import Button from '@/components/Button'

interface ConfirmClassJoinModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  studentName: string
  className: string
  teacherName: string
}

export default function ConfirmClassJoinModal({
  isOpen,
  onClose,
  onConfirm,
  studentName,
  className,
  teacherName,
}: ConfirmClassJoinModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-lg bg-white dark:bg-[#1a2c20] text-[#111813] dark:text-gray-100 shadow-2xl">
        <div className="flex flex-col items-center justify-center p-6 sm:p-8">
          {/* Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary mb-4">
            <span className="material-symbols-outlined !text-4xl">help_outline</span>
          </div>

          {/* HeadlineText */}
          <h2 className="text-[#111813] dark:text-white tracking-light text-[28px] font-bold leading-tight text-center pb-2">
            Confirmação
          </h2>

          {/* BodyText */}
          <p className="text-slate-700 dark:text-slate-300 text-base font-normal leading-normal pb-6 pt-1 px-4 text-center">
            Você confirma que <strong className="font-bold text-[#111813] dark:text-white">{studentName}</strong> deve entrar na turma{' '}
            <strong className="font-bold text-[#111813] dark:text-white">&quot;{className}&quot;</strong> do(a) professor(a){' '}
            <strong className="font-bold text-[#111813] dark:text-white">{teacherName}</strong>?
          </p>

          {/* ButtonGroup */}
          <div className="flex w-full flex-col sm:flex-row-reverse gap-3">
            <Button
              onClick={onConfirm}
              className="flex flex-1 min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-primary text-[#111813] text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
            >
              <span className="truncate">Confirmar</span>
            </Button>
            <Button
              onClick={onClose}
              className="flex flex-1 min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-gray-200 dark:bg-gray-700 text-[#111813] dark:text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="truncate">Cancelar</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

