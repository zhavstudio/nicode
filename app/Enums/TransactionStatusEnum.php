<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class TransactionStatusEnum extends Enum
{
    const pending = 0;
    const success = 1;
    const failed = 2;

    public static function getDescription(mixed $value): string
    {
        return match ($value) {
            self::pending => 'کنسل شده',
            self::success => 'موفق',
            self::failed => 'ناموفق',
            default => self::getKey($value),
        };
    }
}
