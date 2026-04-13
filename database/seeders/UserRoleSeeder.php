<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserRoleSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Definir todos los permisos necesarios
        $permissions = [
            // Prioridades
            'crear prioridad',
            'editar prioridad',
            'eliminar prioridad',
            // Planes SLA
            'crear plan_sla',
            'editar plan_sla',
            'eliminar plan_sla',
            // Otros que necesites
            'ver dashboard',
            'gestionar usuarios',
        ];

        // Crear cada permiso si no existe
        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
        }

        // Obtener el rol admin (debe existir, lo creaste en DatabaseSeeder)
        $adminRole = Role::findByName('admin');

        // Asignar TODOS los permisos al admin
        $adminRole->syncPermissions($permissions);

        // Opcional: asignar algunos permisos a otros roles
        $agentRole = Role::findByName('agent');
        $agentRole->syncPermissions([
            'crear prioridad',
            'ver dashboard',
        ]);
    }
}
