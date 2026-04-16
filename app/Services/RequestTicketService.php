<?php

namespace App\Services;

use App\Models\User;
use App\Models\Department;
use App\Models\Area;
use App\Models\Division;
use App\Models\HelpTopic;
use App\Models\Ticket;
use App\Models\Status;
use App\Models\Priority;
use Illuminate\Support\Facades\DB;
use Exception;

use Illuminate\Support\Facades\Auth;

class RequestTicketService 
{
public function save(array $data)
{
    return DB::transaction(function () use ($data) {

        $ticket = Ticket::create([
            'code' => 'TCK-' . strtoupper(uniqid()),
            'email' => auth()->User::where()->email,
            'subject' => $data['subject'],
            'message' => $data['message'],
            'attach' => $data['attach'] ?? null,
            'requesting_user' => Auth::id(),
            'department_id' => $data['department_id'],
            'division_id' => $data['division_id'],
            'help_topic_id' => $data['help_topic_id'],
            'status_id' => Status::getDefaultId(),
            'creation_date' => now(),
        ]);

        return $ticket;
    });
}}

