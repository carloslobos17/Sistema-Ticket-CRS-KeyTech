<?php

namespace App\Services;

use App\Models\User;
use App\Models\Department;
use App\Models\Area;
use App\Models\Division;
use App\Models\HelpTopic;
use App\Models\Ticket;
use App\Models\Status;
use Illuminate\Support\Facades\DB;
use Exception;
use App\Models\Priority;

class RequestTicketService 
{
    public function save(array $data)
    {
        return DB::transaction(function () use ($data)
        {
            $user = User::where([
                'name' => $data['user']['name'],
                'phone_number' => $data['user']['phone_number'],
                'ext' => $data['user']['ext']
            ])->first();
            
            if (!$user) {
                throw new Exception('El usuario no existe');
            }

            $department = Department::where('name', $data['department']['name'])->first();

            if (!$department) {
                throw new Exception('El deparmento no existe');
            }

            $helpTopic = HelpTopic::where('name_topic', $data['helpTopic']['name_topic'])->first();

            if (!$helpTopic) {
                throw new Exception('Ese tema de ayuda no existe');
            }     

            $ticket = Ticket::create([
                'code' => 'TCK-' . strtoupper(uniqid()),
                'email' => $data['ticket']['email'],
                'subject' => $data['ticket']['subject'],
                'message' => $data['ticket']['message'],
                'attach' => $data['ticket']['attach'] ?? null,
                'requesting_user' => $user->id,
                'department_id' => $department->id,
                'help_topic_id' => $helpTopic->id,
                'status_id' => Status::getDefaultId(),
                'creation_date' => now(),
            ]);
            return $ticket;
        });
        
    }
}
