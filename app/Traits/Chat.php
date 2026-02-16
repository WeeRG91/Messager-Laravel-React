<?php

namespace App\Traits;

use App\Models\ChatMessage;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection as IlluminateCollection;
use stdClass;

trait Chat
{
    public function chats(): EloquentCollection|IlluminateCollection
    {
        return ChatMessage::with('from', 'to')
            ->get()
            ->map(function ($message) {
                $mapped = new stdClass();
                $mapped->id = $message->to->id;
                $mapped->name = $message->to->name;
                $mapped->avatar = $message->to->avatar;
                $mapped->from_id = $message->from_id;
                $mapped->body = $message->body;
                $mapped->is_read = true;
                $mapped->is_replied = false;
                $mapped->is_online = true;
                $mapped->created_at = $message->created_at;
                $mapped->chat_type = ChatMessage::CHATS;
                return $mapped;
            });
    }
}
