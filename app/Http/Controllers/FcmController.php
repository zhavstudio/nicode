<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FcmController
{
    public function updateFcmToken(Request $request)
    {
        $request->validate([
            'fcm_token' => 'required|string',
        ]);
        auth()->user()->updateFcmToken($request->fcm_token);

        return response()->json(['message' => 'FCM token updated successfully']);
    }
}
