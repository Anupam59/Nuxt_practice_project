<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::get('/send-test-mail', function () {
    Mail::raw('This is a test mail from Laravel using Gmail SMTP.', function ($message) {
        $message->to('anupam.talukdar.ac@gmail.com')
                ->subject('Test Email');
    });

    return '✅ Mail sent successfully!';
});
