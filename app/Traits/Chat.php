<?php

namespace App\Traits;

use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Pagination\LengthAwarePaginator;
use stdClass;

trait Chat
{
    /**
     * @return LengthAwarePaginator
     */
    public function chats(): LengthAwarePaginator
    {
        if (request()->filled('query')) {
            $chats = User::query()
                ->where('name', 'LIKE', '%' . request('query') . '%')
                ->selectRaw('
                    id,
                    name,
                    avatar,
                    NULL as message_id,
                    NULL as body,
                    1 as is_read,
                    0 as is_replied,
                    CASE
                        WHEN is_online = 1 AND active_status = 1
                        THEN 1
                        ELSE 0
                    END as is_online,
                    active_status,
                    NULL as created_at,
                    ? as chat_type
                ',
                [
                    ChatMessage::CHATS
                ])
                ->paginate(25)
                ->withQueryString()
                ->setPath(route('chats.users'));
        } else {
            $lastestMessages = ChatMessage::query()
                ->where('from_id', auth()->id())
                ->orWhere('to_id', auth()->id())
                ->selectRaw("
                    MAX(sort_id) as sort_id,
                    CASE
                        WHEN from_id = '". auth()->id() ."' THEN to_id
                        ELSE from_id
                    END as another_user_id
                ")
                ->groupBy('another_user_id');

            $chats = ChatMessage::with('another_user', 'to', 'from', 'attachments')
                ->joinSub($lastestMessages, 'lastestMessages', function (JoinClause $join) {
                    $join->on('chat_messages.sort_id', 'lastestMessages.sort_id')
                        ->on(function (JoinClause $join) {
                            $join->on('chat_messages.from_id', 'lastestMessages.another_user_id')
                                ->orOn('chat_messages.to_id', 'lastestMessages.another_user_id');
                        });
                })
                ->where('chat_messages.from_id', auth()->id())
                ->orWhere('chat_messages.to_id', auth()->id())
                ->select('chat_messages.*', 'lastestMessages.another_user_id')
                ->orderByDesc('sort_id')
                ->paginate(15)
                ->setPath(route('chats.users'));

            foreach ($chats as $key => $chat) {
                $mapped = new stdClass();
                $mapped->id = $chat->another_user->id;
                $mapped->name = $chat->another_user->name . ($chat->another_user->id === auth()->id() ? ' (You)' : '');
                $mapped->avatar = $chat->another_user->avatar;
                $mapped->from_id = $chat->from_id;
                $mapped->body = $chat->body;
                $mapped->is_read = true;
                $mapped->is_replied = false;
                $mapped->is_online = true;
                $mapped->created_at = $chat->created_at;
                $mapped->chat_type = ChatMessage::CHATS;

                $chats[$key] = $mapped;
            }
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
            ->selectRaw('
                id,
                from_id,
                to_id,
                to_type,
                CASE
                    WHEN to_type = ? THEN ?
                    ELSE ?
                END as chat_type,
                body,
                seen_in_id,
                sort_id,
                created_at
            ',
            [
                User::class,
                ChatMessage::CHATS,
                ChatMessage::GROUP_CHATS
            ])
            ->orderBy('sort_id')
            ->paginate(25)
            ->setPath(route("chats.messages", $id));
    }
}
