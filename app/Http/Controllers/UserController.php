<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class UserController extends Controller
{

    /**
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     * @throws Throwable
     */
    public function update(Request $request, string $id)
    {
        DB::beginTransaction();
        try {
            $user = User::query()->find($id);
            if (!$user) {
                throw new Exception('User not found');
            }

            $user->update($request->only('active_status'));

            DB::commit();
            return $this->ok($user);
        } catch (Exception $e) {
            DB::rollBack();
            return $this->failed($e->getMessage());
        }
    }
}
