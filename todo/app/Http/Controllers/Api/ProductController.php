<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // 🔹 GET ALL PRODUCTS
    public function index()
    {
        $products = Product::all();
        return response()->json($products);
    }

    // 🔹 ADD NEW PRODUCT
    public function store(Request $request)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        // Save image in storage/app/public/products
        $imagePath = $request->file('image')->store('products', 'public');

        $product = Product::create([
            'name'  => $request->name,
            'image' => '/storage/' . $imagePath, // public URL
        ]);

        return response()->json([
            'message' => 'Product added successfully',
            'product' => $product,
        ], 201);
    }

    // 🔹 DELETE PRODUCT
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        // Delete image from storage
        if ($product->image) {
            $imagePath = str_replace('/storage/', '', $product->image);
            Storage::disk('public')->delete($imagePath);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
        ]);
    }


    public function show($id){
        $product = Product::findOrFail($id);
        return response()->json($product);
    }


    public function update(Request $request, $id){
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($product->image) {
                $oldImage = str_replace('/storage/', '', $product->image);
                Storage::disk('public')->delete($oldImage);
            }
            $imagePath = $request->file('image')->store('products', 'public');
            $product->image = '/storage/' . $imagePath;
        }

        $product->name = $request->name;
        $product->save();

        return response()->json($product);
    }

}