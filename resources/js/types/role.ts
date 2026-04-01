// resources/js/types/role.ts

export type RoleName = 'admin' | 'agent' | 'user';

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at?: string;
    updated_at?: string;
    pivot?: {
        model_type: string;
        model_id: number;
        role_id: number;
    };
}
