<?php

namespace App\Listeners;

use App\Events\LoginEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class LoginListener extends BaseListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(LoginEvent $event): void
    {
        $patternValues = [
            "code"         => $event->user->verification_code
        ];

        $this->FARAZAMAN_SMS_PANEL(env("FARAZ_PATTERN_LOGIN_SUCCESS", null), preg_replace('/^0/', '', $event->user->phone_number), $patternValues);
        info('New login code sent to'. $event->user->phone_number);
    }
}
