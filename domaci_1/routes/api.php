<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\{
    AccountController,
    CategoryController,
    TransactionController,
    AuthController,
    PasswordResetController
};

use App\Http\Middleware\UserMethodRestrictionMiddleware;
use App\Http\Middleware\AdminMiddleware;

/*
|--------------------------------------------------------------------------
| Public (no auth)
|--------------------------------------------------------------------------
*/
Route::post('login',    [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);

Route::post('forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('reset-password',  [PasswordResetController::class, 'reset']);

// health/debug 
Route::get('hi', fn () => response()->json(['ok' => true]));

/*
|--------------------------------------------------------------------------
| Protected (auth + ograničenja po ulozi)
|--------------------------------------------------------------------------
|  - auth:sanctum   → mora validan Bearer token
|  - UserMethodRestrictionMiddleware → user može samo GET/POST (PUT/PATCH/DELETE se blokiraju)
*/
Route::middleware(['auth:sanctum', UserMethodRestrictionMiddleware::class])->group(function () {

    // Ko sam ja
    Route::get('me', fn (Request $request) => $request->user());

    // Logout
    Route::post('logout', [AuthController::class, 'logout']);

    // Accounts (user: GET/POST; admin: sve)
    Route::apiResource('accounts', AccountController::class);

    // Categories
    Route::get('categories',           [CategoryController::class, 'index']);
    Route::post('categories',          [CategoryController::class, 'store']);
    Route::get('categories/{id}',      [CategoryController::class, 'show']);
    Route::put('categories/{id}',      [CategoryController::class, 'update']);
    Route::delete('categories/{id}',   [CategoryController::class, 'destroy']);

    // Transactions
    Route::get('transactions',         [TransactionController::class, 'index']);
    Route::post('transactions',        [TransactionController::class, 'store']);
    Route::get('transactions/{id}',    [TransactionController::class, 'show']);
    Route::put('transactions/{id}',    [TransactionController::class, 'update']);
    Route::delete('transactions/{id}', [TransactionController::class, 'destroy']);

    Route::get('users', [AuthController::class, 'index']);

    /*
    |--------------------------------------------------------------------------
    | Admin‑only (dodatne privilegije)
    |--------------------------------------------------------------------------
    */
    Route::middleware([AdminMiddleware::class])->group(function () {
        Route::delete('users/{id}', [AuthController::class, 'destroy']);
    });
});