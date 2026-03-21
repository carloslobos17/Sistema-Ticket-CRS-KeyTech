<?php

namespace Database\Factories;

use App\Models\Area;
use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Department>
 */
class DepartmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->company(), // nombre único de departamento
            'description' => $this->faker->paragraphs(2, true), // texto de descripción no nulo
            'email_department' => $this->faker->unique()->companyEmail(), // email corporativo
            'area_id' => Area::factory(), // crea un área automáticamente
        ];
    }
}
