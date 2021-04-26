<?php

declare(strict_types=1);

namespace Freento\OrderForm\Controller\Cart;

use Magento\Checkout\Model\Cart;
use Magento\Framework\App\Action\Context;
use Magento\Framework\App\Action\Action;
use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\Controller\ResultInterface;
use Magento\Framework\View\Result\PageFactory;
use Magento\Quote\Api\CartRepositoryInterface;
use Magento\Quote\Model\QuoteFactory;

class Clear extends Action
{
    /**
     * @var QuoteFactory
     */
    private $quoteFactory;

    /**
     * @var PageFactory
     */
    private $resultPageFactory;

    /**
     * Add constructor.
     *
     * @param QuoteFactory $quoteFactory
     * @param PageFactory $resultPageFactory
     * @param Context $context
     */
    public function __construct(
        CartRepositoryInterface $quoteRepository,
        PageFactory $resultPageFactory,
        Context $context
    ) {
        $this->quoteRepository = $quoteRepository;
        $this->resultPageFactory = $resultPageFactory;

        parent::__construct($context);
    }

    /**
     * @return ResultInterface
     */
    public function execute(): ResultInterface
    {
        $result = $this->resultPageFactory->create();
        $cartId = $this->getRequest()->getParam('cartId');
        $quote = $this->quoteRepository->getActive($cartId);
        $quote->removeAllItems();
        $quote->save();

        return $result;
    }
}
