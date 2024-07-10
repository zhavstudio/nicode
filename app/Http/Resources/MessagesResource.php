<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use Morilog\Jalali\CalendarUtils;
use Morilog\Jalali\Jalalian;

class MessagesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $image = $this->images()->first();
        return [
            "text"     =>   $this->text,
            "audio"      => $this->audio ? Storage::url("voice/".$this->audio) : null,
            "type"     =>   $this->type,
            "updated_at" => CalendarUtils::strftime('Y-m-d H:i:s', $this->updated_at),
            'time' => CalendarUtils::strftime('Y-m-d H:i:s', Carbon::parse($this->created_at)),
            "id"       =>  $this->id,
            "is_sender"  =>  $this->user_id === auth()->user()->id,
            "url"      =>  $image ? Storage::url("image/".$image->url) : null ,
            "image_create" => $image ? CalendarUtils::strftime('Y-m-d H:i:s', Carbon::parse($image->created_at)->timezone('Asia/Tehran')->timestamp) : null,
        ];
    }
}
