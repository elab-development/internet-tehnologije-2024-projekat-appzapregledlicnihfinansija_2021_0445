<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    // logovanje
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Kreiraj token
        $token = $user->createToken('authToken')->plainTextToken;

        // Vrati i role
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,          // Dodato
            'role' => $user->role     // Dodato
        ]);
    }

    // registracija
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'in:user,admin' // dozvoljavamo user/admin
        ]);

        // Snimamo i role (ako nije poslato -> user)
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role ?? 'user'  //  NOVO
        ]);

        // Generišemo token
        $token = $user->createToken('YourAppName')->plainTextToken;

        // Vraćamo token + podatke o korisniku
        return response()->json([
            'access_token' => $token,     
        'token_type' => 'Bearer',     
        'user' => $user,
        'role' => $user->role
        ]);
    }

    // logout
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Successfully logged out']);
    }

      // Admin-only: brisanje korisnika
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }

    public function index()
{
    return response()->json(User::all());
}
}