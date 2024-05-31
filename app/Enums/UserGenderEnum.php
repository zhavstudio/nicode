<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class UserGenderEnum extends Enum
{
    const male = 0;
    const female = 1;
    const notPreferToSay = 2;

    public static function getDescription(mixed $value): string
    {
        return match ($value) {
            self::male => 'مرد',
            self::female => 'زن',
            self::notPreferToSay => 'ترجیح میدهم نگویم',
            default => self::getKey($value),
        };
    }
}
