<?php

namespace App\Service;

use App\Entity\Site;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

readonly class UserService
{

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher
    ) {}

    /**
     * Créer un utilisateur
     * @param string $email
     * @param string $password
     * @param array $roles
     * @return User
     */
    public function createUser(string $email, string $password, array $roles) : User {
        $user = new User();
        $user->setEmail($email);
        $user->setPassword($this->passwordHasher->hashPassword($user, $password));
        $user->setRoles($roles);
        return $user;
    }

    /**
     * Retourne la liste des sites
     * @param User $user
     * @return array
     */
    public function getUserSites(User $user): array
    {
        return in_array('ROLE_ADMIN', $user->getRoles())
            ? $this->entityManager->getRepository(Site::class)->findAll()
            : $user->getSites()->toArray();
    }
}
