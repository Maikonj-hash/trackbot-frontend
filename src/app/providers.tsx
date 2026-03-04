"use client";

// Vamos criar um React Query Provider limpo ou contexto de API futuramente.
// Por ora as Providers master do estado da aplicação repassam os nós abaixo.
export function Providers({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
