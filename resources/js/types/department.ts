export interface DepartmentBasic {
    id: number;
    name: string;
}

export interface Department extends DepartmentBasic {
    description: string | null;
    email_department: string | null;
    area_id: number | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}
