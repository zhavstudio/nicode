<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use App\Http\Resources\UserTicketResource;
use App\Jobs\SendMessage;
use App\Models\Message;
use App\Models\Ticket;

class TicketController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return UserTicketResource::collection(auth()->user()->ticket()->get()->merge(auth()->user()->ticketAssigned()->get()));
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
    public function store(StoreTicketRequest $request)
    {
        $ticketObj = new Ticket($request->validated());
        $ticketObj->user()->associate(auth()->user());
        $ticketObj->save();

        $ticketRecord = new Message(["text" => $request->validated("message")]);
        $ticketRecord->ticket()->associate($ticketObj);
        $ticketRecord->user_id = auth()->user()->id;
        $ticketRecord->save();
        SendMessage::dispatch($ticketRecord);

        return response()->json([
            'success' => true,
            'message' => "Message created and job dispatched.",
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ticket $ticket)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTicketRequest $request, Ticket $ticket)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        //
    }

    /**
     * Display a listing of the resource.
     */
    public function userTicket()
    {
        return UserTicketResource::collection(auth()->user()->ticket()->get());
    }

    /**
     * Display a listing of the resource.
     */
    public function unassignedTickets()
    {
        return UserTicketResource::collection(Ticket::where("assigned_id","=",null)->get());
    }

}
