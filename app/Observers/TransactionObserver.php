<?php

namespace App\Observers;

use App\Enums\TransactionStatusEnum;
use App\Models\Transaction;

class TransactionObserver
{
    /**
     * Handle the Transaction "created" event.
     */
    public function created(Transaction $transaction): void
    {
        //
    }

    /**
     * Handle the Transaction "updated" event.
     */
    public function updated(Transaction $transaction): void
    {
        if ($transaction->isDirty('status') && $transaction->status->value === TransactionStatusEnum::success) {
            $wallet = $transaction->wallet;
            $amount = $transaction->amount >= 0 ? $transaction->amount : -$transaction->amount;

            $wallet->total += $amount;
            $wallet->save();
        }
    }

    /**
     * Handle the Transaction "deleted" event.
     */
    public function deleted(Transaction $transaction): void
    {
        //
    }

    /**
     * Handle the Transaction "restored" event.
     */
    public function restored(Transaction $transaction): void
    {
        //
    }

    /**
     * Handle the Transaction "force deleted" event.
     */
    public function forceDeleted(Transaction $transaction): void
    {
        //
    }
}
