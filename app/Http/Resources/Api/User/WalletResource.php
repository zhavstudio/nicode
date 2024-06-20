<?php

namespace App\Http\Resources\Api\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WalletResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'total' => number_format(intval($this->total), 0, '.', ',') ,
            'total_payments' => number_format(intval($this->total_successful_transactions), 0, '.', ',') ,
            'transactions' => TransactionResource::collection($this->transactions)
        ];
    }
}
