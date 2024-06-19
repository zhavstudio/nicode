<?php

namespace App\Providers;

use App\Events\LoginEvent;
use App\Listeners\LoginListener;
use App\Models\Message;
use App\Models\Ticket;
use App\Models\Transaction;
use App\Models\User;
use App\Observers\MessageObserver;
use App\Observers\TicketObserver;
use App\Observers\TransactionObserver;
use App\Observers\UserObserver;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Event::listen(
            LoginEvent::class,
            LoginListener::class,
        );
        User::observe(UserObserver::class);
        Ticket::observe(TicketObserver::class);
        Message::observe(MessageObserver::class);
        Transaction::observe(TransactionObserver::class);
    }
}
