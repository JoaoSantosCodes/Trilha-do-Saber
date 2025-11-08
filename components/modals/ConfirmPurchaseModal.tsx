'use client'

import { useState } from 'react'
import Button from '@/components/Button'

interface ConfirmPurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  item: any | null
  isProcessing?: boolean
}

export default function ConfirmPurchaseModal({
  isOpen,
  onClose,
  onConfirm,
  item,
  isProcessing = false,
}: ConfirmPurchaseModalProps) {
  if (!isOpen || !item) return null

  const handleConfirm = () => {
    onConfirm()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-lg bg-background-light dark:bg-[#1a2e21] text-center shadow-2xl dark:shadow-black/50 p-6 flex flex-col items-center">
        {/* Owl Mascot */}
        <div className="absolute -top-16 right-0 w-24 h-24">
          <div
            className="w-full bg-center bg-no-repeat bg-cover aspect-square"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBjV5MqCBjeggeyvwvg5kSoH3gBb5V4S-aD2uKmOqfQGI5wFeFZN_mLA2LA9DELCcsF7m6FfwiOMFSd-Oca2OYEDXYpSOWD6RYAHcaV5mtQZw0C0Zky1MHp3NUH310YYwkI8zUjHdtvcMjg-ufBEstC5kAPHXu-09NbZURZ6zS9YT1NPcRNA_ZyuzKcEHMT9e7g5ASLk0wgsWRPA9-nnd0ND5GdbUJH8GpBEmOZQqDkKRn8uafrociPHjQuWyFT5ERWNH1y5wj4KKFd')"
            }}
          />
        </div>

        {/* Headline */}
        <h2 className="text-slate-900 dark:text-white tracking-light text-[28px] font-bold leading-tight pt-5 pb-4">
          Confirmar compra?
        </h2>

        {/* Item Image */}
        <div className="flex w-40 h-40 grow bg-background-dark/20 rounded-lg justify-center items-center my-2">
          {item.imagem_url ? (
            <div
              className="w-32 h-32 bg-center bg-no-repeat bg-contain"
              style={{ backgroundImage: `url('${item.imagem_url}')` }}
            />
          ) : (
            <span className="material-symbols-outlined text-6xl text-gray-400">shopping_bag</span>
          )}
        </div>

        {/* Item Details */}
        <h1 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pt-4 pb-1">
          {item.nome}
        </h1>
        <div className="flex items-center justify-center gap-3 pb-4 flex-wrap">
          {item.preco_moedas > 0 && (
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-yellow-400" style={{ fontSize: '20px' }}>
                monetization_on
              </span>
              <p className="text-yellow-400 text-lg font-bold leading-normal">
                {item.preco_moedas} moedas
              </p>
            </div>
          )}
          {item.preco_pontos > 0 && (
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>
                star
              </span>
              <p className="text-primary text-lg font-bold leading-normal">
                {item.preco_pontos} pontos
              </p>
            </div>
          )}
        </div>

        {/* Informational Text */}
        <p className="text-slate-600 dark:text-[#9cbaa6] text-sm font-normal leading-normal pb-6 max-w-xs">
          Este item será adicionado ao seu inventário.
        </p>

        {/* Button Group */}
        <div className="flex flex-col w-full gap-3">
          <Button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="w-full h-12 bg-primary text-background-dark hover:scale-105 active:scale-100 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin">refresh</span>
                Processando...
              </span>
            ) : (
              'Confirmar'
            )}
          </Button>
          <Button
            onClick={onClose}
            disabled={isProcessing}
            className="w-full h-12 bg-slate-200 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:scale-105 active:scale-100 transition-transform disabled:opacity-50"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}

