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
        Schema::create('users', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->string('name');
            $blueprint->string('email')->unique();
            $blueprint->timestamp('email_verified_at')->nullable();
            $blueprint->string('password');
            $blueprint->rememberToken();
            $blueprint->timestamps();
        });

        Schema::create('personal_access_tokens', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->morphs('tokenable');
            $blueprint->string('name');
            $blueprint->string('token', 64)->unique();
            $blueprint->text('abilities')->nullable();
            $blueprint->timestamp('last_used_at')->nullable();
            $blueprint->timestamp('expires_at')->nullable();
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('users');
    }
};
