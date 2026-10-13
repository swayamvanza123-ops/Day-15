
import { products as initialProducts } from "./products.js";

const STORAGE_KEY = "inventoryProducts";

export function loadProducts() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved !== null) {
            const parsed = JSON.parse(saved);

            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (error) {
        console.error("Could not load saved products:", error);
    }

    return initialProducts.map(product => ({ ...product }));
}

export function saveProducts(products) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
        console.error("Could not save products:", error);
    }
}
