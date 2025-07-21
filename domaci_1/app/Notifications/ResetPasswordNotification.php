<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    public $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
         $frontendUrl = 'http://localhost:3000/reset-password'; // ili gde korisnik menja lozinku
        return (new MailMessage)
            ->subject('Reset Password Notification')
            ->line('Click the button below to reset your password:')
            ->action('Reset Password', url("/reset-password/{$this->token}"))
            ->line('If you did not request a password reset, no further action is required.');
    }
}