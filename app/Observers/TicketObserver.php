<?php

namespace App\Observers;

use App\Enums\ActionTypeEnum;
use App\Models\Ticket;
use App\Models\TicketHistory;
use App\Enums\TicketActionType;
use Illuminate\Support\Facades\Auth;

class TicketObserver
{
    /**
     * Se ejecuta cuando un ticket es creado por primera vez.
     */
    public function created(Ticket $ticket): void
    {
        TicketHistory::create([
            'ticket_id'   => $ticket->id,
            'user_id'     => Auth::id() ?? $ticket->usuarios_id_solicitante,
            'action_type' => ActionTypeEnum::CREATED,
            'internal_note' => 'Ticket creado en el sistema.',
        ]);
    }

    /**
     * Se ejecuta cada vez que se hace un $ticket->save() y hay cambios.
     */
    public function updated(Ticket $ticket): void
    {
        $userId = Auth::id() ?? 1; // 1 como fallback temporal para pruebas

        // 1. ¿Cambió el estado?
        if ($ticket->wasChanged('estado_id')) {
            TicketHistory::create([
                'ticket_id' => $ticket->id,
                'user_id' => $userId,
                'action_type' => ActionTypeEnum::STATUS_CHANGED,
                'internal_note' => "Estado cambiado del ID {$ticket->getOriginal('estado_id')} al {$ticket->estado_id}"
            ]);
        }

        // 2. ¿Se asignó a un técnico distinto?
        if ($ticket->wasChanged('usuarios_id_asignado')) {
            TicketHistory::create([
                'ticket_id' => $ticket->id,
                'user_id' => $userId,
                'action_type' => ActionTypeEnum::ASSIGNED,
                'assigned_user' => $ticket->usuarios_id_asignado,
            ]);
        }

        // 3. ¿Se transfirió de departamento?
        if ($ticket->wasChanged('departamentos_id')) {
            TicketHistory::create([
                'ticket_id' => $ticket->id,
                'user_id' => $userId,
                'action_type' => ActionTypeEnum::DEPARTMENT_TRANSFERRED,
                // getOriginal() nos da el valor que tenía antes de guardar
                'previous_department' => $ticket->getOriginal('departamentos_id'),
                'new_department' => $ticket->departamentos_id,
            ]);
        }
    }
}
