<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogArticle extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'category',
        'read_time',
        'publish_date',
        'author',
        'summary',
        'image',
        'content',
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
    ];
}
