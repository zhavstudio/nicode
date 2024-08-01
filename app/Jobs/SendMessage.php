<?php

namespace App\Jobs;

use App\Events\MessageEvent;
use App\Models\Message;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Morilog\Jalali\CalendarUtils;

class SendMessage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public Message $message,public $sync_id)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $image = $this->message->images()->first();

            MessageEvent::dispatch([
                'id' => $this->message->id,
                'user_id' => $this->message->user_id,
                'text' => $this->message->text,
                'time' => CalendarUtils::strftime('H:i', Carbon::parse($this->message->created_at)),
                'day'   => Carbon::parse($this->message->created_at),
                'ticket_id' => $this->message->ticket_id,
                "audio" => $this->message->audio ? Storage::url("voice/".$this->message->audio) : null,
                'type' => $this->message->type,
                'url' => $image ? Storage::url("image/".$image->url) : null,
                'sync_id' => $this->sync_id
            ]);
        } catch (\Exception $e) {
            \Laravel\Prompts\info('Failed to dispatch MessageEvent: ' . $e->getMessage());
            // You might want to implement retry logic or other error handling here
        }
    }
}
