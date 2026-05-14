<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/sites', name: 'api_sites_')]
#[IsGranted('ROLE_USER')]
final class ApiSitesController extends AbstractController
{
    #[Route('/', name: 'find')]
    public function find(): JsonResponse
    {
        return $this->json([]);
    }
}
