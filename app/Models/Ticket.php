<?php

namespace App\Models;

use App\Enums\TicketPriorityStatusEnum;
use App\Enums\TicketStatusEnum;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property integer $user_id
 * @property integer $assigned_agent_id
 * @property string  $title
 * @property integer $priority
 * @property integer $status
 */

class Ticket extends Model
{
    use HasFactory, HasUlids;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tickets';

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
        "assigned_id",
        "title",
        "priority",
        "rate",
        "feedback",
        "status"
    ];

    /**
     *
     * @return array
     */
    protected $casts = [
        'priority' => TicketPriorityStatusEnum::class,
        'status'   => TicketStatusEnum::class
    ];

    /**
     * @return void
     */
//    protected static function boot():void
//    {
//        parent::boot();
//        static::created(function ($model) {
//            NewTicketEvent::dispatch($model);
//        });
//    }

    /**
     * Get the user that create this support ticket
     */
    public function user (): BelongsTo
    {
        return $this->belongsTo(User::class, "user_id");
    }

    /**
     * Get the assigned user that create this support ticket
     */
    public function assignedUser (): BelongsTo
    {
        return $this->belongsTo(User::class, "assigned_id");
    }

    /**
     * @return HasMany
     */
    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
