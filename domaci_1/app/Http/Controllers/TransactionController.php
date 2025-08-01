<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Http\Resources\TransactionResource;


class TransactionController extends Controller
{
   
    public function index(Request $request)
{
    $perPage = $request->input('per_page', 5);

    $transactions = Transaction::with(['category', 'account.user']) 
        ->whereHas('account', function ($query) {
            $query->where('user_id', auth()->id());
        })
        ->orderBy('created_at', 'desc')
        ->paginate($perPage);

    return response()->json($transactions);
}



    // Kreiranje nove transakcije
    public function store(Request $request)
{
    $request->validate([
        'account_id' => 'required|exists:accounts,id',
        'amount' => 'required|numeric|min:0',
        'details' => 'required|string|max:255',
        'type' => 'required|in:income,expense'
    ]);

    // Create the transaction
    $transaction = Transaction::create($request->all());

    // Adjust the account balance
    $account = \App\Models\Account::find($request->account_id);

    if ($request->type === 'expense') {
        $account->balance -= $request->amount;
    } elseif ($request->type === 'income') {
        $account->balance += $request->amount;
    }

    $account->save();

    return response()->json($transaction, 201)
        ->setEncodingOptions(JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
}


    // Prikaz jedne transakcije
   public function show($id)
    {
         $transaction = \App\Models\Transaction::find($id);

            if (!$transaction) {
             return response()->json(['message' => 'Transaction not found'], 404);
             }

         return new TransactionResource($transaction);
    }

    // Ažuriranje postojeće transakcije
    public function update(Request $request, $id)
    {
        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found'], 404)->setEncodingOptions(JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        }

        $transaction->update($request->all());
        return response()->json($transaction)->setEncodingOptions(JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    }

    // Brisanje transakcije
    public function destroy($id)
    {
        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found'], 404)->setEncodingOptions(JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        }

        $transaction->delete();
        return response()->json(['message' => 'Transaction deleted successfully'])->setEncodingOptions(JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    }
}