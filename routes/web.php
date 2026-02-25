<?php

use App\Http\Controllers\ChatsController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home')->middleware('guest');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::patch('/users/{id}', [UserController::class, 'update'])->name('user.update');

    Route::get('/chats', [ChatsController::class, 'index'])->name('chats.index');
    Route::get('/chats/{userId}', [ChatsController::class, 'show'])->name('chats.show');
    Route::get('/chats/{id}/messages', [ChatsController::class, 'loadMessages'])->name('chats.messages');
    Route::get('/chats/users', [ChatsController::class, 'loadChats'])->name('chats.users');
    Route::get('/contacts', [ChatsController::class, 'index'])->name('contacts.index');
    Route::get('/archived-chats', [ChatsController::class, 'index'])->name('archived-chats.index');
    Route::post('/chats', [ChatsController::class, 'store'])->name('chats.store');
});

require __DIR__.'/auth.php';
