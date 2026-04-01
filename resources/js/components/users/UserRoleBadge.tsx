import { type Role } from '@/types/role';

interface Props {
    role: Role;
}

const getRoleColor = (roleName: string): string => {
    switch (roleName.toLowerCase()) {
        case 'admin':
            return 'bg-purple-100 text-purple-700 border-purple-200';
        case 'agent':
            return 'bg-blue-100 text-blue-700 border-blue-200';
        default:
            return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

export default function UserRoleBadge({ role }: Props) {
    return <span className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getRoleColor(role.name)}`}>{role.name}</span>;
}
