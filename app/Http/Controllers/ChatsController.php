<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\User;
use App\Traits\Chat;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class ChatsController extends Controller
{
    use Chat;

    /**
     * @return Response|void
     */
    public function index()
    {
        try {
            $chats = $this->chats();

            return Inertia::render('Chats/Index', [
                'chats' => $chats,
            ]);
        } catch (Exception $e) {
            dd($e->getMessage());
        }
    }

    /**
     * @param string $userId
     * @return Response|void
     */
    public function show(string $userId)
    {
        try {
            $user = User::query()->find($userId);

            if (!$user) {
                throw new Exception("User not found");
            }

            $user->chat_type = ChatMessage::CHATS;

            $chats = $this->chats();

            $messages = $this->messages($userId);

            return Inertia::render('Chats/Show', [
                'user' => $user,
                'chats' => $chats,
                'messages' => $messages,
            ]);
        } catch (Exception $e) {
            report($e);
            dd($e->getMessage());
        }
    }

    /**
     * @return JsonResponse
     */
    public function loadChats()
    {
        try {
            $chats = $this->chats();

            return $this->ok($chats);
        } catch (Exception $e) {
            return $this->failed($e->getMessage());
        }
    }

    public function loadMessages(string $id)
    {
        try {
            $messages = $this->messages($id);

            return $this->ok($messages);
        } catch (Exception $e) {
            return $this->failed($e->getMessage());
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @throws Throwable
     */
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $attachments = [];
            if ($request->hasFile('attachments')) {
                /**
                 * @var UploadedFile $attachment
                 */
                foreach ($request->file('attachments') as $attachment) {
                    $extension = $attachment->getClientOriginalExtension();
                    $filename = Str::uuid() . '.' . $extension;

                    $attachments[] = [
                        'original_name' => $attachment->getClientOriginalName(),
                        'file_name' => $filename,
                        'file_path' => '/storage/chats/' . auth()->id(),
                        'file_size' => $attachment->getSize(),
                        'file_type' => in_array($extension, $this->validImageExtensions) ? 'media' : 'files',
                        'sent_by_id' => auth()->id(),
                    ];

                    Storage::disk('public')->putFileAs('/chats/' . auth()->id(), $attachment, $filename);
                }
            }

            /**
             * @var ChatMessage $chat
             */
            $chat = ChatMessage::query()->create([
                'from_id' => auth()->id(),
                'to_id' => $request->to_id,
                'to_type' => USer::class,
                'body' => $request->body,
            ]);

            $chat->attachments()->createMany($attachments);

            $chat->load('attachments');

            DB::commit();

            return $this->ok(data: $chat, code: 201);
        } catch (Exception $e) {
            DB::rollBack();

            return $this->failed($e->getMessage());
        }
    }

    /**
     * @throws Throwable
     */
    public function destroy(string $id)
    {
        DB::beginTransaction();
        try {
            $chat = ChatMessage::query()->find($id);
            if (!$chat) {
                throw new Exception("Chat not found");
            }

            $deletedInId = collect(json_decode($chat->deleted_in_id) ?? []);
            if ($chat->to instanceof User && $deletedInId->count() > 0) {
                $chat->delete();

                foreach ($chat->attachments as $attachment) {
                    $filePath = $attachment->file_path . DIRECTORY_SEPARATOR . $attachment->file_name;
                    remove_file($filePath);
                }
            } else {
                $chat->update([
                    'deleted_in_id' => json_encode($deletedInId->push(['id' => auth()->id()])->toArray()),
                ]);

                foreach ($chat->attachments as $attachment) {
                    $deletedAttachmentInId = collect(json_decode($attachment->deleted_in_id) ?? []);
                    $attachment->update([
                        'deleted_in_id' => json_encode($deletedAttachmentInId->push(['id' => auth()->id()])->toArray()),
                    ]);
                }
            }

            DB::commit();

            return $this->ok(code: 204);
        } catch (Exception $e) {
            DB::rollBack();

            return $this->failed($e->getMessage());
        }
    }

    /**
     * @throws Throwable
     */
    public function deleteSelectedFile(string $id, string $fileName)
    {
        DB::beginTransaction();
        try {
            $chat = ChatMessage::query()->find($id);
            if (!$chat) {
                throw new Exception("Chat not found");
            }

            $attachment = $chat->attachments()->where('file_name', $fileName)->first();
            if ($attachment) {
                $deletedAttachmentInId = collect(json_decode($attachment->deleted_in_id) ?? []);
                $attachment->update([
                    'deleted_in_id' => json_encode($deletedAttachmentInId->push(['id' => auth()->id()])->toArray()),
                ]);
            }

            DB::commit();

            return $this->ok(code: 204);
        } catch (Exception $e) {
            DB::rollBack();

            return $this->failed($e->getMessage());
        }
    }

    /**
     * @throws Throwable
     */
    public function markAsRead(string $id)
    {
        DB::beginTransaction();
        try {
            ChatMessage::forUserOrGroup($id)
                ->notSeen()
                ->select('id', 'seen_in_id')
                ->get()
                ->each(function ($chat) {
                    $seenInId = collect(json_decode($chat->seen_in_id) ?? []);
                    $seenInId = json_encode($seenInId->push(['id' => auth()->id(), 'seen_at' => now()])->toArray());

                    $chat->update([
                        'seen_in_id' => $seenInId,
                    ]);
                });

            $latestMessage = ChatMessage::forUserOrGroup($id)
                ->latest()
                ->first();

            DB::commit();

            return $this->ok($latestMessage);
        } catch (Exception $e) {
            DB::rollBack();

            return $this->failed($e->getMessage());
        }
    }
}
