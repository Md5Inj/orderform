<?php

declare(strict_types=1);

namespace Freento\OrderForm\Model\Indexer;

class ElasticSearchProductTypeStructureMapper
{
    public const TYPE_ID = 'type_id';
    public const TYPE_STRING = 'string';

    /**
     * @return array
     */
    public function buildEntityFields(): array
    {
        return [self::TYPE_ID => ['type' => self::TYPE_STRING]];
    }
}
