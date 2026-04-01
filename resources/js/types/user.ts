import { FormDataConvertible } from '@inertiajs/core';
import { Department } from './department';
import { Role, RoleName } from './role';

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    phone_number: string;
    ext: string | null;
    birthdate: string;
    is_active: number; // En el JSON viene como 1 o 0
    department_id: number | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;

    department?: Department;
    roles?: Role[];

    [key: string]: unknown; // Permite propiedades extra de Inertia
}

// Tipo específico para el Formulario (useForm)
export interface UserFormData {
    name: string;
    email: string;
    password: string;
    phone_number: string;
    ext: string | null;
    birthdate: string;
    department_id: number | null;
    role: RoleName | '';

    [key: string]: FormDataConvertible;
}


export interface UserIndexProps {
    users: User[];
    departments: Department[];
    roles: string[];
}
