<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class RegisterController
{
    /**
     * Show the form for creating a new resource.
     *
     * @return string
     */
    public function create(Request $request)
    {
        info("App sign up " . serialize($request->all()));

        Validator::make($request->all(), [
            'phone_number' => ['required', 'string', 'max:11']
            //            'fname' => ['required', 'string', 'max:255'],
            //            'lname' => ['required', 'string', 'max:255'],
            //            'email' => [
            //                'required',
            //                'string',
            //                'email',
            //                'max:255',
            //                Rule::unique(User::class),
            //            ],
            //            'password' => $this->passwordRules(),
            //'password' => [Rule::requiredIf(array_key_exists($input), 'string', new Password, 'confirmed'],
        ])->validate();

        $user = User::where('phone_number', '=', $request['phone_number'])->first();
        if ($user) {
            return $user->update([
                'verification_code'        => rand(100000, 999999),
                'verification_code_expire' => Carbon::now()->addHour(intval(config("app.EXPIRATION_HOUR_VERIFICATION_CODE")))
            ]);
        } else {
            $user = User::create([
                'phone_number'             => $request['phone_number'],
                'verification_code'        => rand(100000, 999999),
                'verification_code_expire' => Carbon::now()->addHour(intval(config("app.EXPIRATION_HOUR_VERIFICATION_CODE")))
            ]);
             $user->addRole("user");
            return '1';
        }

    }
}
