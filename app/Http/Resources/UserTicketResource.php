<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Morilog\Jalali\CalendarUtils;

class UserTicketResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"         => $this->id,
            "user"       => $this->user->phone_number,
            "title"      => $this->title,
            "priority"   => $this->priority->description,
            "status"     => $this->status->description,
            "rate"       => $this->rete,
            "feedback"   => $this->feedback,
            "created_at" => CalendarUtils::strftime('Y-m-d', strtotime($this->created_at)),
            "updated_at" => CalendarUtils::strftime('Y-m-d,h:i:s', strtotime($this->updated_at)),
            "message"    => $this->messages
        ];
    }
}
