<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Services\UserService;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class UserController extends Controller implements HasMiddleware
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Define los middlewares directamente en el controlador.
     * Solo los usuarios con el permiso 'manage_users' pueden modificar datos.
     */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:manage_users', only: ['create', 'store', 'edit', 'update', 'destroy']),
        ];
    }

    public function index()
    {
        return Inertia::render('users/index', [
            'users'       => $this->userService->getAllUsers(),
            'departments' => $this->userService->getDepartmentsList(),
            'roles'       => $this->userService->getRolesList(),
        ]);
    }

    public function create()
    {
        return Inertia::render('users/create', [
            'departments' => $this->userService->getDepartmentsList(),
            'roles'       => $this->userService->getRolesList(),
        ]);
    }

    public function store(UserStoreRequest $request)
    {
        $this->userService->createUser($request->validated());

        return redirect()->route('users.index')
            ->with('success', 'Usuario creado correctamente');
    }

    public function show(User $user)
    {
        return Inertia::render('users/show', [
            'user' => $this->userService->getUserWithRelations($user),
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('users/edit', [
            'user'        => $this->userService->getUserWithRelations($user),
            'departments' => $this->userService->getDepartmentsList(),
            'roles'       => $this->userService->getRolesList(),
        ]);
    }

    public function update(UserUpdateRequest $request, User $user)
    {
        $this->userService->updateUser($user, $request->validated());

        return redirect()->route('users.index')
            ->with('success', 'Usuario actualizado correctamente');
    }

    public function destroy(User $user)
    {
        try {
            $this->userService->deleteUser($user);

            return redirect()->route('users.index')
                ->with('success', 'Usuario eliminado correctamente');

        } catch (\Exception $e) {
            // Atrapamos la excepción de seguridad del UserService
            return redirect()->route('users.index')
                ->with('error', $e->getMessage());
        }
    }
}
