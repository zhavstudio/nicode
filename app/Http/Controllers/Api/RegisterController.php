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
     * @return JsonResponse
     */
    public function create(Request $request)
    {
//        dd("register");
        info("App sign up " . serialize($request->all()));

        Validator::make($request->all(), [
            'phone_number'=> ['required', 'string', 'max:11']
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
        if ($user){
            $role = $user->hasRole("user");
        }else{
            $user = User::create([
                'phone_number' => $request['phone_number']
                //            'fname' => $request['fname'],
                //            'lname' => $request['lname'],
                //            'email' => $request['email'],
                //'email_verified_at' => Carbon::now(),
                //            'password' => Hash::make($request['password']),
            ]);
            $user->addRole("user");
            $role = true;
        }

        $expiresAt = Carbon::now()->addDay(intval(config("app.EXPIRATION_DAY")));
        $token = $user->createToken('auth-token', ['read', 'write'], $expiresAt)->plainTextToken;

        return response()->json([
            'token' => $token,
            'role' => $role ? "user" : "admin"
            ]);
    }
}
