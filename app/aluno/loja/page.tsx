'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import Button from '@/components/Button'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import PageLoading from '@/components/PageLoading'
import EmptyState from '@/components/EmptyState'
import { useLoja } from '@/hooks/useLoja'
import { useAluno } from '@/hooks/useAluno'
import ConfirmPurchaseModal from '@/components/modals/ConfirmPurchaseModal'
import PurchaseSuccessModal from '@/components/modals/PurchaseSuccessModal'

export default function LojaPage() {
  const router = useRouter()
  const { itens, loading, comprarItem, equiparItem, desequiparItem } = useLoja()
  const { aluno } = useAluno()
  const [activeTab, setActiveTab] = useState<'avatar' | 'coruja' | 'powerups'>('avatar')
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const coins = aluno?.moedas || 0
  const pontos = aluno?.pontos || 0

  // Filtrar itens por categoria
  const avatarItems = useMemo(
    () => itens.filter((item) => item.categoria === 'avatar'),
    [itens]
  )

  const owlAccessories = useMemo(
    () => itens.filter((item) => item.categoria === 'coruja'),
    [itens]
  )

  const powerUps = useMemo(
    () => itens.filter((item) => item.categoria === 'powerup'),
    [itens]
  )

  const handleBuy = async (item: any) => {
    setSelectedItem(item)
    setShowConfirmModal(true)
  }

  const confirmPurchase = async () => {
    if (!selectedItem) return

    setIsProcessing(true)
    const { error } = await comprarItem(selectedItem.id)
    setIsProcessing(false)

    if (error) {
      alert(`Erro ao comprar: ${error}`)
      setShowConfirmModal(false)
    } else {
      setShowConfirmModal(false)
      setShowSuccessModal(true)
      setSelectedItem(null)
    }
  }

  const handleEquip = async (item: any) => {
    if (item.equipado) {
      // Desequipar
      const { error } = await desequiparItem(item.id)
      if (error) {
        alert(`Erro ao desequipar: ${error}`)
      }
    } else {
      // Equipar
      const { error } = await equiparItem(item.id)
      if (error) {
        alert(`Erro ao equipar: ${error}`)
      }
    }
    setSelectedItem(null)
  }

  if (loading) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark overflow-x-hidden">
        <Header />
        <PageLoading message="Carregando loja..." />
      </div>
    )
  }

  // Função auxiliar para obter cor do power-up baseado na raridade
  const getPowerUpColor = (raridade: string | null) => {
    switch (raridade) {
      case 'lendario':
        return 'bg-[#FF00FF]/20 text-[#FF00FF]'
      case 'epico':
        return 'bg-[#9D00FF]/20 text-[#9D00FF]'
      case 'raro':
        return 'bg-[#00FFFF]/20 text-[#00FFFF]'
      default:
        return 'bg-[#FFD700]/20 text-[#FFD700]'
    }
  }

  // Função auxiliar para obter ícone do power-up
  const getPowerUpIcon = (nome: string) => {
    if (nome.toLowerCase().includes('dica')) return 'lightbulb'
    if (nome.toLowerCase().includes('proteção') || nome.toLowerCase().includes('sequência'))
      return 'shield'
    if (nome.toLowerCase().includes('pulo')) return 'skip_next'
    if (nome.toLowerCase().includes('dobro') || nome.toLowerCase().includes('xp')) return 'double_arrow'
    return 'star'
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark overflow-x-hidden text-text-dark">
      {/* Header */}
      <div className="flex items-center p-4 pb-2 justify-between sticky top-0 bg-background-dark z-10">
        <div className="flex size-12 shrink-0 items-center justify-start">
          <button onClick={() => router.back()}>
            <span className="material-symbols-outlined text-white text-2xl">arrow_back</span>
          </button>
        </div>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Loja de Recompensas
        </h2>
        <div className="flex w-auto items-center justify-end">
          <div className="flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1.5">
            <span className="material-symbols-outlined text-[#FFD700] text-xl">
              monetization_on
            </span>
            <p className="text-white text-base font-bold leading-normal tracking-[0.015em] shrink-0">
              {coins.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[72px] bg-background-dark z-10">
        <div className="flex border-b border-white/20 px-4 gap-4 overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setActiveTab('avatar')}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors ${
              activeTab === 'avatar'
                ? 'border-b-primary text-primary'
                : 'border-b-transparent text-white/60'
            }`}
          >
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">
              Roupas para o Avatar
            </p>
          </button>
          <button
            onClick={() => setActiveTab('coruja')}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors ${
              activeTab === 'coruja'
                ? 'border-b-primary text-primary'
                : 'border-b-transparent text-white/60'
            }`}
          >
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">
              Acessórios para a Coruja
            </p>
          </button>
          <button
            onClick={() => setActiveTab('powerups')}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors ${
              activeTab === 'powerups'
                ? 'border-b-primary text-primary'
                : 'border-b-transparent text-white/60'
            }`}
          >
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">
              Power-ups para Lições
            </p>
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-4 py-4 overflow-y-auto">
        {activeTab === 'avatar' && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-4">
            {avatarItems.length > 0 ? (
              avatarItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 pb-3 cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg bg-white/5 relative"
                  style={{
                    backgroundImage: item.imagem_url ? `url('${item.imagem_url}')` : undefined,
                    backgroundColor: item.imagem_url ? undefined : '#2D3748',
                  }}
                >
                  {item.equipado && (
                    <div className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-primary">
                      <span className="material-symbols-outlined text-background-dark text-base">
                        check
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-white text-base font-medium leading-normal">{item.nome}</p>
                  {item.possui ? (
                    <p className="text-gray-400 text-sm font-normal leading-normal">Comprado</p>
                  ) : (
                    <div className="flex items-center gap-1">
                      {item.preco_moedas > 0 && (
                        <>
                          <span className="material-symbols-outlined text-[#FFD700] text-base">
                            monetization_on
                          </span>
                          <p className="text-white/80 text-sm font-normal leading-normal">
                            {item.preco_moedas}
                          </p>
                        </>
                      )}
                      {item.preco_pontos > 0 && (
                        <>
                          <span className="material-symbols-outlined text-primary text-base">
                            star
                          </span>
                          <p className="text-white/80 text-sm font-normal leading-normal">
                            {item.preco_pontos}
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
            ) : (
              <EmptyState
                icon="face"
                title="Nenhum item de avatar disponível"
                description="Não há itens de avatar cadastrados no momento."
              />
            )}
          </div>
        )}

        {activeTab === 'coruja' && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-4">
            {owlAccessories.length > 0 ? (
              owlAccessories.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 pb-3 cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <div
                    className={`w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg relative ${
                      item.equipado ? 'border-4 border-[#50E3C2]' : ''
                    }`}
                    style={{
                      backgroundImage: item.imagem_url ? `url('${item.imagem_url}')` : undefined,
                      backgroundColor: item.imagem_url ? undefined : '#2D3748',
                    }}
                  >
                    {item.possui && (
                      <div className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-[#50E3C2]">
                        <span className="material-symbols-outlined text-[#1D2B53] text-base">
                          check
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-white text-base font-medium leading-normal">{item.nome}</p>
                    {item.possui ? (
                      <p className="text-[#B0B0B0] text-sm font-normal leading-normal">Comprado</p>
                    ) : (
                      <div className="flex items-center gap-1">
                        {item.preco_moedas > 0 && (
                          <p className="text-[#FFD700] text-sm font-normal leading-normal">
                            🪙 {item.preco_moedas}
                          </p>
                        )}
                        {item.preco_pontos > 0 && (
                          <p className="text-primary text-sm font-normal leading-normal">
                            ⭐ {item.preco_pontos}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon="pets"
                title="Nenhum acessório de coruja disponível"
                description="Não há acessórios para a coruja cadastrados no momento."
              />
            )}
          </div>
        )}

        {activeTab === 'powerups' && (
          <div className="flex flex-col gap-3 pb-8">
            <h1 className="text-white tracking-tight text-[32px] font-bold leading-tight text-left pb-3 pt-6">
              Power-ups para Lições
            </h1>
            {powerUps.length > 0 ? (
              powerUps.map((powerUp) => {
                const color = getPowerUpColor(powerUp.raridade)
                const icon = getPowerUpIcon(powerUp.nome)
                const precoTotal = powerUp.preco_moedas + powerUp.preco_pontos
                const podeComprar =
                  (powerUp.preco_moedas === 0 || coins >= powerUp.preco_moedas) &&
                  (powerUp.preco_pontos === 0 || pontos >= powerUp.preco_pontos)

                return (
                  <div
                    key={powerUp.id}
                    className="flex gap-4 bg-white/5 p-4 justify-between rounded-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex items-center justify-center rounded-lg shrink-0 size-12 ${color}`}
                      >
                        <span className="material-symbols-outlined text-3xl">{icon}</span>
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <p className="text-white text-base font-bold leading-normal">
                          {powerUp.nome}
                        </p>
                        <p className="text-gray-400 text-sm font-normal leading-normal mt-1">
                          {powerUp.descricao || 'Power-up especial para lições'}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {powerUp.possui ? (
                        <button
                          disabled
                          className="flex min-w-[84px] cursor-not-allowed items-center justify-center gap-1 overflow-hidden rounded-full h-10 px-4 bg-green-600/50 text-white text-sm font-bold leading-normal w-fit"
                        >
                          <span className="material-symbols-outlined text-lg">check</span>
                          <span className="truncate">Possui</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuy(powerUp)}
                          disabled={!powerUp.ativo || !podeComprar}
                          className="flex min-w-[84px] cursor-pointer items-center justify-center gap-1 overflow-hidden rounded-full h-10 px-4 bg-primary text-white text-sm font-bold leading-normal w-fit transition-transform hover:scale-105 active:scale-95 disabled:bg-gray-500/50 disabled:text-white/70 disabled:cursor-not-allowed"
                        >
                          {powerUp.preco_moedas > 0 && (
                            <>
                              <span className="material-symbols-outlined text-lg">monetization_on</span>
                              <span className="truncate">{powerUp.preco_moedas}</span>
                            </>
                          )}
                          {powerUp.preco_pontos > 0 && (
                            <>
                              <span className="material-symbols-outlined text-lg">star</span>
                              <span className="truncate">{powerUp.preco_pontos}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <EmptyState
                icon="auto_awesome"
                title="Nenhum power-up disponível"
                description="Não há power-ups cadastrados no momento."
              />
            )}
          </div>
        )}
      </main>

      {/* Action Buttons (when item selected) */}
      {selectedItem && activeTab !== 'powerups' && (
        <footer className="sticky bottom-0 flex justify-stretch gap-4 p-4 border-t border-t-white/10 bg-background-dark">
          {selectedItem.possui ? (
            <Button
              onClick={() => handleEquip(selectedItem)}
              className="flex-1 bg-primary text-background-dark h-14"
            >
              {selectedItem.equipado ? 'Desequipar' : 'Equipar'}
            </Button>
          ) : (
            <>
              <Button
                onClick={() => setSelectedItem(null)}
                className="flex-1 bg-white/20 text-white h-14"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handleBuy(selectedItem)}
                disabled={
                  (selectedItem.preco_moedas > 0 && coins < selectedItem.preco_moedas) ||
                  (selectedItem.preco_pontos > 0 && pontos < selectedItem.preco_pontos)
                }
                className="flex-1 bg-primary text-background-dark h-14 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Comprar{' '}
                {selectedItem.preco_moedas > 0 && `🪙${selectedItem.preco_moedas}`}
                {selectedItem.preco_moedas > 0 && selectedItem.preco_pontos > 0 && ' + '}
                {selectedItem.preco_pontos > 0 && `⭐${selectedItem.preco_pontos}`}
              </Button>
            </>
          )}
        </footer>
      )}

      {/* Modals */}
      <ConfirmPurchaseModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmPurchase}
        item={selectedItem}
        isProcessing={isProcessing}
      />

      <PurchaseSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        itemName={selectedItem?.nome}
        itemImage={selectedItem?.imagem_url}
      />

      {/* Mascot */}
      <div className="fixed bottom-4 right-4 w-24 h-24 md:w-32 md:h-32 pointer-events-none z-0">
        <Image
          alt="Mascote coruja animada olhando para os itens da loja"
          className="w-full h-full object-contain"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMNGdCtVVdIkMhtXeyYE07jsgP36tCFeV0FjtIyj64qA23dedYvWIi2wioAOVBuqkwvEtnuRqL3Gv1JKwpBf2XOnzjokKZSG7q_nRneVbiDzyvuZowQg9EADnyCs41GM5wBiSYG4QFLy3j40O1jhHMoCOD-sjnYPA7Zs5_K0SEjiuNAi-YFvtRVZTwjJKVIEvT-skF2e3cisP4LBTgNzb60s30oyaW7B509wgloaSLV6joI8o7JrJ_s8OTqi3Q9xYQGG9djQ1JYixF"
          width={128}
          height={128}
          unoptimized
        />
      </div>
    </div>
  )
}

