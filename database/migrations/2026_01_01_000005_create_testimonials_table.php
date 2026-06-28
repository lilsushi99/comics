<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->string('author');
            $blueprint->string('role')->nullable();
            $blueprint->string('company')->nullable();
            $blueprint->string('avatar')->nullable();
            $blueprint->text('content')->nullable();
            $blueprint->integer('rating')->default(5);
            $blueprint->json('tags')->nullable();
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
