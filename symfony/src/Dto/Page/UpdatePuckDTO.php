<?php

namespace App\Dto\Page;

use App\Dto\Puck\PuckDataDTO;
use App\Dto\Puck\PuckRootDTO;

class UpdatePuckDTO
{
    public string $mode;
    public PuckDataDTO $data;
}
