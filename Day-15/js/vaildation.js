
export function validateProduct(product) {
    if (!product.name || product.name.trim().length < 3) {
        return "Product name must contain at least 3 characters.";
    }

    if (!["Electronics", "Accessories"].includes(product.category)) {
        return "Please select a valid category.";
    }

    if (!Number.isFinite(Number(product.price)) || Number(product.price) <= 0) {
        return "Price must be greater than zero.";
    }

    if (
        product.stock === "" ||
        !Number.isInteger(Number(product.stock)) ||
        Number(product.stock) < 0
    ) {
        return "Stock must be a non-negative whole number.";
    }

    return "";
}
3