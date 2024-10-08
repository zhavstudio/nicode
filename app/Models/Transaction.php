<?php

namespace App\Models;

use App\Enums\TransactionStatusEnum;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property numeric $wallet
 * @property numeric $amount
 * @property numeric $status
 * @property numeric $transactionID
 * @property numeric $referenceID
 */

class Transaction extends Model
{
    use HasFactory, HasUlids;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'transactions';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        "id",
        "wallet_id",
        "amount",
        "transactionID",
        "referenceID",
    ];

    /**
     *
     * @return array
     */
    protected $casts = [
            'status'    => TransactionStatusEnum::class
    ];

    public function wallet():BelongsTo
    {
       return $this->belongsTo(Wallet::class);
    }
}
