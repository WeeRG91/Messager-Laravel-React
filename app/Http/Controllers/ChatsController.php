<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\User;
use App\Traits\Chat;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            $chat = ChatMessage::query()->create([
                'from_id' => auth()->id(),
                'to_id' => $request->to_id,
                'to_type' => USer::class,
                'body' => $request->body,
            ]);

            DB::commit();

            return $this->ok(data: $chat, code: 201);
        } catch (Exception $e) {
            DB::rollBack();

            return $this->failed($e->getMessage());
        }
    }
}
