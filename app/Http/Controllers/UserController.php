<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('department', 'roles')->latest()->get();
        $departments = Department::all(['id', 'name']);
        $roles = Role::pluck('name');

        return Inertia::render('users/index', [
            'users'       => $users,
            'departments' => $departments,
            'roles'       => $roles,
        ]);
    }

    public function create()
    {
        $departments = Department::all(['id', 'name']);
        $roles = Role::pluck('name');

        return Inertia::render('users/create', [
            'departments' => $departments,
            'roles'       => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'          => 'required|string',
            'email'         => 'required|email|unique:users',
            'password'      => 'required|min:8',
            'department_id' => 'required|exists:departments,id',
            'role'          => 'required|exists:roles,name',
        ]);

        $user = User::create([
            'name'          => $request->name,
            'email'         => $request->email,
            'phone_number'  => $request->phone_number ?? '00000000',
            'ext'           => $request->ext,
            'birthdate'     => $request->birthdate ?? now(),
            'password'      => $request->password,
            'department_id' => $request->department_id,
            'is_active'     => true,
        ]);

        $user->assignRole($request->role);

        return redirect()->route('users.index')
            ->with('success', 'Usuario creado correctamente');
    }

    public function show(User $user)
    {
        return Inertia::render('users/show', [
            'user' => $user->load('department', 'roles'),
        ]);
    }

    public function edit(User $user)
    {
        $departments = Department::all(['id', 'name']);
        $roles = Role::pluck('name');

        return Inertia::render('users/edit', [
            'user'        => $user->load('department', 'roles'),
            'departments' => $departments,
            'roles'       => $roles,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name'  => 'required|string',
            'email' => "required|email|unique:users,email,{$user->id}",
            'role'  => 'required|exists:roles,name',
        ]);

        $user->update($request->only([
            'name',
            'email',
            'phone_number',
            'ext',
            'birthdate',
            'department_id',
        ]));

        $user->syncRoles($request->role);

        return redirect()->route('users.index')
            ->with('success', 'Usuario actualizado');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'Usuario eliminado');
    }
}
