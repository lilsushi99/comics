<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CMSController;

/*
|--------------------------------------------------------------------------
| Admin Routes - Goat02 CMS Control Gate
|--------------------------------------------------------------------------
|
| These routes handle administrator actions, protected by secure session 
| or Sanctum bearer tokens to ensure only validated managers can alter
| the production database nodes.
|
*/

// Public Authentication Endpoint inside the /goat02 gate
Route::post('/login', [CMSController::class, 'login'])->name('admin.login');

// Protected administrative state manipulators
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/cms-save', [CMSController::class, 'saveCMSData'])->name('admin.cms.save');
    Route::post('/cms-reset', [CMSController::class, 'resetCMSData'])->name('admin.cms.reset');
    Route::post('/media/upload', [CMSController::class, 'uploadMedia'])->name('admin.media.upload');
    Route::post('/media/download-url', [CMSController::class, 'downloadExternalUrl'])->name('admin.media.download');
});
