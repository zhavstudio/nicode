<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Http\Resources\Api\User\TransactionResource;
use App\Http\Resources\Api\User\WalletResource;
use App\Models\Transaction;

/**
 * @OA\Info(title="Kargozareman", version="0.1")
 */
class TransactionController
{
    /**
     * Display a listing of the resource.
     */
    /**
     * @OA\Get(
     *     path="/api/web/v1/user/transaction-list",
     *     @OA\Response(response="200", description="An example resource"),
     *  @OA\Parameter(
     *          name="Accept",
     *          in="header",
     *          required=true,
     *          @OA\Schema(
     *              type="string",
     *              default="application/json"
     *          ))
     * ),
     */
    public function index()
    {
        return new WalletResource(auth()->user()->wallet()->first());
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
    public function store(StoreTransactionRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransactionRequest $request, Transaction $transaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        //
    }
}
