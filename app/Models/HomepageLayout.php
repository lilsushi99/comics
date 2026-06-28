<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomepageLayout extends Model
{
    protected $fillable = ['section_id', 'name', 'enabled', 'order'];

    protected $casts = [
        'enabled' => 'boolean',
        'order' => 'integer'
    ];
}
