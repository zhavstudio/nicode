<?php

namespace Database\Factories;

use App\Enums\TicketPriorityStatusEnum;
use App\Enums\TicketStatusEnum;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "title"         =>  $this->faker->sentence(6),
            "priority"     =>  $this->faker->randomElement(TicketPriorityStatusEnum::getValues()),
            "rate"          => $this->faker->randomNumber(1),
            "feedback"      =>  $this->faker->sentence,
            "status"       =>  $this->faker->randomElement(TicketStatusEnum::getValues())
        ];
    }
}
