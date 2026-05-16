<?php

namespace App\EventListener;

use App\Exception\AccessDeniedBusinessException;
use App\Exception\InsufficientAuthenticationBusinessException;
use App\Exception\NotFoundBusinessException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Exception\InsufficientAuthenticationException;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;

class SecurityExceptionListener
{
    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();

        if ($exception instanceof InsufficientAuthenticationException) {
            $event->setThrowable(new InsufficientAuthenticationBusinessException(previous: $exception));
            return;
        }

        if ($exception instanceof AccessDeniedException) {
            $event->setThrowable(new AccessDeniedBusinessException(previous: $exception));
        }

        if ($exception instanceof NotFoundHttpException) {
            $event->setThrowable(new NotFoundBusinessException(previous: $exception));
        }
    }
}
