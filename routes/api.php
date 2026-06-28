<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CMSController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Authentication Gateways
Route::post('/auth/login', [CMSController::class, 'login']);

// CMS Data sync and fetching
Route::get('/cms-data', [CMSController::class, 'getCMSData']);
Route::post('/cms-save', [CMSController::class, 'saveCMSData']);
Route::post('/cms-reset', [CMSController::class, 'resetCMSData']);

// Media Local Uploads & Web Asset Syncer
Route::post('/media/upload', [CMSController::class, 'uploadMedia']);
Route::post('/media/download-url', [CMSController::class, 'downloadExternalUrl']);
