<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AccountResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->account_name, // zameni sa 'name' ako je drugačije u bazi
            'balance' => $this->balance,
        ];
    }
}