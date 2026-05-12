<?php

namespace App\Http\Requests;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $category = $this->route('category');
        $categoryId = $category instanceof Category ? $category->id : $category;

        return [
            'name' => [
                'required',
                'string',
                'max:60',
                function ($attribute, $value, $fail) use ($categoryId) {
                    $exists = Category::withTrashed()
                        ->where('name', $value)
                        ->where('id', '!=', $categoryId)
                        ->first();

                    if ($exists) {
                        $exists->trashed()
                            ? $fail('Esta categoría está en la papelera. Ve a la sección de desactivados para restaurarla.')
                            : $fail('Ya existe otra categoría activa con este nombre.');
                    }
                },
                'regex:/^(?=.*[\pL])[\pL\s0-9\-]+$/u'
            ],
            'description' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre de la categoría es obligatorio.',
            'name.string' => 'El nombre debe ser una cadena de texto válida.',
            'name.max' => 'El nombre no puede superar los 60 caracteres.',
            'name.regex' => 'El nombre solo puede contener letras, números, espacios y guiones.',
            'description.string' => 'La descripción debe ser una cadena de texto.',
        ];
    }
}
