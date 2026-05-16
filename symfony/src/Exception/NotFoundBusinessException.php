<?php

namespace App\Exception;

class NotFoundBusinessException extends BusinessException
{
    public function __construct(
        string $message = "La ressource demandée est introuvable.",
        int $code = 404,
        \Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
    }
}
