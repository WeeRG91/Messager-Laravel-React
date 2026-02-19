<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\User;
use App\Traits\Chat;
use Exception;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

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

    public function show(string $userId)
    {
        try {
            $user = User::query()->find($userId);

            if (!$user) {
                throw new Exception("User not found");
            }

            $user->chat_type = ChatMessage::CHATS;

            $chats = $this->chats();

            return Inertia::render('Chats/Show', [
                'user' => $user,
                'chats' => $chats
            ]);
        } catch (Exception $e) {
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
}
