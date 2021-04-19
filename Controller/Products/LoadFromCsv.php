<?php

declare(strict_types=1);

namespace Freento\OrderForm\Controller\Products;

use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\ConfigurableProduct\Model\Product\Type\Configurable;
use Magento\Framework\App\Action\Context;
use Magento\Framework\App\Action\Action;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\Exception\NoSuchEntityException;

class LoadFromCsv extends Action
{
    /**
     * @var JsonFactory
     */
    private $resultJsonFactory;

    /**
     * @var ProductRepositoryInterface
     */
    private $productRepository;

    /**
     * @param ProductRepositoryInterface $productRepository
     * @param JsonFactory $resultJsonFactory
     * @param Context $context
     */
    public function __construct(
        ProductRepositoryInterface $productRepository,
        JsonFactory $resultJsonFactory,
        Context $context
    ) {
        $this->resultJsonFactory = $resultJsonFactory;
        $this->productRepository = $productRepository;

        parent::__construct($context);
    }

    public function processProducts($products)
    {
        $result = [
            'errors' => [],
            'items' => [],
            'total' => count($products)
        ];

        foreach ($products as $productSku) {
            if (!isset($productSku[0])) {
                continue;
            }

            if ($productSku[0] === "") {
                $result['total'] -= 1;
                continue;
            }

            $sku = $productSku[0];

            try {
                $product = $this->productRepository->get($sku);

                if ($product->getTypeId() === Configurable::TYPE_CODE) {
                    $result['errors'][$sku] = "We accept only simple products";
                    continue;
                }

                $result['items'][] = [
                    'price' => $product->getPrice(),
                    'SKU' => $product->getSku(),
                    'product_id' => $product->getId(),
                    'quantity' => $productSku[1]
                ];
            } catch (NoSuchEntityException $e) {
                $result['errors'][$sku] = $e->getMessage();
            }
        }

        return $result;
    }

    /**
     * @return \Magento\Framework\App\ResponseInterface|\Magento\Framework\Controller\Result\Json|\Magento\Framework\Controller\ResultInterface
     */
    public function execute()
    {
        $resultJson = $this->resultJsonFactory->create();
        $products = $this->getRequest()->getParam('products');

        if (!isset($products) && !isset($file['file'])) {
            return $resultJson->setData([]);
        }

        $products = json_decode($products);

        $result = $this->processProducts($products);

        return $resultJson->setData($result);
    }
}
