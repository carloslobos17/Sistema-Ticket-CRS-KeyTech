<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ticket extends Model
{
    protected $fillable = [
        'code',
        'creation_date',
        'email',
        'subject',
        'message',
        'attach',
        'expiration_date',
        'closing_date',
        'requesting_user',
        'assigned_user',
        'help_topic_id',
        'priority_id',
        'sla_plan_id',
        'department_id',
        'status_id'
    ];

    public function requestingUser():BelongsTo
    {
        return $this->belongsTo(User::class, 'requesting_user');
    }

    // Relación con el usuario asignado (puede ser null)
    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user');
    }

    // Relación con HelpTopic
    public function helpTopic(): BelongsTo
    {
        return $this->belongsTo(HelpTopic::class); // asume 'help_topic_id'
    }

    // Relación con Priority
    public function priority():BelongsTo
    {
        return $this->belongsTo(Priority::class); // asume 'priority_id'
    }

    // Relación con SlaPlan
    public function slaPlan(): BelongsTo
    {
        return $this->belongsTo(SlaPlan::class); // asume 'sla_plan_id'
    }

    // Relación con Department
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class); // asume 'department_id'
    }

    // Relación con Status
    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class); // asume 'status_id'
    }

    public function qualifications():HasMany
    {
        return $this->hasMany(Qualification::class);
    }

    public function ticketSolutions(): HasMany
    {
        return $this->hasMany(TicketSolution::class);
    }

    public function histories():HasMany
    {
        return $this->hasMany(TicketHistory::class)->orderBy('created_at', 'desc');
    }
}
