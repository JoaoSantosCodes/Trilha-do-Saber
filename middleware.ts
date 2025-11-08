import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // Ignorar recursos estáticos e arquivos do Next.js ANTES de qualquer verificação
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/icon.svg') ||
    pathname.startsWith('/manifest.json') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|js|mjs|css|woff|woff2|ttf|eot|json)$/i)
  ) {
    return response
  }

  // Rotas públicas (não requerem autenticação)
  const publicRoutes = [
    '/login',
    '/cadastro',
    '/esqueci-senha',
    '/boas-vindas',
    '/',
  ]

  // Rotas protegidas por role
  const alunoRoutes = ['/aluno']
  const professorRoutes = ['/professor']
  const coordenadorRoutes = ['/coordenador']
  const paisRoutes = ['/pais']

  // Verificar se é rota pública
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'))

  // Se não está autenticado e tentando acessar rota protegida
  if (!session && !isPublicRoute) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Se está autenticado e tentando acessar rota de login/cadastro
  if (session && (pathname === '/login' || pathname === '/cadastro' || pathname === '/boas-vindas')) {
    // Redirecionar baseado no role
    const role = session.user.user_metadata?.role || 'aluno'
    let redirectPath = '/aluno/materias'

    if (role === 'professor') redirectPath = '/professor/painel'
    else if (role === 'coordenador') redirectPath = '/coordenador/painel'
    else if (role === 'pais') redirectPath = '/pais/painel'

    return NextResponse.redirect(new URL(redirectPath, req.url))
  }

  // Verificar permissões por role (se necessário)
  if (session) {
    const role = session.user.user_metadata?.role || 'aluno'

    // Aluno não pode acessar rotas de professor/coordenador/pais
    if (role === 'aluno') {
      if (
        pathname.startsWith('/professor') ||
        pathname.startsWith('/coordenador') ||
        pathname.startsWith('/pais')
      ) {
        return NextResponse.redirect(new URL('/aluno/materias', req.url))
      }
    }

    // Professor não pode acessar rotas de aluno/coordenador/pais
    if (role === 'professor') {
      if (
        pathname.startsWith('/aluno') ||
        pathname.startsWith('/coordenador') ||
        pathname.startsWith('/pais')
      ) {
        return NextResponse.redirect(new URL('/professor/painel', req.url))
      }
    }

    // Coordenador pode acessar tudo (mas vamos manter separado por enquanto)
    // Pais não pode acessar rotas de aluno/professor/coordenador
    if (role === 'pais') {
      if (
        pathname.startsWith('/aluno') ||
        pathname.startsWith('/professor') ||
        pathname.startsWith('/coordenador')
      ) {
        return NextResponse.redirect(new URL('/pais/painel', req.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/webpack (webpack chunks)
     * - api routes
     * - static files (images, fonts, etc.)
     * - favicon.ico
     * - manifest files
     */
    '/((?!_next/static|_next/image|_next/webpack|_next/data|api/|favicon.ico|icon.svg|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|js|mjs|css|woff|woff2|ttf|eot)$).*)',
  ],
}

