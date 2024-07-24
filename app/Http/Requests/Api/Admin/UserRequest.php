<?php

namespace App\Http\Requests\Api\Admin;

use App\Enums\UserGenderEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {

        return [
            'phone_number' => ['required', 'max:11'],
            'first_name'   => ['string'],
            'last_name'    => ['string'],
            'gender'       => ['string'],
            'code_meli'    => ['max:10', 'min:10'],
            'email'        => ['string', 'email']
        ];
    }
}
