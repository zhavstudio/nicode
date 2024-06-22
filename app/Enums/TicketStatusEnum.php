<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static New()
 * @method static static Pending()
 * @method static static Answered()
 * @method static static Closed()
 */
final class TicketStatusEnum extends Enum
{
    const new      = 0;
    const pending  = 1;
    const answered = 2;
    const rating   = 3;
    const closed   = 4;

    public static function getDescription(mixed $value): string
    {
        return match ($value) {
            self::new => 'جدید',
            self::pending => 'در انتظار',
            self::answered => 'پاسخ داده شده',
            self::rating => 'Rating',
            self::closed => 'بسته',
            default => self::getKey($value),
        };
    }
}
