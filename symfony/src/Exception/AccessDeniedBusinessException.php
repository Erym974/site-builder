<?php

namespace App\Exception;

class AccessDeniedBusinessException extends BusinessException
{
    public function __construct(
        string $message = "Vous n'avez pas la permission d'accéder à cette ressource.",
        int $code = 403,
        \Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
    }
}
