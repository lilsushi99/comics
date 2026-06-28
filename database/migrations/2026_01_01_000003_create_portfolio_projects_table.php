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
        Schema::create('portfolio_projects', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->string('slug')->unique();
            $blueprint->string('title');
            $blueprint->string('category');
            $blueprint->string('tag');
            $blueprint->string('image')->nullable();
            $blueprint->text('description')->nullable();
            $blueprint->text('long_description')->nullable();
            $blueprint->string('client')->nullable();
            $blueprint->string('year')->nullable();
            $blueprint->json('tags')->nullable();
            $blueprint->json('gallery_images')->nullable();
            $blueprint->json('tools')->nullable();
            $blueprint->json('visual_details')->nullable();
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portfolio_projects');
    }
};
