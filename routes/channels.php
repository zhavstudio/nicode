<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('messages.{ticket_id}', function ($user) {
    return true;
});
