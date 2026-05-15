<?php

namespace App\Dto\Site;

use Symfony\Component\Validator\Constraints as Assert;

class CreateSiteDTO
{
    public function __construct(
        #[Assert\NotBlank(message: 'Le nom du site est obligatoire')]
        public readonly string $name,
    )
    {
    }
}
