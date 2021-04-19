import Storage from "./Storage";

const PRODUCTS = "products";

class ProductStorage extends Storage {
    static get PRODUCTS() {
        return PRODUCTS;
    }

    static saveProducts(products) {
        this.setItem(this.PRODUCTS, products);
    }

    static getProducts() {
        let products = this.getItem(this.PRODUCTS);

        if (products === "") {
            products = [];
        }

        return products;
    }

    static getProduct(id) {
        let products = this.getProducts();
        let foundProduct;

        if (products.length !== 0) {
            foundProduct = products.find(product => {
                if (product.id === id) {
                    return product;
                }
            });

            if (foundProduct !== undefined) {
                return foundProduct;
            } else {
                return 0;
            }
        }
    }

    static addProduct(product) {
        let products = this.getProducts();
        let productId = 1;

        if (products.length !== 0) {
            productId = Math.max.apply(Math, products.map(function (product) {
                return product.id;
            }));

            productId++;
        } else {
            products = [];
        }

        product.id = productId;
        products.push(product);
        this.setItem(this.PRODUCTS, products);
    }

    static deleteProduct(id) {
        let products = this.getProducts();

        products = products.filter(product => {
            return product.id !== id;
        });

        this.saveProducts(products);
    }

    static replaceProduct(id, newProduct) {
        let products = this.getProducts();

        products = products.map(product => {
            if (product.id === id) {
                newProduct.id = id;
                return newProduct;
            }

            return product;
        });

        this.saveProducts(products);
    }
}

export default ProductStorage;
