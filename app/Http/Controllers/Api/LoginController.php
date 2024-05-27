<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LoginController
{
    /**
     * Show the form for creating a new resource.
     *
     * @return JsonResponse
     */
    public function create(Request $request)
    {
        Validator::make($request->all(), [
            'phone_number'      => ['required', 'string', 'max:13'],
            'verification_code' => ['required', 'max:6']
        ])->validated();

        $user = User::where('phone_number', '=', $request['phone_number'])->where('verification_code', '=', $request['verification_code'])->first();


        if ($user && Carbon::now()->addHour(intval(config("app.EXPIRATION_HOUR_VERIFICATION_CODE"))) >= $user->verification_code_expire) {
            $expiresAt = Carbon::now()->addDay(intval(config("app.EXPIRATION_DAY_TOKEN")));
            $token = $user->createToken('auth-token', ['read', 'write'], $expiresAt)->plainTextToken;

            if (!$user->phone_number_verified_at){
                $user->update([
                    'phone_number_verified_at'  => Carbon::now()
                ]);
            }

            return response()->json([
                'token' => $token,
                'role'  => $user->hasRole('user') ? "user" : "admin"
            ]);
        } elseif (!Carbon::now()->addHour(intval(config("app.EXPIRATION_HOUR_VERIFICATION_CODE"))) >= $user->verification_code_expire){
            // dispatch new verification code
            return '564651';
        }

        return response()->json([
            'message' => 'Unauthenticated.'
        ], 401);
    }
}
