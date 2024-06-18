<?php

namespace App\Jobs;

use App\Events\MessageEvent;
use App\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendMessage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public Message $message, public $userId)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        MessageEvent::dispatch([
            'id' => $this->message->id,
            'user_id' => $this->message->user_id,
            'text' => $this->message->text,
            'time' => $this->message->time,
            'ticket_id' => $this->message->ticket_id,
            'is_sender'  => $this->message->user_id === $this->userId
        ]);
    }
}
