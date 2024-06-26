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
    public function __construct(public Message $message)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $image = $this->message->images()->first();

        MessageEvent::dispatch([
            'id' => $this->message->id,
            'user_id' => $this->message->user_id,
            'text' => $this->message->text,
            'time' => CalendarUtils::strftime('Y-m-d H:i:s', Carbon::parse($this->message->created_at)),
            'ticket_id' => $this->message->ticket_id,
            "audio"      => $this->message->audio ? Storage::url("voice/".$this->message->audio) : null,
            'type'    => $this->message->type,
            'url'   => $image ? Storage::url("image/".$image->url) : null ,
        ]);
    }
}
