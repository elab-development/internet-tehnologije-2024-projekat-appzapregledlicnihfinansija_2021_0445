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
    Schema::create('accounts', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('user_id'); // Spoljni ključ ka korisniku
        $table->string('account_name');
        $table->decimal('balance', 10, 2)->default(0.00); // Bilans računa
        $table->timestamps();

        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); // Veza sa korisnikom
    });
}

public function down()
{
    Schema::dropIfExists('accounts');
}
};
