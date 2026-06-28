<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'author',
        'role',
        'company',
        'avatar',
        'content',
        'rating',
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
        'rating' => 'integer'
    ];
}
