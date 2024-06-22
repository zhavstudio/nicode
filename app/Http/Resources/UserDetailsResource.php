<?php

namespace App\Http\Resources;

use App\Http\Resources\Api\User\TransactionResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserDetailsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'first_name'        => $this->first_name,
            'last_name'         => $this->last_name,
            'phone_number'      => $this->phone_number,
            'email'             => $this->email,
            'code_melli'        => $this->code_melli,
            'gender'            => $this->gender->description,
            'status'            => $this->status->description,
            'tickets'           => count($this->ticket()->get()),
            'open_tickets'      => count($this->ticket()->where("status", "<>", "closed")->get()),
            'pending_tickets'   => count($this->ticket()->where("status", "=", "pending")->get()),
            'close_tickets'     => count($this->ticket()->where("status", "=", "closed")->get()),
            'user_tickets'      => UserTicketResource::collection($this->ticket()->get()),
            'wallet'            => $this->wallet->total,
            'user_transactions' => TransactionResource::collection($this->wallet->transactions)
        ];
    }
}
