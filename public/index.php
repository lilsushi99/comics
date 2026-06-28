<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer Autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap the Laravel application...
$app = require_once __DIR__.'/../bootstrap/app.php';

// Handle incoming HTTP request...
$app->handleRequest(Request::capture());
