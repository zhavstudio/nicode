<?php

namespace App\Models;

use App\Enums\UserGenderEnum;
use App\Enums\UserStatusEnum;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laratrust\Contracts\LaratrustUser;
use Laratrust\Traits\HasRolesAndPermissions;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property numeric $id
 * @property numeric $gender
 * @property numeric $status
 * @property string  $first_name
 * @property string  $last_name
 * @property string  $email
 * @property string  $email_verified_at
 * @property string  $phone_number
 * @property string  $phone_verified_at
 * @property string  $verification_code
 * @property string  $verification_code_expire
 * @property string  $password
 */
class User extends Authenticatable implements LaratrustUser
{
    use HasFactory, Notifiable, HasRolesAndPermissions, HasApiTokens, HasUlids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'gender',
        'code_meli',
        'phone_number',
        'verification_code',
        'verification_code_expire',
        'phone_number_verified_at',
        'status',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at'        => 'datetime',
            'password'                 => 'hashed',
            'firs_name'                => 'string',
            'last_name'                => 'string',
            'gender'                   => UserGenderEnum::class,
            'code_meli'                => 'string',
            'phone_number'             => 'string',
            'verification_code'        => 'integer',
            'verification_code_expire' => 'datetime',
            'phone_number_verified_at' => 'datetime',
            'status'                   => UserStatusEnum::class,
            'email'                    => 'string',
            'fcm_token',
        ];
    }

    /**
     * Interact with the user's first name.
     *
     * @return Attribute
     */
    protected function firstname(): Attribute
    {
        return Attribute::make(
            get: fn($value) => ucfirst($value),
            set: fn($value) => strtolower(trim($value))
        );
    }

    /**
     * Interact with the user's last name.
     *
     * @return Attribute
     */
    protected function lastname(): Attribute
    {
        return Attribute::make(
            get: fn($value) => ucfirst($value),
            set: fn($value) => strtolower(trim($value)),
        );
    }

    /**
     * create a virtual column name from first_name and last_name
     *
     * @return Attribute
     */
    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn(mixed $value, array $attributes) => ucfirst($attributes['first_name']) . " " . ucfirst($attributes['last_name']),
        );
    }

    /**
     * Get the profile's image for this user
     */
    public function profileImage(): File|MorphOne|null
    {
        return $this->morphOne(File::class, 'parentable')->where('image_type', '=', 'profile',);
    }

//    public function message()
//    {
//        return $this->hasMany(Message::class);
//    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function ticket()
    {
        return $this->hasMany(Ticket::class,"user_id");
    }

    public function ticketAssigned()
    {
        return $this->hasMany(Ticket::class,"assigned_id");
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function wallet(): HasOne
    {
        return $this->hasOne(Wallet::class);
    }
    public function updateFcmToken($token)
    {
        $this->fcm_token = $token;
        $this->save();
    }
}
