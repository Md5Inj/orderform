<?php

declare(strict_types=1);

namespace Freento\OrderForm\Controller\File;

use Magento\Framework\App\Action\Context;
use Magento\Framework\App\Action\Action;
use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\Result\JsonFactory;

class Read extends Action
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
    public function execute(): Json
    {
        $resultJson = $this->resultJsonFactory->create();
        $file = $this->getRequest()->getFiles()->toArray();

        if (!isset($file['file'])) {
            return $resultJson->setData([]);
        }

        $fileName = $this->getRequest()->getFiles()->toArray()['file']['tmp_name'];
        $content = file($fileName);

        return $resultJson->setData(["content" => implode($content)]);
    }
}
