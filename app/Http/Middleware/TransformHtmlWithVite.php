<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
class TransformHtmlWithVite
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if ($response instanceof \Illuminate\Http\Response) {
            $content = $response->getContent();
            $transformed = app('vite.server')->transformIndexHtml($request->getRequestUri(), $content);
            $response->setContent($transformed);
        }

        return $response;
    }
}
