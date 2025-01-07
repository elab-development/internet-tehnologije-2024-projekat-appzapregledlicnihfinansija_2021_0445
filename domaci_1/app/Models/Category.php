<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'name', // name of the category
        'description', // optional description
    ];

    // Optionally, if you want to associate categories with transactions
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}