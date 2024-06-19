<?php

namespace App\Http\Controllers;

use App\Enums\TransactionStatusEnum;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TestController
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
        $request->validate([
            'amount' => 'required'
        ]);
        $transaction = new Transaction([
            'amount' => $request['amount']
        ]);
        $transaction->wallet()->associate(auth()->user()->wallet);
        $transaction->save();
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
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
//        $transaction->update([
//            'status' => TransactionStatusEnum::success
//        ]);
//        $transaction->save();
        $transaction->status = TransactionStatusEnum::success;
        return $transaction->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
