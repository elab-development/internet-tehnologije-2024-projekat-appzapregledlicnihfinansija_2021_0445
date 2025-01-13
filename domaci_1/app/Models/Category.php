<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

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