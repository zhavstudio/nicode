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



Route::middleware('auth:sanctum')->name("api.web.v1.user.")->group(function () {

    Route::get('salam/user', function (){
//        auth()->user();
       return auth()->user();
    })->name('amin')->middleware(['role:user']);

    Route::group(['middleware' => ['role:user']], function() {
        Route::get('/dsfsdddddd', function (){
            return 'lakfd';
        });
//        Route::get('/manage', ['middleware' => ['permission:manage-admins'], 'uses' => 'AdminController@manageAdmins']);
    });
});
