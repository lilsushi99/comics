<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioProject extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'category',
        'tag',
        'image',
        'description',
        'long_description',
        'client',
        'year',
        'tags',
        'gallery_images',
        'tools',
        'visual_details',
    ];

    protected $casts = [
        'tags' => 'array',
        'gallery_images' => 'array',
        'tools' => 'array',
        'visual_details' => 'array',
    ];
}
