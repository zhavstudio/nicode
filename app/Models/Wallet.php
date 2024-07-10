<?php

namespace App\Models;

use App\Enums\TransactionStatusEnum;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property numeric $id
 * @property numeric $total
 * @property numeric $transactions
 * @property string  $user
 */

class Wallet extends Model
{
    use HasFactory, HasUlids;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'wallets';

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
        "user_id",
        "total",
    ];

    /**
     *
     * @return array
     */
    protected $casts = [
//        'total'      => 'decimal',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class)->latest();
    }

    public function getTotalSuccessfulTransactionsAttribute()
    {
        return $this->transactions()
            ->where('status', TransactionStatusEnum::success)
            ->sum('amount');
    }
}
