<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\factory>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'account_id' => Account::factory(), // Relationship with Account
            'category_id' => Category::factory(), // Relationship with Category
            'amount' => fake()->randomFloat(2, 1, 1000), // Random transaction amount between 1 and 1000
            'type' => fake()->randomElement(['income', 'expense']), // Randomly select type
            'details' => fake()->sentence(), 
        ];
    }
}
