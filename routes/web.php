<?php

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

Route::get('/{path?}/{path2?}/{path3?}/{path4?}', function () {
    return view('app');
});
