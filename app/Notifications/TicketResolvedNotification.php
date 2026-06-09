<?php

namespace App\Notifications;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TicketResolvedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $ticket;

    /**
     * Create a new notification instance.
     */
    public function __construct(Ticket $ticket)
    {
        $this->ticket = $ticket;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via($notifiable): array
    {
        // Por ahora solo base de datos (campanita web)
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        $url = route('tickets.show', $this->ticket->id) . '?rating=true'; 

        return (new MailMessage)
            ->subject('Ticket resuelto: ' . $this->ticket->code)
            ->line('Tu ticket ha sido resuelto.')
            ->line('Asunto: ' . $this->ticket->subject)
            ->line('Solicitante: ' . $this->ticket->requestingUser->name)
            ->action('Calificar solución', $url)
            ->line('Por favor, revísalo para la calificación de la solución.');
    }

    /**
     * Get the array representation of the notification for database storage.
     *
     * @return array<string, mixed>
     */
    public function toDatabase($notifiable): array
    {
        return [
            'ticket_id' => $this->ticket->id,
            'ticket_code' => $this->ticket->code,
            'subject' => $this->ticket->subject,
            'message' => "Tu ticket #{$this->ticket->code} ha sido resuelto. Por favor, revísalo para la calificación de la solución.",
            'type' => 'ticket_resolved',
            'url' => route('tickets.show', $this->ticket->id) . '?rating=true',
        ];
    }
}
