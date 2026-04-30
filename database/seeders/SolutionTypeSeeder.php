<?php

namespace Database\Seeders;

use App\Models\SolutionType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SolutionTypeSeeder extends Seeder
{
    public function run(): void
    {
        $solutionTypes = [
            // Tipos para Hardware (Help Topic ID: 1)
            [
                'name' => 'Problema de Hardware',
                'description' => 'Falla en componentes físicos del equipo',
                'help_topic_id' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Falla de Componente',
                'description' => 'Componente específico dañado o defectuoso',
                'help_topic_id' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Mantenimiento de Equipo',
                'description' => 'Mantenimiento preventivo o correctivo',
                'help_topic_id' => 1,
                'is_active' => true,
            ],
            
            // Tipos para Software (Help Topic ID: 2)
            [
                'name' => 'Problema de Software',
                'description' => 'Falla en sistema o aplicaciones',
                'help_topic_id' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Error de Aplicación',
                'description' => 'Error específico en una aplicación',
                'help_topic_id' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Actualización Requerida',
                'description' => 'Necesita actualización de software',
                'help_topic_id' => 2,
                'is_active' => true,
            ],
            
            // Tipos para Red (Help Topic ID: 3)
            [
                'name' => 'Problema de Red',
                'description' => 'Conexión e internet',
                'help_topic_id' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Sin Conexión',
                'description' => 'Pérdida total de conectividad',
                'help_topic_id' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Lentitud de Red',
                'description' => 'Conexión lenta o intermitente',
                'help_topic_id' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($solutionTypes as $type) {
            SolutionType::firstOrCreate(
                ['name' => $type['name']],
                $type
            );
        }
    }
}
