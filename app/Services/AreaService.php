<?php

namespace App\Services;

use App\Models\Area;
use Exception;

class AreaService
{
    /**
     * Obtiene todas las áreas ordenadas por las más recientes.
     */
    public function getAllAreas()
    {
        return Area::latest()->get();
    }

    /**
     * Crea una nueva área en la base de datos.
     */
    public function createArea(array $data): Area
    {
        // Buscamos si el área existe, incluso entre las eliminadas (Soft Deletes)
        $area = Area::withTrashed()->where('name', $data['name'])->first();

        if ($area) {
            // Si el área existe y está eliminada, la revivimos
            if ($area->trashed()) {
                $area->restore();
            }

            $area->update($data);

            return $area;
        }

        return Area::create($data);
    }

    /**
     * Actualiza un área existente.
     */
    public function updateArea(Area $area, array $data): bool
    {
        return $area->update($data);
    }

    /**
     * Elimina un área aplicando reglas de integridad referencial.
     * * @throws Exception Si el área tiene departamentos asociados.
     */
    public function deleteArea(Area $area): void
    {
        if ($area->tickets()->count() > 0) {
            throw new Exception('No se puede eliminar esta área porque existen tickets registrados en sus departamentos.');
        }

        if ($area->departments()->count() > 0) {
            throw new Exception('No se puede eliminar esta área porque tiene departamentos asociados.');
        }

        $area->delete(); // Ejecuta el Soft Delete
    }
}
