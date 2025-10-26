<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\Auth\AuthResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use App\Notifications\ResetPasswordNotificationCustom;


class AuthController extends Controller
{
    // 🔹 REGISTER
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => new AuthResource($user),
        ], 201);
    }

    // 🔹 LOGIN
    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'The provided credentials are incorrect.'
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => new AuthResource($user),
        ]);
    }

    // 🔹 LOGOUT
    public function logout()
    {
        $user = Auth::user();

        if ($user) {
            // বর্তমান লগইন টোকেন revoke করুন
            $user->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Logged out successfully'
            ]);
        }

        return response()->json([
            'message' => 'No authenticated user found.'
        ], 401);
    }


    // 🔹 FORGOT PASSWORD (Send Reset Link)
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['No user found with this email.']
            ]);
        }

        // Token generate
        $token = Password::createToken($user);

        // Nuxt frontend URL
        $frontendUrl = "http://localhost:3000/auth/reset?token={$token}&email={$user->email}";

        // Send email
        $user->notify(new ResetPasswordNotificationCustom($token, $frontendUrl));

        return response()->json(['message' => 'Reset link sent successfully!']);
    }


    // 🔹 RESET PASSWORD (Set New Password)
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->save();
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Password reset successfully!']);
        } else {
            return response()->json(['message' => 'Failed to reset password.'], 400);
        }
    }
}
