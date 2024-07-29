<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class BaseListener
{
    /**
     * Send SMS By FARAZAMAN_SMS_PANEL
     * @param string $patternCode
     * @param string $resipientNumber
     * @param array $patternValues
     * @return void
     * @throws \IPPanel\Errors\Error
     * @throws \IPPanel\Errors\HttpException
     */
    public function FARAZAMAN_SMS_PANEL(string $patternCode, string $resipientNumber, array $patternValues)
    {
        $client = new \IPPanel\Client(config('app.FARAZ.FARAZ_SMS_PANEL_API',null));

        $messageId = $client->sendPattern(
            $patternCode,    // pattern code
            config("app.FARAZ.SMS_SENDER_NUMBER", null),      // originator
            $resipientNumber,  // recipient
            $patternValues  // pattern values
        );
    }
}
