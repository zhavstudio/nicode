<?php

use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\User\TransactionController;
use App\Http\Controllers\FcmController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\TempController;
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

    Route::get('transaction-list', [TransactionController::class, 'index'])->name('transaction-list');

    Route::post('transaction', [PaymentController::class, 'store'])->name('transaction');

    Route::get('verify-payment', [PaymentController::class, 'verifyPayment'])->name('verifyPayment');

    Route::apiResource("temporary-file", TempController::class)->only("store");

    Route::post('fcm-token', [FcmController::class, 'updateFcmToken'])->name('fcm-token');

});
