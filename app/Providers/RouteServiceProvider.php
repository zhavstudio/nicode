<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to your application's "home" route.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

//        $this->routes(function () {
//            Route::middleware('api')
//                ->prefix('api')
//                ->group(base_path('routes/api.php'));
//
//            Route::middleware('web')
//                ->group(base_path('routes/web.php'));
//        });

        $this->mapUserPanelRoutes();
        $this->mapAdminPanelRoutes();
        $this->mapApiRoutes();
    }


    protected function mapUserPanelRoutes(): void
    {
        Route::prefix('api/web/v1/user')
            ->middleware(['api', 'user_status', 'auth:sanctum', 'role:user'])
            ->namespace($this->namespace)
            ->group(base_path('routes/api/web/v1/user/api.php'));
    }
    protected function mapAdminPanelRoutes(): void
    {
        Route::prefix('api/web/v1/admin')
            ->middleware(['api', 'user_status', 'auth:sanctum', 'role:admin'])
            ->namespace($this->namespace)
            ->group(base_path('routes/api/web/v1/admin/api.php'));
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiRoutes(): void
    {
        Route::prefix('api')
            ->middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/api.php'));
    }
}
