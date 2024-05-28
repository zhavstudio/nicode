<?php

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

    Route::get('salam/user', function (){
//        auth()->user();
       return auth()->user();
    })->name('amin');


        Route::get('/dsfsdddddd', function (){
            return auth()->user();
        });

});
