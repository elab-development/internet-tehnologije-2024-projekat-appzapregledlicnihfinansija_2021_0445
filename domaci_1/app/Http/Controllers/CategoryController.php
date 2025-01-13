<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    // Prikaz svih kategorija
    public function index()
    {
        $categories = Category::all();
        return response()->json($categories)->setEncodingOptions(JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    }

    // Kreiranje nove kategorije
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category = Category::create($request->all());
        return response()->json($category, 201)->setEncodingOptions(JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);;
    }

    // Prikaz jedne kategorije
    public function show($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404)->setEncodingOptions(JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        }

        return response()->json($category)->setEncodingOptions(JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    }

    // Ažuriranje postojeće kategorije
    public function update(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404)->setEncodingOptions(JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        }

        $category->update($request->all());
        return response()->json($category)->setEncodingOptions(JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    }

    // Brisanje kategorije
    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404)->setEncodingOptions(JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        }

        $category->delete();
        return response()->json(['message' => 'Category deleted successfully'])->setEncodingOptions(JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    }
}