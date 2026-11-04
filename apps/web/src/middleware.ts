import { NextRequest, NextResponse } from 'next/server';

// Rotas que exigem autenticação
const PROTECTED_ROUTES = ['/dashboard', '/colecao', '/perfil', '/cartas'];

// Rotas que só usuário NÃO autenticado deve ver
const AUTH_ROUTES = ['/entrar', '/cadastro', '/esqueci-senha', '/resetar-senha'];

const REFRESH_COOKIE = 'cns.refresh_token';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Como o refresh token está em localStorage (não cookie), o middleware
  // do Next NÃO consegue verificá-lo server-side. Por isso, usamos esse
  // middleware apenas como esqueleto por enquanto; a proteção real
  // acontece client-side via AuthGuard component.
  //
  // Débito técnico: quando migrarmos para httpOnly cookie (Fase 7),
  // este middleware vai conseguir validar sessão aqui mesmo.

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match em todas as rotas exceto:
     * - api (API routes)
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
