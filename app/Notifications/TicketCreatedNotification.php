<?php

namespace App\Notifications;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TicketCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $ticket;

    public function __construct(Ticket $ticket)
    {
        $this->ticket = $ticket;
    }

    // Canales por los que se envía: mail y database
    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    // Detalles para el correo electrónico
    public function toMail($notifiable)
    {
        $url = route('tickets.show', $this->ticket->id);

        return (new MailMessage)
            ->subject('Confirmación de Ticket: ' . $this->ticket->code)
            ->greeting('Hola ' . $notifiable->name)
            ->line('Hemos recibido tu solicitud de soporte.')
            ->line('Asunto: ' . $this->ticket->subject)
            ->line('Número de Ticket: ' . $this->ticket->code)
            ->action('Ver estado de mi ticket', $url)
            ->line('Te notificaremos cuando haya una actualización sobre tu caso.');
    }

    // Datos que se guardan en la tabla notifications (BD)
    public function toDatabase($notifiable)
    {
        return [
            'ticket_id' => $this->ticket->id,
            'ticket_code' => $this->ticket->code,
            'subject' => $this->ticket->subject,
            'message' => "Tu ticket #{$this->ticket->code} ha sido creado exitosamente.",
            'type' => 'ticket_created',
            'url' => route('tickets.show', $this->ticket->id),
        ];
    }
}
