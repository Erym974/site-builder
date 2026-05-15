<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/users', name: 'api_users_')]
#[IsGranted('ROLE_USER')]
final class ApiUserController extends AbstractController
{
    #[Route('/me', name: 'findMe')]
    public function findMe(): JsonResponse
    {
        $user = $this->getUser();
        return $this->json($user, Response::HTTP_OK, [], ['groups' => ['users:findMe']]);
    }
}
