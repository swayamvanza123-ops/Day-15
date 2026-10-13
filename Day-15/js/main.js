
import { loadProducts } from "./storage.js";

const PAGE_SIZE = 4;
const products = loadProducts();

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const clearFilters = document.getElementById("clearFilters");
const productGrid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");

const resultsCount = document.getElementById("resultsCount");
const pageInfo = document.getElementById("pageInfo");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");

const totalProducts = document.getElementById("totalProducts");
const totalStock = document.getElementById("totalStock");
const lowStock = document.getElementById("lowStock");
const inventoryValue = document.getElementById("inventoryValue");

let currentPage = 1;

const formatRupees = amount =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);

function updateDashboard() {
    totalProducts.textContent = products.length;

    totalStock.textContent = products.reduce(
        (sum, product) => sum + Number(product.stock || 0),
        0
    );

    lowStock.textContent = products.filter(
        product => Number(product.stock) < 10
    ).length;

    inventoryValue.textContent = formatRupees(
        products.reduce(
            (sum, product) =>
                sum + Number(product.price || 0) * Number(product.stock || 0),
            0
        )
    );
}

function getFilteredProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    return products.filter(product => {
        const matchesName = String(product.name || "")
            .toLowerCase()
            .includes(searchTerm);

        const matchesCategory =
            selectedCategory === "" ||
            product.category === selectedCategory;

        return matchesName && matchesCategory;
    });
}

function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";

    const imageArea = document.createElement("div");
    imageArea.className = "product-image";

    if (product.image) {
        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name || "Product";
        image.loading = "lazy";

        image.addEventListener("error", () => {
            imageArea.replaceChildren();

            const fallback = document.createElement("div");
            fallback.className = "image-fallback";
            fallback.textContent = "📦 Image unavailable";
            imageArea.appendChild(fallback);
        }, { once: true });

        imageArea.appendChild(image);
    } else {
        const fallback = document.createElement("div");
        fallback.className = "image-fallback";
        fallback.textContent = "📦 No image available";
        imageArea.appendChild(fallback);
    }

    const details = document.createElement("div");
    details.className = "product-details";

    const category = document.createElement("span");
    category.className = "category-label";
    category.textContent = product.category || "Uncategorized";

    const name = document.createElement("h3");
    name.textContent = product.name || "Unnamed product";

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = formatRupees(Number(product.price) || 0);

    const stockRow = document.createElement("div");
    stockRow.className = "stock-row";

    const stockLabel = document.createElement("span");
    stockLabel.textContent = "Available stock";

    const stockValue = Number(product.stock) || 0;
    const stockBadge = document.createElement("span");
    stockBadge.className = stockValue < 10 ? "stock-badge low" : "stock-badge";
    stockBadge.textContent = `${stockValue} units`;

    stockRow.append(stockLabel, stockBadge);
    details.append(category, name, price, stockRow);
    card.append(imageArea, details);

    return card;
}

function renderProducts() {
    const filteredProducts = getFilteredProducts();

    const totalPages = Math.max(
        1,
        Math.ceil(filteredProducts.length / PAGE_SIZE)
    );

    // Keep the current page valid when results change.
    currentPage = Math.min(currentPage, totalPages);

    const startIndex = (currentPage - 1) * PAGE_SIZE;

    // Display only four products on the current page.
    const pageProducts = filteredProducts.slice(
        startIndex,
        startIndex + PAGE_SIZE
    );

    productGrid.replaceChildren();

    pageProducts.forEach(product => {
        productGrid.appendChild(createProductCard(product));
    });

    emptyState.hidden = filteredProducts.length !== 0;
    productGrid.hidden = filteredProducts.length === 0;

    if (filteredProducts.length === 0) {
        resultsCount.textContent = "Showing 0 products";
    } else {
        const firstProduct = startIndex + 1;
        const lastProduct = Math.min(
            startIndex + PAGE_SIZE,
            filteredProducts.length
        );

        resultsCount.textContent =
            `Showing ${firstProduct}–${lastProduct} of ${filteredProducts.length} products`;
    }

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}

searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderProducts();
});

categoryFilter.addEventListener("change", () => {
    currentPage = 1;
    renderProducts();
});

clearFilters.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "";
    currentPage = 1;
    renderProducts();
});

prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderProducts();
    }
});

nextButton.addEventListener("click", () => {
    const totalPages = Math.max(
        1,
        Math.ceil(getFilteredProducts().length / PAGE_SIZE)
    );

    if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
    }
});

updateDashboard();
renderProducts();
