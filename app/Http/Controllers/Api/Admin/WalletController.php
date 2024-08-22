<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\User;
use Dotenv\Validator;
use Illuminate\Auth\Events\Validated;
use Illuminate\Http\Request;

class WalletController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update User Wallet Total.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'amount' => ['required', 'numeric']
        ]);


        $request->input(['method']);
        if($request->input('method') == "add"){
            $newTotal = $user->wallet->total + $request['amount'];
            $user->wallet()->update(["total" => $newTotal]);
            return response()->json([
                'total' => $user->wallet->total
            ], 200);
        } elseif ($request->input('method') == "minus"){
            $difference = $user->wallet->total - $request['amount'];
            if ($difference >= 0){
                $user->wallet()->update(["total" => $difference]);
                return response()->json([
                    'total' => $user->wallet->total
                ], 200);
            } else {
                return response()->json([
                    'message' => 'موجودی کافی نیست'
                ], 405);
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
