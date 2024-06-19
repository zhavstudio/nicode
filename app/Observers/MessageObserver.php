<?php

namespace App\Observers;

use App\Enums\TicketStatusEnum;
use App\Models\Message;

class MessageObserver
{
    /**
     * Handle the Message "created" event.
     */
    public function created(Message $message): void
    {
        $ticket = $message->ticket()->first();

        if ($message->ticket->status->value === TicketStatusEnum::answered && $message->user()->first()->hasRole(["user"])) {
            $message->ticket->status = TicketStatusEnum::pending;
        }
        if($message->ticket->status->value === TicketStatusEnum::pending && $message->user()->first()->hasRole(["admin"])) {
            $message->ticket->status = TicketStatusEnum::answered;
        }
        if ($message->ticket->status->value === TicketStatusEnum::new && $message->user()->first()->hasRole(["user"])) {
            $collection = $ticket->messages()->get();
            $filtered = $collection->filter(function ($value, $key) {
                return $value->user()->first()->hasRole(["admin"]);
            });
//            dd($filtered->all());
            if($filtered->all())
            {
                $message->ticket->status = TicketStatusEnum::pending;
            } else {
                $message->ticket->status = TicketStatusEnum::new;
            }
        }

        if($message->ticket->status->value === TicketStatusEnum::new && $message->user()->first()->hasRole(["admin"])) {
            if(!$ticket->assignedUser()->first()) {
                $ticket->assignedUser()->associate(auth()->user());
                $ticket->save();
            }
            $collection = $ticket->messages()->get();
            $filtered = $collection->filter(function ($value, $key) {
                return $value->user()->first()->hasRole(["user"]);
            });

            if($filtered->all()) {
                $message->ticket->status = TicketStatusEnum::answered;
            } else {
                $message->ticket->status = TicketStatusEnum::new;
            }
        }

        $message->ticket->save();
    }

    /**
     * Handle the Message "updated" event.
     */
    public function updated(Message $message): void
    {
        //
    }

    /**
     * Handle the Message "deleted" event.
     */
    public function deleted(Message $message): void
    {
        //
    }

    /**
     * Handle the Message "restored" event.
     */
    public function restored(Message $message): void
    {
        //
    }

    /**
     * Handle the Message "force deleted" event.
     */
    public function forceDeleted(Message $message): void
    {
        //
    }
}
