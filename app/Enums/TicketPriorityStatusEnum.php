<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static High()
 * @method static static Mediate()
 * @method static static Low()
 */
final class TicketPriorityStatusEnum extends Enum
{
    const low     = 0;
    const mediate = 1;
    const high    = 2;

    public static function getDescription(mixed $value): string
    {
        return match ($value) {
            self::high => 'High',
            self::mediate => 'Mediate',
            self::low => 'Low',
            default => self::getKey($value),
        };
    }
}
