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

        $message = "کد ورود به سامانه ی کارگزار من:". $event->user->verification_code .PHP_EOL."لغو 11" .PHP_EOL;
        $patternValues = [
            "code"         => $event->user->verification_code
        ];
//        if (config('app.env') !== 'local'){
//            $this->FARAZAMAN_SMS_PANEL(config("app.FARAZ.FARAZ_PATTERN_LOGIN_SUCCESS", null), preg_replace('/^0/', '', $event->user->phone_number), $patternValues);
//            info('New login code sent to'. $event->user->phone_number);
//        }
        if (config('app.env') !== 'local'){
            $this->sms->sendSingleSMS($message, $event->user->phone_number, $event->user->verification_code);
            info('New login code sent to'. $event->user->phone_number);
        }
    }
}
