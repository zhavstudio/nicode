<?php

namespace App\Providers;

use App\RahyabSMS\SendSMS;
use Illuminate\Support\ServiceProvider;

class RahyabSMSServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind('rahyab', function (){
            return new SendSMS();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }

}
