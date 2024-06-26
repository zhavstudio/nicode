<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * @property integer $user_id
 * @property integer $text
 * @property string  $ticket
 * @property integer $user
 */
class Message extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'messages';

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
    protected $fillable = ['ticket_id', 'user_id', 'text', 'audio', 'type'];


    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = ['id'];

    /**
     *
     * @return array
     */
    protected $casts = [
        "created_at" => "datetime",
    ];

//    /**
//     * Get the language that owns this skill.
//     */
//    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
//    {
//        return $this->belongsTo(User::class);
//    }


    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    /**
     * Get the ticket that owns this record
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the images for this community.
     */
    public function images(): MorphMany|Image|array
    {
        return $this->morphMany(Image::class, 'parentable');
    }
}
