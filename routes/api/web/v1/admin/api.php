<?php

use App\Http\Controllers\Api\Admin\TransactionController;
use App\Http\Controllers\Api\Admin\UserController;

use App\Http\Controllers\Api\Admin\MessageController;
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
//Admin

Route::name("api.web.v1.admin.")->group(function () {

    Route::apiResource('user', UserController::class)->only(['index', 'store']);

    Route::apiResource("ticket", TicketController::class)->only("index","store");

    Route::get('/unassigned-tickets', [TicketController::class, 'unassignedTickets'])
        ->name('unassigned');
    Route::put('/close-ticket/{ticket}', [TicketController::class, 'update'])
        ->name('close');

    Route::get('/messages/{ticket}', [MessageController::class, 'messages'])
        ->name('messages');

    Route::post('/message/{ticket}', [MessageController::class, 'message'])
        ->name('message');

    Route::get('user-details/{id}',[UserController::class,'details'])->name('details');

    Route::get('transaction-list', [TransactionController::class, 'index'])->name('transaction-list');

});
