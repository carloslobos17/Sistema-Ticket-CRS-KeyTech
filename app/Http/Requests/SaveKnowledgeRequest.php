<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaveKnowledgeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:100'],
            'content_response' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'creation_date' => ['required', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'El título es obligatorio.',
            'title.string' => 'El título debe ser una cadena de texto.',
            'title.max' => 'El título no puede superar los 100 caracteres.',
            'content_response.required' => 'La respuesta es obligatoria.',
            'content_response.string' => 'La respuesta debe ser una cadena de texto.',
            'content_response.max' => 'La respuesta no puede superar los 255 caracteres.',
            'category_id.required' => 'Debes seleccionar una categoría.',
            'category_id.exists' => 'La categoría seleccionada no es válida.',
            'creation_date.required' => 'La fecha de creación es obligatoria.',
            'creation_date.date' => 'La fecha de creación no tiene un formato válido.',
        ];
    }
}
