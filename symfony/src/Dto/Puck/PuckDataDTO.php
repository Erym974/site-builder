<?php

namespace App\Dto\Puck;

class PuckDataDTO
{
    public PuckRootDTO $root;
    /** @var PuckContentItemDTO[] */
    public array $content = [];
    public array $zones = [];
}
