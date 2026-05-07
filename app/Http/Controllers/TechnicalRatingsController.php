<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Qualification;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Department;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TechnicalRatingsController extends Controller
{
    public function index(Request $request)
    {
        $stats = DB::table('technicalrating_stats')->orderByDesc('id')->first();

    if (!$stats) {
        return response()->json(['error' => 'Estadísticas no generadas aún'], 404);
    }

    $monthlyTrend = collect(json_decode($stats->monthly_trend, true));

    $targetYear = $request->input('year', now()->year);
    $targetMonth = $request->input('month', now()->month);

    $monthsCount = max(1, (int) $request->input('months_count', 7));

    //Calculamos la ventana de tiempo dinámicamente
    $endDate = Carbon::create($targetYear, $targetMonth, 1)->endOfMonth();
    
    // Si quiere 1 mes, restamos 0. Si quiere 7 meses, restamos 6.
    $monthsToSubtract = $monthsCount - 1; 
    $startDate = Carbon::create($targetYear, $targetMonth, 1)->subMonths($monthsToSubtract)->startOfMonth();

    // 5. Filtramos el historial
    $filteredTrend = $monthlyTrend->filter(function ($item) use ($startDate, $endDate) {
        $itemDate = Carbon::create($item['year'], $item['month_number'], 1);
        return $itemDate->between($startDate, $endDate);
    })
    ->sortBy(function ($item) {
        return Carbon::create($item['year'], $item['month_number'], 1)->timestamp;
    })
    ->values()
    ->all();

    return response()->json([
        'stats' => [
            'ratingAverage' => $stats->rating_average,
            'ticketsResolved' => $stats->tickets_resolved,
            'averageTime' => $stats->average_time,
            'activeTechnicians' => $stats->active_technicians,
        ],
        'techniciRankings' => json_decode($stats->technician_rankings),
        'monthlyTrend' => $filteredTrend,
        'distribution' => json_decode($stats->rating_distribution),
        'departmentPerformance' => json_decode($stats->department_performance),
        'updated_at' => $stats->updated_at
    ]);
    }
    
}
