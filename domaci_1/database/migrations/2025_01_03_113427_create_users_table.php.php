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
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // auto-increment ID
            $table->string('name'); // Ime korisnika
            $table->string('email')->unique(); // Unikatna email adresa
            $table->string('password'); // Lozinka
            $table->enum('role', ['user', 'admin'])->default('user'); // Ako želiš uloge
            $table->timestamp('email_verified_at')->nullable(); // Za verifikaciju emaila
            $table->rememberToken(); // Za "remember me" funkcionalnost
            $table->timestamps(); // created_at i updated_at
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('users');
    }
};
