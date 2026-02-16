<?php

namespace App\Http\Controllers;

use App\Traits\Chat;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
            return Inertia::render('Chats/Index');
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
