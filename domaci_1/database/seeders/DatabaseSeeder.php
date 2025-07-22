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
    public function run(): void
    {

    // Kreiraj 10 kategorija
         \App\Models\Category::factory(10)->create();

    // Kreiraj 5 korisnika i svakom dodaj po 2 naloga
         \App\Models\User::factory(5)
        ->hasAccounts(2) // iz factory relacije
        ->create();

    // Napravi dodatno 50 transakcija
        \App\Models\Transaction::factory(50)->create();
    }
}
