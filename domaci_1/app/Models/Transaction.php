<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_id', // associate the transaction with an account
        'category_id', // associate the transaction with a category
        'amount', // the amount of the transaction
        'transaction_date', // date of the transaction
        'details', // optional description of the transaction
    ];

    // Relationship with Account model
    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    // Relationship with Category model
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}