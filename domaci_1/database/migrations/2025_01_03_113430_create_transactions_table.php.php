<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('transactions', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('account_id'); // Spoljni ključ ka računu
        $table->unsignedBigInteger('category_id'); // Spoljni ključ ka kategoriji
        $table->decimal('amount', 10, 2); // Iznos transakcije
        $table->enum('type', ['income', 'expense']); // Tip transakcije: prihod ili rashod
        $table->text('description')->nullable(); // Opis transakcije
        $table->timestamps();

        $table->foreign('account_id')->references('id')->on('accounts')->onDelete('cascade');
        $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
    });
}

public function down()
{
    Schema::dropIfExists('transactions');
}
};
