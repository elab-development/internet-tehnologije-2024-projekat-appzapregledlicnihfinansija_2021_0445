<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Http\Resources\AccountResource;


class AccountController extends Controller
{
    // Prikaz svih kategorija
    public function index(Request $request)
    {
        $query = Account::query();

    // Filtriranje po user_id ako je prosleđen
        if ($request->has('user_id')) {
         $query->where('user_id', $request->user_id);
        }

         // Paginacija sa 10 po strani
         return AccountResource::collection($query->paginate(10));
    }


    // Kreiranje novog naloga
    public function store(Request $request)
    {
        $request->validate([
            'account_name' => 'required|string|max:255',
            'balance' => 'required|numeric',
        ]);

        $account = Account::create($request->all());
        return response()->json($account, 201)->setEncodingOptions(JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);;  // Status 201 znači da je resurs uspešno kreiran
    }

    // Prikaz jednog naloga
    public function show($id)
    {
       $account = \App\Models\Account::find($id);

            if (!$account) {
                 return response()->json(['message' => 'Account not found'], 404);
                }

         return new AccountResource($account);
    }

    // Ažuriranje postojećeg naloga
    public function update(Request $request, $id)
    {
        $account = Account::find($id);

        if (!$account) {
            return response()->json(['message' => 'Account not found'], 404)->setEncodingOptions(JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);;
        }

        $account->update($request->all());
        return response()->json($account)->setEncodingOptions(JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);;
    }

    // Brisanje naloga
    public function destroy($id)
    {
        $account = Account::find($id);

        if (!$account) {
            return response()->json(['message' => 'Account not found'], 404)->setEncodingOptions(JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);;
        }

        $account->delete();
        return response()->json(['message' => 'Account deleted successfully'])->setEncodingOptions(JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);;
    }
}