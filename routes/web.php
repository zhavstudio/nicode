<?php

use App\Http\Controllers\PaymentController;
use Dedoc\Scramble\Scramble;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;



Scramble::registerUiRoute('docs/api');

Route::get('verify-payment', [PaymentController::class, 'verifyPayment'])->name('verifyPayment');
Route::get('verify-payment/app', [PaymentController::class, 'verifyPaymentApp'])->name('verifyPaymentApp');

Route::get('/{path?}/{path2?}/{path3?}/{path4?}', function () {
    return view('app');
});


