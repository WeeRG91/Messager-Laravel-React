<?php

namespace App\Traits;

use App\Models\ChatMessage;
use Illuminate\Pagination\LengthAwarePaginator;
use stdClass;

trait Chat
{
    public function chats(): LengthAwarePaginator
    {
        $messages = ChatMessage::with('from', 'to')
            ->paginate(25);

        foreach ($messages as $key => $message) {
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

            $messages[$key] = $mapped;
        }

        return $messages;
    }
}
