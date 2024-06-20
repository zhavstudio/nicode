<?php

namespace App\Http\Controllers;

use App\Enums\TransactionStatusEnum;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Shetabit\Multipay\Exceptions\InvalidPaymentException;
use Shetabit\Multipay\Invoice;
use Shetabit\Payment\Facade\Payment;


class PaymentController
{
    public function store(Request $request)
    {
        $request->validate([
        'amount' => 'required'
        ]);
        $invoice = new Invoice();

        $invoice->amount($request['amount']);

        return Payment::purchase($invoice, function($driver, $transactionID) use($request) {
            $transaction = new Transaction([
                'amount' => $request['amount'],
                'transactionID' => $transactionID
            ]);
            $transaction->wallet()->associate(auth()->user()->wallet);
            $transaction->save();
        })->pay()->render();

    }

    public function verifyPayment(Request $request)
    {
        $transaction =  Transaction::where('transactionID', '=', $request['Authority'])->first();
        try {
            $receipt = Payment::amount($transaction->amount)->transactionId($transaction->transactionID)->verify();
            $transaction->status = TransactionStatusEnum::success;
            $transaction->referenceID = $receipt->getReferenceId();
            $transaction->save();

            return view('payment.success-payment')->with([
                'referenceId'  => $receipt->getReferenceId()
            ]);

        } catch (InvalidPaymentException $exception) {
            /**
            when payment is not verified, it will throw an exception.
            We can catch the exception to handle invalid payments.
            getMessage method, returns a suitable message that can be used in user interface.
             **/
            $transaction->status = TransactionStatusEnum::failed;
            $transaction->save();
            return view('payment.failed-payment')->with([
                'message' => $exception->getMessage()
            ]);
        }
    }
}
