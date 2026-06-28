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
        Schema::create('blog_articles', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->string('slug')->unique();
            $blueprint->string('title');
            $blueprint->string('category');
            $blueprint->string('read_time')->nullable();
            $blueprint->string('publish_date')->nullable();
            $blueprint->string('author')->nullable();
            $blueprint->text('summary')->nullable();
            $blueprint->string('image')->nullable();
            $blueprint->longText('content')->nullable();
            $blueprint->json('tags')->nullable();
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blog_articles');
    }
};
