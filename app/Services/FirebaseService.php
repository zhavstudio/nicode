<?php

namespace App\Services;
use GuzzleHttp\Client;

/**
 * Class FirebaseService.
 */
class FirebaseService
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client();
    }

    public function sendNotification($title, $body, $token, $platform = 'android')
    {
        $url = 'https://fcm.googleapis.com/fcm/send';

        $notification = [
            'title' => $title,
            'body' => $body,
        ];

        $data = [
            'to' => $token,
        ];

        if ($platform === 'android') {
            $data['notification'] = $notification;
        } elseif ($platform === 'ios') {
            $data['notification'] = $notification;
            $data['priority'] = 'high';
        } elseif ($platform === 'web') {
            $data['notification'] = $notification;
            $data['webpush'] = [
                'headers' => [
                    'TTL' => '60',
                ],
            ];
        }

        $headers = [
            'Authorization' => 'key=' . env('FIREBASE_SERVER_KEY'),
            'Content-Type' => 'application/json',
        ];

        $response = $this->client->post($url, [
            'headers' => $headers,
            'json' => $data,
        ]);

        return $response->getBody();
    }
}
