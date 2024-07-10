<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'zarinpal' => [
        'merchantID' => '7e05af3e-43a9-4bdd-8839-a3ab7da74ec7',
        'zarinGate' => false,
        'sandbox' => false,
    ],
    'sms_rahyab' => [
        'company'  => env('SMS_RAHYAB_COMPANY'),
        'host'     => env('SMS_RAHYAB_HOST'),
        'port'     => env('SMS_RAHYAB_PORT'),
        'username' => env('SMS_RAHYAB_USERNAME'),
        'password' => env('SMS_RAHYAB_PASSWORD'),
        'sender'   => env('SMS_RAHYAB_SENDER'),
        'token'    => env('SMS_RAHYAB_TOKEN'),
    ],
];
