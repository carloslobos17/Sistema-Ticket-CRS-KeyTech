import type { Department } from './department';
import type { Role, RoleName } from './role';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    phone_number: string;
    ext: number | null;
    birthdate: string;
    is_active: boolean;
    department_id: number | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;

    department?: Department;
    roles?: Role[];

    [key: string]: unknown;
}

// ─── Base compartida (sin password) ─────────────────────────────────────────

type BaseUserForm = {
    name: string;
    email: string;
    phone_number: string;
    ext: number | null;
    birthdate: string;
    department_id: number | null;
    role: RoleName | '';
};

// ─── Formulario de creación (password obligatorio) ───────────────────────────

export type UserFormData = BaseUserForm & {
    password: string;
};



export type UpdateUserFormData = BaseUserForm & {
    password: string;
};

// ─── Props del index ─────────────────────────────────────────────────────────

export interface UserIndexProps {
    users: User[];
    departments: Department[];
    roles: RoleName[];
}


