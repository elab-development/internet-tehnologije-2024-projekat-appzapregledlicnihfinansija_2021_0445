<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Http\Resources\TransactionResource;


class TransactionController extends Controller
{
   
    public function index(Request $request)
    {
        $query = Transaction::query();

        if ($request->has('account_id')) {
            $query->where('account_id', $request->account_id);
        }

        return TransactionResource::collection($query->paginate(10));
    }


    // Kreiranje nove transakcije
    public function store(Request $request)
    {
        $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'amount' => 'required|numeric',
            'details' => 'required|string|max:255',
        ]);

        $transaction = Transaction::create($request->all());
        return response()->json($transaction, 201)->setEncodingOptions(JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
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