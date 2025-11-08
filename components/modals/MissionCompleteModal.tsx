'use client'

import Button from '@/components/Button'

interface MissionCompleteModalProps {
  isOpen: boolean
  onClose: () => void
  reward: string
  bonusCoins?: number
}

export default function MissionCompleteModal({
  isOpen,
  onClose,
  reward,
  bonusCoins = 200,
}: MissionCompleteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm">
      <div className="relative flex max-w-lg flex-col items-center justify-center rounded-xl bg-background-light dark:bg-background-dark shadow-2xl p-6">
        {/* Mascot Illustration */}
        <div className="relative w-full mb-4">
          <div
            className="absolute -top-16 -left-8 w-24 h-24 bg-center bg-no-repeat bg-contain"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDuKeVs9Fg3S3GyD0TXK0YI_OX9OaLKZX03RT37ywO-Nni-89r48AmyBIg38QT3Aecsm_aw3VO0ADN6bUSbplxzj4Lf7dUhGyWhrAEuvbq6drCBMh30qm9oTd74Guq_fwwr13Bl-0XNqSqWuIEWMq6Z4KTYGjZblTk0eoApPpYpvsx3yGFdFQDLMYLj7yXHdJmsLYscVVOhtH7sRiOSREli4b8qNbhdzEFCzxeQNgTpV426CV7vB5Wv69ypwTHHNlH1E8SvvshVTJdR')",
              transform: 'rotate(-15deg)',
            }}
          />
          <div
            className="absolute -top-12 -right-6 w-20 h-20 bg-center bg-no-repeat bg-contain"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuASuzGl_He2hDY36BEKkwpSqzUAg_kpSuP-ea8nbBFIs5GlTnDdTPhua1w_1KhRolG-_NGeNg8mhj1f6CSOH73dGeNHF0Kw5kXYVEV4EYHxyBydPJSlonAuDBqRURpd-yJ2TbDaFh-yNChiv88lltBKebwD1l9wD8ggU3oDZ_FlGIGlF_g26Aq_GF_-ba6wMk4EDjZxSqycfH3ivLsB441du6ERHpz3rGXt8BVQYyh86PdejFIcJv3xKf78bwujl76eMgPyPW7GV--S')"
            }}
          />
        </div>

        {/* Treasure Chest Illustration */}
        <div className="flex w-full grow justify-center pt-8">
          <div
            className="w-full max-w-[280px] bg-center bg-no-repeat bg-contain aspect-square flex"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBgrn6CWWUTE1n4HoLYOVwuQ4axp7mWsFSAoPuxI_PDS3h3rwTIwLwQxgf4_IeiHMx-wP1try5JmupqwAmm-2OYaUxSuqUvVQbZ98znEHwU_Und5_FuT8X_CW-PX8SyeZA3X0Q3dXFR5MM1J6pR786VjiS327oBDL4fqzMtcKwgnIfHN__JbhjBX6n_ThaEYgemVi2-CF1vRAu6QEv--KDGgM6RXH2SZ7UTvtq9C81YyIniY8vv_7vcmA-CY4krjlvRQoVBu2h0lMj8')"
            }}
          />
        </div>

        {/* HeadlineText */}
        <h1 className="text-slate-800 dark:text-white tracking-tight text-[32px] font-bold leading-tight px-4 text-center pb-2 pt-6 font-display">
          Você completou a Missão dos Pais!
        </h1>

        {/* BodyText */}
        <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-normal pb-4 pt-1 px-4 text-center font-display">
          Você ganhou um bônus de {bonusCoins} moedas!
        </p>

        {/* Card for Personalized Reward */}
        <div className="w-full px-4 pt-2 pb-4">
          <div className="flex flex-col items-stretch justify-start rounded-xl shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white dark:bg-slate-800 p-4">
            <p className="text-slate-800 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] font-display text-center">
              Seu prêmio especial!
            </p>
            <div className="flex items-end gap-3 justify-center pt-2">
              <p className="text-[#618989] dark:text-primary/80 text-base font-normal leading-normal text-center font-display">
                {reward}
              </p>
            </div>
          </div>
        </div>

        {/* SingleButton */}
        <div className="flex px-4 py-3 justify-center w-full">
          <Button
            onClick={onClose}
            className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 bg-primary text-slate-900 text-base font-bold leading-normal tracking-[0.015em] font-display"
          >
            <span className="truncate">Oba!</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

