<?php

use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\FcmController;
use Illuminate\Http\Request;
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


Route::name("api.public.")->group(function () {

    Route::get('/hi', function () {
        \App\Events\MessageEvent::dispatch('processed', 'prosper');
    });


    Route::post("register", [RegisterController::class, 'create'])->name("register");

    Route::post('verification-code', [LoginController::class, 'create'])->name('verification-code');

});
