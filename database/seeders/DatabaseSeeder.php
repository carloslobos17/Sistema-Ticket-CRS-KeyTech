<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Area;
use App\Models\Department;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $area = Area::factory()->create([
            'name' => 'Administrativa',
            'description' => 'Área encargada de la gestión administrativa',
        ]);

        $department = Department::factory()->create([
            'name' => 'Administración',
            'description' => 'Departamento de administración general',
            'email_department' => 'admin@empresa.com',
            'area_id' => $area->id,
        ]);


        User::factory()->create([
            'name' => 'Admin Admin',
            'email' => 'admin@admin.com',
            'phone_number' => '00000000',
            'ext' => null,
            'birthdate' => '1990-01-01',
            'password' => Hash::make('123'),
            'is_active' => true,
            'department_id' => $department->id,
            'email_verified_at' => now(),
        ]);


    }
}
