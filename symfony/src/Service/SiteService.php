<?php

namespace App\Service;

use App\Dto\Page\CreatePageDTO;
use App\Dto\Page\UpdatePuckDTO;
use App\Dto\Site\CreateSiteDTO;
use App\Entity\Page;
use App\Entity\Site;
use App\Entity\User;
use App\Enum\SiteRoleEnum;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Cocur\Slugify\Slugify;

readonly class SiteService
{

    public function __construct(
        private EntityManagerInterface $entityManager,
    )
    {
    }

    public function createSite(CreateSiteDTO $createSiteDTO, User $user): Site
    {
        $site = new Site();
        $site->setName($createSiteDTO->name);
        $slugify = new Slugify();
        $site->setSlug($slugify->slugify($createSiteDTO->name));

        $this->entityManager->persist($site);
        $this->entityManager->flush();

        $this->addSiteMember($site, $user, SiteRoleEnum::ADMIN);
        $this->addPage($site, new Page()->setTitle("Home")->setPath("/")->setDraftContent([
            'root' => [
                'props' => [],
            ],
            'content' => [],
            'zones' => [],
        ]));

        return $site;
    }

    public function createPage(Site $site, CreatePageDTO $createPageDTO) : Page {
        $page = new Page();
        $page->setTitle($createPageDTO->name);
        $slugify = new Slugify();
        $parentPath = rtrim($createPageDTO->parentPath, '/') . '/';
        $page->setPath($parentPath . $slugify->slugify($createPageDTO->name));
        $page->setSite($site);
        $page->setDraftContent([
            'root' => [
                'props' => [],
            ],
            'content' => [],
            'zones' => [],
        ]);
        $this->entityManager->persist($page);
        $this->entityManager->flush();
        return $page;
    }

    public function getPageByPath(Site $site, string $path): Page
    {
        return $this->entityManager->getRepository(Page::class)->findOneBy([
            'site' => $site,
            'path' => $path,
        ]) ?? throw new NotFoundHttpException("Page not found for path: $path");
    }

    public function addPage(Site $site, Page $page): void
    {
        $site->addPage($page);
        $this->entityManager->persist($page);
        $this->entityManager->persist($site);
        $this->entityManager->flush();
    }

    public function addSiteMember(Site $site, User $user, string $role): void
    {

        $site->addUser($user);
        $user->addRole("ROLE_SITE_" . $site->getSlug() . "_" . $role);

        $this->entityManager->persist($site);
        $this->entityManager->persist($user);
        $this->entityManager->flush();
    }

    public function removeSiteMember(Site $site, User $user): void
    {
        $site->removeUser($user);

        $prefix = "ROLE_SITE_" . $site->getSlug() . "_";

        $roles = array_filter(
            $user->getRoles(),
            fn(string $role) => !str_starts_with($role, $prefix)
        );

        $user->setRoles(array_values($roles));

        $this->entityManager->persist($site);
        $this->entityManager->persist($user);
        $this->entityManager->flush();
    }

    public function updatePuckPage(Page $page, UpdatePuckDTO $dto) : Page {
        if($dto->mode === "live") {
            $page->setLiveContent([
                'root' => ['props' => $dto->data->root->props],
                'content' => array_map(fn($item) => [
                    'type' => $item->type,
                    'props' => $item->props,
                ], $dto->data->content),
                'zones' => $dto->data->zones,
            ]);
        } else {
            $page->setDraftContent([
                'root' => ['props' => $dto->data->root->props],
                'content' => array_map(fn($item) => [
                    'type' => $item->type,
                    'props' => $item->props,
                ], $dto->data->content),
                'zones' => $dto->data->zones,
            ]);
        }
        $this->entityManager->persist($page);
        $this->entityManager->flush();
        return $page;
    }
}
