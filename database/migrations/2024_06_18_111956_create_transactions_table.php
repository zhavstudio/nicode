<?php

use App\Enums\TransactionStatusEnum;
use App\Models\Wallet;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->ulid('id')->autoIncrement();
            $table->decimal('amount', 8, 2);
            $table->string('transactionID');
            $table->tinyInteger('status')->default(TransactionStatusEnum::pending);
            $table->string('bank')->default('zarinpal');
            $table->foreignIdFor(Wallet::class);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
