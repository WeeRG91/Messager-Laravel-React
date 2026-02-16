<?php

namespace App\Http\Controllers;

abstract class Controller
{
    public function ok($data = null, string $message = "success", int $code = 200)
    {
        return response()->json([
            'data' => $data,
            'message' => $message,
        ], $code);
    }

    public function failed(string $message = 'failure', int $code = 400)
    {
        return response()->json([
            'message' => $message,
        ], $code);
    }
}
