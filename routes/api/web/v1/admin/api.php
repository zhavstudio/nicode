<?php

use App\Http\Controllers\Api\MessageController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Api Routes
|--------------------------------------------------------------------------
|
| Here is where you can register Api routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your Api!
|
*/
//Admin



Route::middleware('auth:sanctum')->name("api.web.v1.admin.")->group(function () {
    Route::get('/messages', [MessageController::class, 'messages'])
        ->name('messages');
    Route::post('/message', [MessageController::class, 'message'])
        ->name('message');
});
