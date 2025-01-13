<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;


// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Create 10 users
        User::factory(10)->create();

        // Create 5 categories
        Category::factory(5)->create();

        // Create 20 accounts
        Account::factory(20)->create();

        // Create 50 transactions
        Transaction::factory(50)->create();
    }
}
