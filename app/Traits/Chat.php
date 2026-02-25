<?php

namespace App\Traits;

use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use stdClass;

trait Chat
{
    /**
     * @return LengthAwarePaginator
     */
    public function chats(): LengthAwarePaginator
    {
        $chats = ChatMessage::with('from', 'to')
            ->paginate(25);

        foreach ($chats as $key => $chat) {
            $mapped = new stdClass();
            $mapped->id = $chat->to->id;
            $mapped->name = $chat->to->name;
            $mapped->avatar = $chat->to->avatar;
            $mapped->from_id = $chat->from_id;
            $mapped->body = $chat->body;
            $mapped->is_read = true;
            $mapped->is_replied = false;
            $mapped->is_online = true;
            $mapped->created_at = $chat->created_at;
            $mapped->chat_type = ChatMessage::CHATS;

            $chats[$key] = $mapped;
        }

        return $chats;
    }

    /**
     * @param string $id
     * @return LengthAwarePaginator
     */
    public function messages(string $id): LengthAwarePaginator
    {
        return ChatMessage::with([
                'from',
                'to',
                'attachments'
            ])
            ->where(function (Builder $query) use ($id) {
                $query->where('from_id', auth()->id())
                    ->where('to_id', $id);
            })
            ->orWhere(function (Builder $query) use ($id) {
                $query->where('from_id', $id)
                    ->where('to_id', auth()->id());
            })
            ->selectRaw(
                'id, from_id, to_id, to_type,
                CASE
                    WHEN to_type = ? THEN ?
                    ELSE ?
                END as chat_type,
                body, seen_in_id, sort_id, created_at',
                [
                    User::class,
                    ChatMessage::CHATS,
                    ChatMessage::GROUP_CHATS
                ]
            )
            ->orderBy('sort_id')
            ->paginate(25)
            ->setPath(route("chats.messages", $id));
    }
}
