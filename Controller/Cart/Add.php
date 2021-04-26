<?php

declare(strict_types=1);

namespace Freento\OrderForm\Controller\Cart;

use Magento\Checkout\Model\Cart;
use Magento\Framework\App\Action\Context;
use Magento\Framework\App\Action\Action;
use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\Controller\ResultInterface;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Quote\Api\CartRepositoryInterface;
use Psr\Log\LoggerInterface;

class Add extends Action
{
    /**
     * @var Cart
     */
    private $cart;

    /**
     * @var CartRepositoryInterface
     */
    private $quoteRepository;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * Add constructor.
     *
     * @param CartRepositoryInterface $quoteRepository
     * @param Cart $cart
     * @param LoggerInterface $logger
     * @param Context $context
     */
    public function __construct(
        CartRepositoryInterface $quoteRepository,
        Cart $cart,
        LoggerInterface $logger,
        Context $context
    ) {
        $this->quoteRepository = $quoteRepository;
        $this->cart = $cart;
        $this->logger = $logger;

        parent::__construct($context);
    }

    /**
     * @return ResultInterface
     * @throws NoSuchEntityException
     */
    public function execute()
    {
        $resultRedirect = $this->resultFactory->create(ResultFactory::TYPE_REDIRECT);
        $cartId = $this->getRequest()->getParam('cartId');
        $redirectUrl = $this->_url->getUrl("checkout/cart");
        try {
            $quote = $this->quoteRepository->getActive($cartId);
            $this->cart->getQuote()->merge($quote);
            $this->cart->save();
            $quote->removeAllItems();
            $quote->save();
        } catch (NoSuchEntityException $e) {
            $this->logger->critical($e);
        }

        $resultRedirect->setUrl($redirectUrl);
        return $resultRedirect;
    }
}
