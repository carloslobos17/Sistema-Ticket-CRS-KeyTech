<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Area;
use App\Models\Department;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Definir y crear permisos (Granularidad del sistema)
        $permissions = [
            // --- SuperAdmin Permissions (Gestión Global) ---
            'manage_users',              // Crear, editar y desactivar usuarios del sistema
            'manage_roles_permissions',  // Configurar niveles de acceso y asignar permisos a roles
            'manage_catalogs',           // CRUD de Categorías, Prioridades, Estados y Knowledge
            'view_global_dashboard',     // Visualizar métricas y estadísticas de toda la institución
            'view_audit_logs',           // Revisar el historial de acciones importantes (Auditoría)

            // --- Admin Permissions (Gestión Operativa de Área) ---
            'manage_area_tickets',       // Cambiar prioridad, reasignar, dar seguimiento y cerrar tickets de su área
            'assign_tickets',            // Realizar la asignación inicial de un ticket a un técnico (Agent)
            'view_area_dashboard',       // Visualizar métricas específicas del departamento asignado

            // --- Agent Permissions (Ejecución Técnica) ---
            'view_assigned_tickets',     // Ver la lista de tickets que tiene asignados para trabajar
            'solve_tickets',             // Cambiar estados, comentar avances y marcar como resuelto
            'return_tickets',            // Devolver un ticket al Admin si no puede ser atendido por el técnico

            // --- User Permissions (Solicitante/Cliente) ---
            'create_tickets',            // Crear nuevas solicitudes de soporte en el sistema
            'view_own_tickets',          // Ver el estado, historial y responder en sus propios tickets
            'rate_tickets',              // Finalizar el ticket y realizar la calificación de estrellas (Qualification)
        ];

        foreach ($permissions as $permissionName) {
            // firstOrCreate previene duplicidad si ya existen en la DB
            Permission::firstOrCreate(['name' => $permissionName, 'guard_name' => 'web']);
        }

        // 2. Definir y crear Roles
        $superAdminRole = Role::firstOrCreate(['name' => 'superadmin', 'guard_name' => 'web']);
        $adminRole      = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $agentRole      = Role::firstOrCreate(['name' => 'agent', 'guard_name' => 'web']);
        $userRole       = Role::firstOrCreate(['name' => 'user', 'guard_name' => 'web']);

        // 3. Asignación de Permisos a Roles (Sincronización)

        // SuperAdmin: Control total
        $superAdminRole->syncPermissions(Permission::all());

        // Admin: Gestión operativa de su área + Dashboard de área
        $adminRole->syncPermissions([
            'manage_area_tickets',
            'assign_tickets',
            'view_area_dashboard',
            'create_tickets',
            'view_own_tickets'
        ]);

        // Agent: Ejecución técnica
        $agentRole->syncPermissions([
            'view_assigned_tickets',
            'solve_tickets',
            'return_tickets'
        ]);

        // User: Creación y seguimiento
        $userRole->syncPermissions([
            'create_tickets',
            'view_own_tickets',
            'rate_tickets'
        ]);

        // 4. Datos Maestros (Usando firstOrCreate para evitar duplicidad de Area/Depto)
        $area = Area::firstOrCreate(
            ['name' => 'Administrativa'],
            ['description' => 'Área encargada de la gestión administrativa']
        );

        $department = Department::firstOrCreate(
            ['name' => 'Administración'],
            [
                'description' => 'Departamento de administración general',
                'email_department' => 'admin@empresa.com',
                'area_id' => $area->id,
            ]
        );

        // 5. Crear o Actualizar el Super Usuario inicial
        $user = User::updateOrCreate(
            ['email' => 'admin@admin.com'], // Si este email existe, solo actualiza los datos
            [
                'name' => 'Super Administrador',
                'phone_number' => '00000000',
                'ext' => null,
                'birthdate' => '1990-01-01',
                'password' => Hash::make('123'),
                'is_active' => true,
                'department_id' => $department->id,
                'email_verified_at' => now(),
            ]
        );

        // asignamos nuevo rol de superadmin
        $user->syncRoles(['superadmin']);
    }
}
