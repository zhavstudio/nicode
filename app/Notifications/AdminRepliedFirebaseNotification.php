<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Laravel\Firebase\Facades\Firebase;
use App\Models\Ticket;

class AdminRepliedFirebaseNotification extends Notification
{
    use Queueable;

    protected $ticket;

    public function __construct(Ticket $ticket)
    {
        $this->ticket = $ticket;
    }

    public function via($notifiable)
    {
        return ['firebase'];
    }

    public function toFirebase($notifiable)
    {
        return CloudMessage::new()
            ->withNotification([
                'title' => 'New Admin Reply',
                'body' => 'An admin has replied to your ticket.',
            ])
            ->withData([
                'ticket_id' => $this->ticket->id,
            ]);
    }
}
