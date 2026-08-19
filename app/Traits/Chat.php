<?php

namespace App\Traits;

use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;
use stdClass;

trait Chat
{
    protected array $validImageExtensions = ["png", "jpg", "jpeg", "gif", "svg", "webp", "bmp"];

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
                $attachment = '';
                if (!$chat->body && $chat->attachments) {
                    $fileName = $chat->attachments->first()->file_name;
                    if (in_array(pathinfo($fileName, PATHINFO_EXTENSION), $this->validImageExtensions)) {
                        $attachment = 'sent an image';
                    } else {
                        $attachment = 'sent an attachment';
                    }
                }

                $mapped = new stdClass();
                $seenInId = collect(json_decode($chat->seen_in_id));

                $mapped->id = $chat->another_user->id;
                $mapped->name = $chat->another_user->name . ($chat->another_user->id === auth()->id() ? ' (You)' : '');
                $mapped->avatar = $chat->another_user->avatar;
                $mapped->from_id = $chat->from_id;
                $mapped->is_read = $seenInId->filter(fn ($item) => $item->id === auth()->id())->count() > 0;
                $mapped->is_replied = $chat->another_user->id === $chat->from_id;
                $mapped->is_online = $chat->another_user->is_online === true;
                $mapped->created_at = $chat->created_at;
                $mapped->chat_type = ChatMessage::CHATS;

                $from = $chat->from_id === auth()->id() ? 'You ' : '';
                $mapped->body = $chat->body
                    ? $from . Str::limit(strip_tags($chat->body), 100)
                    : $from . $attachment;

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
                'attachments' => fn ($query) => $query->with('sent_by')->deletedInIds()
            ])
            ->forUserOrGroup($id)
            ->deletedInIds()
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
