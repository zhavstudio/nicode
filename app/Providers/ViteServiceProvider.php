<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\URL;

class ViteServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('vite.server', function () {
            $isProduction = env('APP_ENV') === 'production';
            $viteServerUrl = $isProduction
                ? null
                : URL::to('/') . ':' . env('VITE_DEV_SERVER_PORT', 5173);

            $viteServer = new \StackPHP\Vite\Server(
                config('vite.dev_server_public'),
                $viteServerUrl,
                [
                    'root' => base_path(),
                    'logLevel' => 'info',
                    'server' => [
                        'hmr' => !$isProduction,
                    ],
                ]
            );

            return $viteServer;
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
