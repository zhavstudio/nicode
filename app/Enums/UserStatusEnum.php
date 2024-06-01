<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class UserStatusEnum extends Enum
{
    const suspend = 0;
    const active = 1;

    public static function getDescription(mixed $value): string
    {
        return match ($value) {
            self::suspend => 'معلق',
            self::active => 'فعال',
            default => self::getKey($value),
        };
    }
}
