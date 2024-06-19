<?php

use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;



Route::get('verify-payment', [PaymentController::class, 'verifyPayment'])->name('verifyPayment');

Route::get('/{path?}/{path2?}/{path3?}/{path4?}', function () {
    return view('app');
});


