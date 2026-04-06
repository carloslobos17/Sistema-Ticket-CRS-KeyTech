import type { DepartmentBasic } from './department';
import type { RoleName } from './role';
import type { User } from './user';

export interface UserModalBaseProps {
    isOpen: boolean;
    onClose: () => void;
    departments: DepartmentBasic[];
    roles: RoleName[];
}

export interface EditUserModalProps extends UserModalBaseProps {
    user: User | null;
}

export interface DeleteUserModalProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
}
