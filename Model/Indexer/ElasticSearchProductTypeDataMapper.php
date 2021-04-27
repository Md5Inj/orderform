<?php

declare(strict_types=1);

namespace Freento\OrderForm\Model\Indexer;

use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Model\ResourceModel\Product\CollectionFactory;
use Magento\Framework\Exception\NoSuchEntityException;

class ElasticSearchProductTypeDataMapper
{
    /**
     * @var CollectionFactory
     */
    private $productCollectionFactory;

    /**
     * @var array
     */
    private $products = [];

    /**
     * @var ProductRepositoryInterface
     */
    protected $productRepository;

    public function __construct(
        CollectionFactory $productCollectionFactory,
        ProductRepositoryInterface $productRepository
    ) {
        $this->productCollectionFactory = $productCollectionFactory;
        $this->productRepository = $productRepository;
    }

    /**
     * @param array $documentData
     * @param string $storeId
     * @return array
     */
    public function map(array $documentData, string $storeId): array
    {
        $storeId = intval($storeId);
        $stockStatusDocumentData = [];
        $fieldName = ElasticSearchProductTypeStructureMapper::TYPE_ID;
        foreach ($documentData as $productId => $document) {
            if (!isset($document[$fieldName])) {
                $productType = $this->getProductTypeId($productId, $storeId);
                $stockStatusDocumentData[$productId][$fieldName] = $productType;
            }
        }

        return $stockStatusDocumentData;
    }

    /**
     * Return product type_id
     *
     * @param int $entityId
     * @param int $storeId
     * @return string|null
     * @throws NoSuchEntityException
     */
    private function getProductTypeId(int $entityId, int $storeId): ?string
    {
        $productIds = $this->getProductIds($storeId);

        foreach ($productIds as $productId) {
            $product = $this->productRepository->getById($productId);

            if (intval($product->getId()) === $entityId) {
                return $product->getTypeId();
            }
        }

        return null;
    }

    /**
     * @param int $storeId
     * @return array
     */
    private function getProductIds(int $storeId): array
    {
        if (!isset($this->products[$storeId])) {
            $collection = $this->productCollectionFactory->create()->addStoreFilter($storeId);
            $this->products[$storeId] = $collection->getAllIds();
        }

        return $this->products[$storeId];
    }
}
