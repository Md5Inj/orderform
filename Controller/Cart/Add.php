<?php

declare(strict_types=1);

namespace Freento\OrderForm\Controller\Cart;

use Magento\Framework\App\Action\Context;
use Magento\Framework\App\Action\Action;
use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\Result\JsonFactory;

class Add extends Action
{
    /**
     * @var JsonFactory
     */
    private $resultJsonFactory;

    /**
     * @param JsonFactory $resultJsonFactory
     * @param Context $context
     */
    public function __construct(
        JsonFactory $resultJsonFactory,
        Context $context
    ) {
        $this->resultJsonFactory = $resultJsonFactory;

        parent::__construct($context);
    }

    /**
     * @return Json
     */
    public function execute()
    {
        $resultJson = $this->resultJsonFactory->create();
        $products = $this->getRequest()->getParam('products');

        if (!isset($file['file'])) {
            return $resultJson->setData([]);
        }

        $fileName = $this->getRequest()->getFiles()->toArray()['file']['tmp_name'];
        $content = file($fileName);

        return $resultJson->setData(["content" => implode($content)]);
    }
}
