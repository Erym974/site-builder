<?php

namespace App\EventListener;

use App\Exception\BusinessException;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\Validator\Exception\ValidationFailedException;

readonly class ApiErrorListener
{
    public function __construct(private LoggerInterface $logger) {}

    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        $request = $event->getRequest();

        $businessException = $this->findException($exception, BusinessException::class);
        $validatorException = $this->findException($exception, ValidationFailedException::class);

        $errors = [];

        if ($validatorException !== null) {
            $violations = $validatorException->getViolations();
            $statusCode = Response::HTTP_UNPROCESSABLE_ENTITY;
            $exceptionMessage = $violations[0]->getMessage();
        } elseif ($businessException !== null) {
            $statusCode = $businessException->getCode();
            $exceptionMessage = $businessException->getMessage();
            if($businessException->getErrors()) {
                $errors = $businessException->getErrors();
            }
        } else {
            $statusCode = Response::HTTP_INTERNAL_SERVER_ERROR;
            $exceptionMessage = "Une erreur interne est survenue.";
        }

        $logContext = [
            '_route' => $request->attributes->get('_route'),
            'message' => $exception->getMessage(),
            'status_code' => $statusCode,
            'business_exception' => $businessException !== null,
            'line' => $exception->getLine(),
        ];

        $this->logger->error(get_class($exception), $logContext);

        $payload = [
            'status' => false,
            'message' => $exceptionMessage,
        ];

        if(count($errors) > 0) {
            $payload['errors'] = $errors;
        }

        $event->setResponse(new JsonResponse($payload, $statusCode));
    }

    /**
     * @template T of \Throwable
     * @param class-string<T> $type
     * @return T|null
     */
    private function findException(\Throwable $exception, string $type): ?\Throwable
    {
        $current = $exception;

        while ($current !== null) {
            if ($current instanceof $type) {
                return $current;
            }
            $current = $current->getPrevious();
        }

        return null;
    }
}
