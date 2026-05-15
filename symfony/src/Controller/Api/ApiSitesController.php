<?php

namespace App\Controller\Api;

use App\Dto\Page\CreatePageDTO;
use App\Dto\Page\FindPageDTO;
use App\Dto\Page\UpdatePuckDTO;
use App\Dto\Site\CreateSiteDTO;
use App\Entity\Page;
use App\Entity\Site;
use App\Entity\User;
use App\Service\SiteService;
use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/sites', name: 'api_sites_')]
#[IsGranted('ROLE_USER')]
final class ApiSitesController extends AbstractController
{

    public function __construct(
        private readonly UserService $userService,
        private readonly SiteService $siteService
    )
    {

    }

    #[Route('', name: 'find', methods: ["GET"])]
    public function find(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $sites = $this->userService->getUserSites($user);
        return $this->json($sites, Response::HTTP_OK, [], ['groups' => ['sites:find']]);
    }

    #[Route('/{slug:site}', name: 'findOne', methods: ["GET"])]
    public function findOne(
        Site $site
    ): JsonResponse
    {
        return $this->json($site, Response::HTTP_OK, [], ['groups' => ['sites:findOne']]);
    }

    #[Route('/{slug:site}/page', name: 'findOnePage', methods: ["GET"])]
    public function findOnePage(
        Site $site,
        #[MapQueryString] FindPageDTO $query
    ): JsonResponse
    {
        $page = $this->siteService->getPageByPath($site, $query->path);
        if ($query->renderMode === 'live' && $page->getLiveContent() === null) {
            throw new NotFoundHttpException("Page not found for path: $query->path");
        }
        return $this->json($page, Response::HTTP_OK, [], ['groups' => ['pages:findOne', 'pages:findOne:' . $query->renderMode]]);
    }

    #[Route('/{slug:site}/pages', name: 'findPages', methods: ["GET"])]
    public function findPages(
        Site $site,
    ): JsonResponse
    {
        return $this->json($site->getPages(), Response::HTTP_OK, [], ['groups' => ['pages:find']]);
    }

    #[Route('/{slug:site}/pages', name: 'createPage', methods: ["POST"])]
    public function createPage(
        Site $site,
        #[MapRequestPayload] CreatePageDTO $createPageDTO
    ): JsonResponse
    {
        $page = $this->siteService->createPage($site, $createPageDTO);
        return $this->json($page, Response::HTTP_OK, [], ['groups' => ['pages:findOne', 'pages:findOne:draft']]);
    }

    #[Route('/{slug:site}/pages/{page}/puck', name: 'updatePuckData', methods: ["PUT"])]
    public function updatePuckData(
        Site $site,
        Page $page,
        #[MapRequestPayload] UpdatePuckDTO $updatedDataDto
    ): JsonResponse
    {
        $page = $this->siteService->updatePuckPage($page, $updatedDataDto);
        return $this->json($page, Response::HTTP_OK, [], ['groups' => ['pages:findOne']]);
    }

    #[Route('', name: 'post', methods: ["POST"])]
    public function post(
        #[MapRequestPayload] CreateSiteDTO $createSiteDTO
    ): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $site = $this->siteService->createSite($createSiteDTO, $user);
        return $this->json($site, Response::HTTP_CREATED, [], ['groups' => ['sites:findOne']]);
    }
}
