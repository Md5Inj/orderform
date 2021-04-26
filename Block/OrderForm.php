<?php

declare(strict_types=1);

namespace Freento\OrderForm\Block;

use Magento\Directory\Model\Currency;
use Magento\Framework\View\Element\Template;
use Magento\Framework\View\Element\Template\Context;
use Magento\Framework\Data\Form\FormKey;

class OrderForm extends Template
{
    /**
     * @var FormKey
     */
    private $formKey;

    /**
     * @var Currency
     */
    private $currency;

    /**
     * OrderForm constructor.
     *
     * @param FormKey $formKey
     * @param Currency $currency
     * @param Context $context
     * @param array $data
     */
    public function __construct(
        FormKey $formKey,
        Currency $currency,
        Context $context,
        array $data = []
    ) {
        $this->formKey = $formKey;
        $this->currency = $currency;

        parent::__construct($context, $data);
    }

    /**
     * Return js config
     *
     * @return string
     */
    public function getJsConfig(): string
    {
        $params = [
            'readFileUrl'              => $this->getReadFileUrl(),
            'formKey'                  => $this->getFormKey(),
            'currencySymbol'           => $this->getCurrentCurrencySymbol(),
            'graphqlUrl'               => $this->getGraphqlUrl(),
            'getCartIdUrl'             => $this->getCartIdUrl(),
            'getAddToCartUrl'          => $this->getAddToCartUrl(),
            'getCartIdFromMaskedIdUrl' => $this->getCartIdFromMaskedIdUrl(),
            'clearCartUrl'             => $this->getClearCartUrl(),
            'loaderUrl'                => $this->getLoaderUrl()
        ];

        return json_encode($params);
    }

    /**
     * Return formKey
     *
     * @return string
     */
    public function getFormKey(): string
    {
        return $this->formKey->getFormKey();
    }

    /**
     * Get currency symbol for current locale and currency code
     *
     * @return string
     */
    public function getCurrentCurrencySymbol(): string
    {
        return $this->currency->getCurrencySymbol();
    }

    /**
     * Return file contents
     *
     * @return string
     */
    public function getReadFileUrl(): string
    {
        return $this->getUrl('orderform/file/read');
    }

    /**
     * Return graphql URL
     *
     * @return string
     */
    public function getGraphqlUrl(): string
    {
        return $this->getUrl('graphql');
    }

    /**
     * Return get cart id URL
     *
     * @return string
     */
    public function getCartIdUrl(): string
    {
        return $this->getUrl('rest/V1/guest-carts');
    }

    /**
     * Return add to cart url
     *
     * @return string
     */
    public function getAddToCartUrl(): string
    {
        return $this->getUrl('orderform/cart/add');
    }

    /**
     * Return cart id from masked url
     *
     * @return string
     */
    public function getCartIdFromMaskedIdUrl(): string
    {
        return $this->getUrl('rest/V1/guest-carts/:cartId');
    }

    /**
     * Return clear cart URL
     *
     * @return string
     */
    public function getClearCartUrl(): string
    {
        return $this->getUrl('orderform/cart/clear');
    }

    /**
     * Return loader image url
     *
     * @return string
     */
    public function getLoaderUrl(): string
    {
        return $this->getViewFileUrl("Freento_OrderForm::images/1487.gif");
    }
}
