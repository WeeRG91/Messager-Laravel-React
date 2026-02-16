<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Route;
use \Illuminate\Auth\Middleware\RedirectIfAuthenticated as MiddlewareRedirectIfAuthenticated;

class RedirectIfAuthenticated extends MiddlewareRedirectIfAuthenticated
{
    /**
     * Get the default URI the user should be redirected to when they are authenticated.
     */
    protected function defaultRedirectUri(): string
    {
        $uri = 'chats';
        if (Route::has($uri)) {
            return route($uri);
        }

        $routes = Route::getRoutes()->get('GET');

        if (isset($routes[$uri])) {
            return '/'.$uri;
        }

        return '/';
    }
}
