<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaAsset extends Model
{
    protected $fillable = [
        'name',
        'type',
        'url',
        'file_path',
        'size',
    ];
}
