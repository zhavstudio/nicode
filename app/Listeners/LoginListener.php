<?php

namespace App\Listeners;

use AllowDynamicProperties;
use App\Events\LoginEvent;
use App\RahyabSMS\SendSMS;

#[AllowDynamicProperties] class LoginListener extends BaseListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        $this->sms = new SendSMS();
    }

    /**
     * Handle the event.
     */
    public function handle(LoginEvent $event): void
    {

        $message = $event->user->verification_code ."کد ورود به حساب نیکد:";


//        if (config('app.env') !== 'local'){
            $this->sms->sendSingleSMS($message, $event->user->phone_number, $event->user->verification_code);
            info('New login code sent to'. $event->user->phone_number);
//        }
    }
}
