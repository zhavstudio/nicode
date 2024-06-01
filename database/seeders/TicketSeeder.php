<?php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\Ticket;
use App\Models\TicketRecord;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::whereHasRole('user')->get();
        $admin = User::whereHasRole('admin')->first();

        foreach ($users as $user) {
            for ($i=0; $i < random_int(1,4); $i++) {
                if($user->hasRole('user')) {
                    $ticketObj = Ticket::factory()->makeOne();
                    $ticketObj->user()->associate($user);
                    $ticketObj->assignedUser()->associate($admin);
                    $ticketObj->save();


                    if($ticketObj->status !== "new") {
                        for($j=0; $j< rand(5,9); $j++) {
                            $ticketRecord = Message::factory()->makeOne();
                            $ticketRecord->ticket()->associate($ticketObj);
                            if ($j%2 ===0) {
                                $ticketRecord->user()->associate($ticketObj->user()->first());
                            } else {
                                $ticketRecord->user()->associate($admin);
                            }
                            $ticketRecord->save();
                        }
                    }
                }
            }
        }
    }
}
