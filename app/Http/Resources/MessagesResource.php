<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessagesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "text"     =>   $this->text,
            "updated_at" => $this->updated_at,
            "id"       =>  $this->id,
            "is_sender"  =>  $this->user_id === auth()->user()->id,
            "user"
        ];
    }
}
