<?php

declare(strict_types=1);

namespace Freento\OrderForm\Plugin;

use Freento\OrderForm\Model\Indexer\ElasticSearchProductTypeDataMapper;
use Freento\OrderForm\Model\Indexer\ElasticSearchProductTypeStructureMapper;

class ProductDataMapperPlugin
{
    /**
     * @var ElasticSearchProductTypeDataMapper
     */
    private $mapper;

    public function __construct(ElasticSearchProductTypeDataMapper $mapper)
    {
        $this->mapper = $mapper;
    }

    /**
     * Prepare index data for using in search engine metadata.
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     * @param $subject
     * @param callable $proceed
     * @param array $documentData
     * @param $storeId
     * @param array $context
     * @return array
     */
    public function aroundMap(
        $subject,
        callable $proceed,
        array $documentData,
        $storeId,
        $context = []
    ): array {
        $documentData = $proceed($documentData, $storeId, $context);

        $productTypeIds = $this->mapper->map($documentData, $storeId);
        $fieldName = ElasticSearchProductTypeStructureMapper::TYPE_ID;
        foreach ($documentData as $productId => $document) {
            if (isset($productTypeIds[$productId])) {
                $documentData[$productId][$fieldName] = $productTypeIds[$productId][$fieldName];
            }
        }

        return $documentData;
    }
}
