<?php

namespace App\Http\Controllers;

use App\Models\SolutionType;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SolutionTypeController extends Controller
{
    public function index(): JsonResponse
    {
        $solutionTypes = SolutionType::where('is_active', true)
            ->with(['department', 'helpTopic'])
            ->orderBy('name')
            ->get();

        return response()->json($solutionTypes);
    }

    public function getByDepartment($departmentId): JsonResponse
    {
        $solutionTypes = SolutionType::where('is_active', true)
            ->where('department_id', $departmentId)
            ->with(['department', 'helpTopic'])
            ->orderBy('name')
            ->get();

        return response()->json($solutionTypes);
    }

    /**
     * Obtener tipos de diagnóstico por tema de ayuda
     */
    public function getByHelpTopic($helpTopicId): JsonResponse
    {
        $solutionTypes = SolutionType::where('is_active', true)
            ->where('help_topic_id', $helpTopicId)
            ->with(['department', 'helpTopic'])
            ->orderBy('name')
            ->get();

        return response()->json($solutionTypes);
    }
}
