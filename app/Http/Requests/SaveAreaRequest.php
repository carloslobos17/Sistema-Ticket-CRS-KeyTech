<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule; // No olvides importar esta clase

class SaveAreaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $areaId = $this->route('area') ? $this->route('area')->id : null;

        return [
            'name' => [
                'required',
                'string',
                'max:75',
                Rule::unique('areas', 'name')->ignore($areaId)->whereNull('deleted_at'),
                'regex:/^(?=.*[\pL])[\pL\s0-9\-]+$/u'
            ],
            'description' => [
                'nullable',
                'string'
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del área es obligatorio.',
            'name.string'   => 'El formato del nombre no es válido.',
            'name.max'      => 'El nombre no puede superar los 75 caracteres.',
            'name.unique'   => 'Ya existe un área activa con este nombre registrada en el sistema.',
            'name.regex'    => 'El nombre debe contener al menos una letra y no permite símbolos especiales.',
        ];
    }
}
