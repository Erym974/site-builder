<?php

namespace App\Command;

use App\Service\UserService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:make:user',
    description: 'Creates a new user',
)]
class MakeUserCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserService $userService,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('email', InputArgument::OPTIONAL, 'The email of the user')
            ->addArgument('password', InputArgument::OPTIONAL, 'The plain password of the user')
            ->addArgument('roles', InputArgument::IS_ARRAY, 'Roles of the user (ex: ROLE_ADMIN ROLE_USER)');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $email     = $input->getArgument('email')     ?? $io->ask('Email');
        $password  = $input->getArgument('password')  ?? $io->askHidden('Password');
        $roles     = $input->getArgument('roles') ?: $io->ask('Roles (comma-separated, ex: ROLE_ADMIN,ROLE_USER)', 'ROLE_USER', fn($r) => explode(',', $r));

        $user = $this->userService->createUser($email, $password, $roles);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $io->success("User $email created successfully with roles: " . implode(', ', $user->getRoles()));

        return Command::SUCCESS;
    }
}
