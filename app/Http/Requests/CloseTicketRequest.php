<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class CloseTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Solo el dueño del ticket puede cerrarlo y calificarlo
        return $this->route('ticket')->requesting_user === $this->user()->id;
    }

    public function rules(): array
    {
        return [
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ];
    }
}
