<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserMethodRestrictionMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();

        // Ako je user i pokušava PUT ili DELETE → zabrani
        if ($user->role === 'user' && in_array($request->method(), ['PUT', 'DELETE'])) {
            return response()->json(['message' => 'Access denied - Users cannot perform this action'], 403);
        }

        return $next($request);
    }
}
