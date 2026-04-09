<?php

namespace App\Services;

use App\Models\User;
use App\Models\Department;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserService
{
    /**
     * Obtener todos los usuarios con sus relaciones.
     */
    public function getAllUsers()
    {
        return User::with('department', 'roles')->latest()->get();
    }

    /**
     * Obtener lista de departamentos (id, name).
     */
    public function getDepartmentsList()
    {
        return Department::all(['id', 'name']);
    }

    /**
     * Obtener lista de nombres de roles.
     */
    public function getRolesList()
    {
        return Role::pluck('name');
    }

    /**
     * Crear un nuevo usuario y asignarle rol.
     */
    public function createUser(array $data): User
    {
        $data['is_active'] = true;
        $user = User::create($data);
        $user->assignRole($data['role']);

        return $user;
    }

    /**
     * Actualizar un usuario existente y sincronizar su rol.
     */
    public function updateUser(User $user, array $data): User
    {
        if (empty($data['password'])) {
            unset($data['password']);
        }
        $user->update($data);

        if (isset($data['role'])) {
            $user->syncRoles($data['role']);
        }
        return $user->fresh();
    }

    /**
     * Eliminar un usuario.
     */
    public function deleteUser(User $user): void
    {
        $user->delete();
    }

    /**
     * Obtener un usuario con sus relaciones para editar/mostrar.
     */
    public function getUserWithRelations(User $user): User
    {
        return $user->load('department', 'roles');
    }
}
