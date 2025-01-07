<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Account;


class AccountController extends Controller
{
    public function __construct()
{
    $this->middleware('auth:sanctum')->only(['store', 'update', 'destroy']);
}

    // Prikaz svih naloga
    public function index()
    {
        $accounts = Account::all();
        return response()->json($accounts);
    }

    // Kreiranje novog naloga
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'balance' => 'required|numeric',
        ]);

        $account = Account::create($request->all());
        return response()->json($account, 201);  // Status 201 znači da je resurs uspešno kreiran
    }

    // Prikaz jednog naloga
    public function show($id)
    {
        $account = Account::find($id);

        if (!$account) {
            return response()->json(['message' => 'Account not found'], 404);
        }

        return response()->json($account);
    }

    // Ažuriranje postojećeg naloga
    public function update(Request $request, $id)
    {
        $account = Account::find($id);

        if (!$account) {
            return response()->json(['message' => 'Account not found'], 404);
        }

        $account->update($request->all());
        return response()->json($account);
    }

    // Brisanje naloga
    public function destroy($id)
    {
        $account = Account::find($id);

        if (!$account) {
            return response()->json(['message' => 'Account not found'], 404);
        }

        $account->delete();
        return response()->json(['message' => 'Account deleted successfully']);
    }
}