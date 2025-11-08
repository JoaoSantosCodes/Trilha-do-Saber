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
        <div className="flex min-h-screen items-center justify-center bg-background-dark p-4">
          <div className="flex flex-col items-center gap-4 text-center max-w-md">
            <span className="material-symbols-outlined text-red-400 text-6xl">error</span>
            <h2 className="text-white text-xl font-bold">Ops! Algo deu errado</h2>
            <p className="text-gray-400 text-sm">
              Ocorreu um erro inesperado. Por favor, tente novamente.
            </p>
            {this.state.error && (
              <details className="w-full mt-4 p-4 bg-white/5 rounded-lg text-left">
                <summary className="text-gray-400 text-sm cursor-pointer mb-2">
                  Detalhes do erro
                </summary>
                <pre className="text-red-400 text-xs overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div className="flex gap-3 mt-4">
              <Button onClick={this.handleReset} className="bg-primary text-background-dark">
                Tentar Novamente
              </Button>
              <Button
                onClick={() => (window.location.href = '/')}
                className="bg-white/20 text-white"
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

