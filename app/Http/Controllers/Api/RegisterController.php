<?php

namespace App\Http\Controllers\Api;

use App\Events\LoginEvent;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RegisterController
{
    /**
     * Show the form for creating a new resource.
     *
     * @return string
     */
    public function create(Request $request)
    {
        Validator::make($request->all(), [
            'phone_number' => ['required', 'string', 'max:11']
        ])->validate();

        $user = User::where('phone_number', '=', $request['phone_number'])->first();
        if ($user) {
             $user->update([
                'verification_code'        => rand(100000, 999999),
                'verification_code_expire' => Carbon::now()->addHour(intval(config("app.EXPIRATION_HOUR_VERIFICATION_CODE")))
            ]);
             LoginEvent::dispatch($user);
        } else {
            $user = User::create([
                'phone_number'             => $request['phone_number'],
                'verification_code'        => rand(100000, 999999),
                'verification_code_expire' => Carbon::now()->addHour(intval(config("app.EXPIRATION_HOUR_VERIFICATION_CODE")))
            ]);
             $user->addRole("user");
             LoginEvent::dispatch($user);
            return '1';
        }

    }
}
