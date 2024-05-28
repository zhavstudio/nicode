<?php

namespace App\Http\Middleware;

use App\Enums\UserStatusEnum;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserStatusCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
       if ($request->user()->status === UserStatusEnum::suspend){
            return response()->json(['message' => 'Your Account has been Suspended.'], 403);
       }

        return $next($request);
    }

}
