<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Requests\MessageRequest;
use App\Http\Resources\MessagesResource;
use App\Jobs\SendMessage;
use App\Models\Image;
use App\Models\Message;
use App\Models\TemporaryFile;
use App\Models\TemporaryFiles;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Laravel\Firebase\Facades\Firebase;
use Morilog\Jalali\CalendarUtils;

class MessageController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function messages(Ticket $ticket): array
    {
        $ticketTitle = $ticket->title;
        $update = $ticket->updated_at;
        $create = $ticket->created_at;

        $messages = MessagesResource::collection($ticket->messages()->get());

        $messagesWithImages = $messages->filter(function ($message) {
            $types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp',"application/msword", "application/vnd.ms-excel", "application/vnd.ms-powerpoint","text/plain", "application/pdf"];
            return in_array($message->type,$types) ;
        })->values()->all();

        // Get the penultimate message ID
        $penultimateMessageId = null;
        if (count($messages) >= 2) {
            $penultimateMessageId = $messages[count($messages) - 2]['id'];
        }

        return [
            'update'    => CalendarUtils::strftime('Y-m-d', strtotime($update)),
            'create'    => CalendarUtils::strftime('Y-m-d', strtotime($create)),
            'ticket_title' => $ticketTitle,
            'id'          => auth()->user()->id,
            'phone'       => $ticket->user->phone_number,
            'messages' => $messages,
            'status'   => $ticket->status,
            'image_messages' => $messagesWithImages,
            'sync_id'  => $penultimateMessageId,  // New field for the penultimate message ID
        ];
    }

    public function message(MessageRequest $request,Ticket $ticket): JsonResponse {
        $ticketRecord = new Message($request->validated());
        $ticketRecord->ticket()->associate($ticket);
        $ticketRecord->user_id = auth()->user()->id;
        $ticketRecord->save();
        if ($request->validated("audio")){
            $tempObj = TemporaryFile::find($request->validated("audio"));
            if($tempObj) {
                $moved = Storage::disk('public')->move("tmp-files/" . $tempObj->name, "voice/" . $tempObj->name);

                if ($moved) {
                    $ticketRecord->update(["audio"  => $tempObj->name]);
                }
            }
        }else if ($request->validated("file")){
            $tempObj = TemporaryFile::find($request->validated("file"));
            if($tempObj) {
                $moved = Storage::disk('public')->move("tmp-files/" . $tempObj->name, "image/" . $tempObj->name);

                if ($moved) {
                    $imageObj = new Image(
                        [
                            "url"   =>  $tempObj->name,
                            "image_type"   =>  "chat",
                            "alt"   =>  auth()->user()->name . " - " . config("name")
                        ]);
                    $ticketRecord->images()->save($imageObj);
                }
            }
        }
        $messages = MessagesResource::collection($ticket->messages()->get());
        $penultimateMessageId = null;
        if (count($messages) >= 2) {
            $penultimateMessageId = $messages[count($messages) - 2]['id'];
        }


        SendMessage::dispatch($ticketRecord,$penultimateMessageId);
        Ticket::where('id', $ticket->id)->touch();
        $this->sendFirebaseNotification($ticket,$ticketRecord->text);

        return response()->json([
            'success' => true,
            'message' => "Message created and job dispatched.",
        ]);
    }

    private function sendFirebaseNotification(Ticket $ticket,$messages)
    {
        $user = $ticket->user;
        $fcmToken = $user->fcm_token; // Assuming you store the FCM token in the user model
        if ($fcmToken) {
            $message = CloudMessage::withTarget('token', $fcmToken)
                ->withNotification([
                    'title' => 'پیام شما پاسخ داده شد',
                    'body' => $messages,
                    'icon' => asset('storage/icon/logo.svg')
                ])
                ->withData([
                    'ticket_id' => $ticket->id,
                ]);

            Firebase::messaging()->send($message);
        }
    }
}
