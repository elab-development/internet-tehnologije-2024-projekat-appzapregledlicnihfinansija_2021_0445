<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\factory>
 */
class AccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(), // This assumes a relationship with User
            'account_name' => fake()->word(),
            'balance' => fake()->randomFloat(2, 100, 10000), // Random balance between 100 and 10,000
        ];
    }
}
