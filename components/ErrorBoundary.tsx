'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import Button from './Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturou um erro:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-background-dark p-3 sm:p-4 safe-area-top safe-area-bottom">
          <div className="flex flex-col items-center gap-3 sm:gap-4 text-center max-w-md w-full px-3 sm:px-4">
            <span className="material-symbols-outlined text-red-400 text-4xl sm:text-6xl">error</span>
            <h2 className="text-white text-lg sm:text-xl font-bold break-words">Ops! Algo deu errado</h2>
            <p className="text-gray-400 text-xs sm:text-sm break-words">
              Ocorreu um erro inesperado. Por favor, tente novamente.
            </p>
            {this.state.error && (
              <details className="w-full mt-3 sm:mt-4 p-3 sm:p-4 bg-white/5 rounded-lg text-left">
                <summary className="text-gray-400 text-xs sm:text-sm cursor-pointer mb-2 touch-manipulation">
                  Detalhes do erro
                </summary>
                <pre className="text-red-400 text-[10px] sm:text-xs overflow-auto break-words whitespace-pre-wrap">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4 w-full">
              <Button 
                onClick={this.handleReset} 
                className="bg-primary text-background-dark h-11 sm:h-12 text-sm sm:text-base w-full sm:w-auto touch-manipulation"
              >
                Tentar Novamente
              </Button>
              <Button
                onClick={() => (window.location.href = '/')}
                className="bg-white/20 text-white h-11 sm:h-12 text-sm sm:text-base w-full sm:w-auto touch-manipulation"
              >
                Ir para Início
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

