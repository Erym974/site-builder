<?php

namespace App\Exception;

class BusinessException extends \Exception {

    public array $errors = [];

    public function __construct(string $message, int $code, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

    public function getErrors(): array {
        return $this->errors;
    }

    public function setErrors(array $errors) : static {
        $this->errors = $errors;
        return $this;
    }

}
