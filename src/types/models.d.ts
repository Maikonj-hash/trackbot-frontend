// web/src/types/models.d.ts

export interface PaginationMeta {
    total: number;
    page: number;
    totalPages: number;
}

export interface Instance {
    id: string;
    name: string;
    phone: string | null;
    flowId: string | null;
    provider: "BAILEYS" | "META_OFFICIAL";
    status: string;
    isConnected: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Cliente {
    id: string;
    name: string | null;
    phone: string;
    metadata: any; // Mantido restrito ao invés de strict unknown por causa de JSONs variáveis
    instanceId: string | null;
    instance?: Instance;
    createdAt: string;
    updatedAt: string;
}

export interface DashboardMetrics {
    totalUsers: number;
    totalInstances: number;
    totalMessages: number;
}

export interface Flow {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}
