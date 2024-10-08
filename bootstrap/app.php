<?php

use App\Http\Middleware\TokenChange;
use App\Http\Middleware\UserStatusCheck;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Laratrust\Middleware\Role;
use Laravel\Sanctum\Http\Middleware\CheckAbilities;
use Laravel\Sanctum\Http\Middleware\CheckForAnyAbility;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
//        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withBroadcasting(
        __DIR__.'/../routes/channels.php',
        ['prefix' => 'api', 'middleware' => ['api', 'auth:sanctum']],
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->statefulApi();
        $middleware->api(prepend: [TokenChange::class]);
        $middleware->use([
//            'test' => \App\Http\Middleware\Test::class,
//            'permission' => \Laratrust\Middleware\Permission::class,
//            'ability' => \Laratrust\Middleware\Ability::class,
        ]);

        $middleware->alias([
            'user_status' => UserStatusCheck::class,
            'role'        => Role::class,
            'abilities'   => CheckAbilities::class,
            'ability'     => CheckForAnyAbility::class,
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
