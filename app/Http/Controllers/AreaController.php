<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Http\Requests\SaveAreaRequest;
use App\Services\AreaService;
use Inertia\Inertia;
use Exception;

class AreaController extends Controller
{
    protected $areaService;

    public function __construct(AreaService $areaService)
    {
        $this->areaService = $areaService;
    }

    public function index()
    {
        return Inertia::render('areas/index', [
            'areas' => $this->areaService->getAllAreas()
        ]);
    }

    public function create()
    {
        // Buena práctica: usar nombres en minúsculas para evitar errores 404 en servidores Linux
        return Inertia::render('areas/create');
    }

    public function store(SaveAreaRequest $request)
    {
        try {
            $this->areaService->createArea($request->validated());

            return redirect()->route('areas.index')
                ->with('success', 'Área creada correctamente.');
        } catch (Exception $e) {
            return redirect()->back()
                ->with('error', 'Error al crear el área: ' . $e->getMessage());
        }
    }

    public function show(Area $area)
    {
        // Estructura lista por si en el futuro se necesita ver el detalle de un área
        return Inertia::render('areas/show', [
            'area' => $area
        ]);
    }

    public function edit(Area $area)
    {
        return Inertia::render('areas/edit', [
            'area' => $area
        ]);
    }

    public function update(SaveAreaRequest $request, Area $area)
    {
        try {
            $this->areaService->updateArea($area, $request->validated());

            return redirect()->route('areas.index')
                ->with('success', 'Área actualizada correctamente.');
        } catch (Exception $e) {
            return redirect()->back()
                ->with('error', 'Error al actualizar el área: ' . $e->getMessage());
        }
    }

    public function destroy(Area $area)
    {
        try {
            $this->areaService->deleteArea($area);

            return redirect()->route('areas.index')
                ->with('success', 'Área eliminada correctamente.');

        } catch (Exception $e) {
            return redirect()->route('areas.index')
                ->with('error', $e->getMessage());
        }
    }
}
