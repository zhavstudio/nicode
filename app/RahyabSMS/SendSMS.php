<?php

namespace App\RahyabSMS;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class SendSMS
{
    protected string $baseUri;
    protected string $username;
    protected string $usernameToken;
    protected string $password;
    protected string $company;
    protected string $number;

    public function __construct()
    {
        $this->baseUri = config('app.RAHYAB.RAHYAB_URL');
        $this->usernameToken = config('app.RAHYAB.RAHYAB_USERNAME_TOKEN');
        $this->username = config('app.RAHYAB.RAHYAB_USERNAME');
        $this->password = config('app.RAHYAB.RAHYAB_PASSWORD');
        $this->company = config('app.RAHYAB.RAHYAB_COMPANY');
        $this->number = config('app.RAHYAB.RAHYAB_NUMBER');
    }

    protected function getToken(): string
    {
        $data = [
            "username" => $this->usernameToken,
            "password" => $this->password
        ];

        $response = $this->sendRequest('post', 'api/auth/gettoken', $data, false);

        // Assuming the token is directly in the response for simplicity
        return $response['token'] ?? '';
    }

    protected function getCachedToken(): string
    {
        info("get token");
        if (Cache::has('api_token')) {
            return Cache::get('api_token');
        }

        $newToken = $this->getToken();
        Cache::put('api_token', $newToken, now()->addWeek());

        return $newToken;
    }

    protected function sendRequest(string $method, string $endpoint, array $data, bool $isAuth = true): array
    {
        info('SMS send start');

        $headers = ['Accept' => 'application/json'];

        if ($isAuth) {
            $headers['Authorization'] = 'Bearer'.' '.$this->getCachedToken();
        }

        $response = Http::withHeaders($headers)->$method($this->baseUri . $endpoint, $data);

        info('SMS send end');

        return $response->json();
    }

    public function sendSingleSMS(string $message, string $destinationNumber, string $messageId): array
    {
        info('Sending single SMS');

        $data = [
            'userName'           => $this->username,
            'password'           => $this->password,
            'company'            => $this->company,
            'number'             => $this->number,
            'message'            => $message,
            'destinationAddress' => $destinationNumber,
            'messageId'          => $messageId,
        ];

        return $this->sendRequest('post', '/api/v1/sendsms_single', $data);
    }
}
