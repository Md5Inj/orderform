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
     * @return false|string
     */
    public function getJsConfig() {
        $params = [
            'loadFilesFromCsvUrl' => $this->getLoadFilesFromCsvUrl(),
            'readFileUrl' => $this->getReadFileUrl(),
            'formKey' => $this->getFormKey(),
            'currencySymbol' => $this->getCurrentCurrencySymbol(),
            'graphqlUrl' => $this->getGraphqlUrl()
        ];

        return json_encode($params);
    }

    public function getLoadFilesFromCsvUrl()
    {
        return $this->getUrl('orderform/products/loadfromcsv');
    }

    public function getFormKey()
    {
        return $this->formKey->getFormKey();
    }

    /**
     * Get currency symbol for current locale and currency code
     *
     * @return string
     */
    public function getCurrentCurrencySymbol()
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

    public function getGraphqlUrl(): string
    {
        return $this->getUrl('graphql');
    }
}
