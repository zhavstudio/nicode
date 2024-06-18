<?php

use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\TicketController;
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
//User

Route::name("api.web.v1.user.")->group(function () {

    Route::get('salam/user', function () {
//        auth()->user();
        return auth()->user();
    })->name('amin');


    Route::get('/dsfsdddddd', function () {
        return auth()->user();
    });

    Route::get('/messages/{ticket}', [MessageController::class, 'messages'])
        ->name('messages');

    Route::post('/message/{ticket}', [MessageController::class, 'message'])
        ->name('message');

    Route::get("ticket", [TicketController::class,"userTicket"])->name("userTicket");

    Route::post("first-ticket", [TicketController::class,"store"])->name("first-ticket");


});
