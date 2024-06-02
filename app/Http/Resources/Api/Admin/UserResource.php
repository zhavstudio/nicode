<?php

namespace App\Http\Resources\Api\Admin;

use App\Enums\UserGenderEnum;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Morilog\Jalali\CalendarUtils;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'created_at'   => CalendarUtils::strftime('Y-m-d', strtotime($this->created_at)),
            'updated_at'   => CalendarUtils::strftime('Y-m-d', strtotime($this->updated_at)),
            'phone_number' => $this->phone_number,
            'code_meli'    => $this->code_meli,
            'status'       => $this->status->description,
        ];
    }
}
