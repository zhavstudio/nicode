<?php

namespace App\Http\Resources\Api\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Morilog\Jalali\CalendarUtils;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'amount'    => number_format(intval($this->amount), 0, '.', ',') ,
            'status'    => $this->status->description,
            "created_at" => CalendarUtils::strftime('Y-m-d', strtotime($this->created_at))
        ];
    }
}
