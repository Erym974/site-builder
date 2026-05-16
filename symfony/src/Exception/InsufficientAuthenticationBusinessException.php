<?php

namespace App\Exception;

class InsufficientAuthenticationBusinessException extends BusinessException
{
    public function __construct(
        string $message = "Vous devez être connecté pour accéder à cette ressource.",
        int $code = 401,
        \Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
    }
}
