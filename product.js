const cartTotalAmount = document.querySelector("#cart-total-amount");
const cartPanel = document.querySelector(".cart-panel");
const cartItemsContainer = document.querySelector(".cart-items");
const wishlistItemsContainer = document.querySelector(".wishlist-items");
const closeCartBtn = document.querySelector(".close-cart");
const cartIcon = document.querySelector(".nav-cart");
const wishlistIconNav = document.querySelector(".nav-wishlist");
const panelTitle = document.querySelector(".panel-title");



let cart = [];
let wishlist = [];

/* PANEL CONTROLS */
function openPanel(type) {
  cartPanel.classList.add("open");

  if (type === "cart") {
    panelTitle.innerText = "Your Cart";
    cartItemsContainer.classList.remove("hidden");
    wishlistItemsContainer.classList.add("hidden");
  } else {
    panelTitle.innerText = "Your Wishlist";
    wishlistItemsContainer.classList.remove("hidden");
    cartItemsContainer.classList.add("hidden");
  }
}

function closePanel() {
  cartPanel.classList.remove("open");
}

closeCartBtn.addEventListener("click", closePanel);
cartIcon.addEventListener("click", () => openPanel("cart"));
wishlistIconNav.addEventListener("click", () => openPanel("wishlist"));

/* ADD PRODUCT TO CART */
function addProductToCart(product) {
  const existing = cart.find(item => item.name === product.name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product });
  }

  renderCart();
  openPanel("cart");
}
function updateCartTotal() {
  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.qty;
  }, 0);

  cartTotalAmount.innerText = `₹${total}`;
}


/* RENDER CART (WITH + / -) */
function renderCart() {
  cartItemsContainer.innerHTML = "";

  cart.forEach((item, index) => {
    cartItemsContainer.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>₹${item.price}</p>

          <div class="qty-controls">
            <button class="qty-minus" data-index="${index}">−</button>
            <span>${item.qty}</span>
            <button class="qty-plus" data-index="${index}">+</button>
          </div>

          <span class="remove-item" data-index="${index}">Remove</span>
        </div>
      </div>
    `;
  });

  document.querySelectorAll(".remove-item").forEach(btn => {
    btn.addEventListener("click", () => {
      cart.splice(btn.dataset.index, 1);
      renderCart();
    });
  });

  document.querySelectorAll(".qty-plus").forEach(btn => {
    btn.addEventListener("click", () => {
      cart[btn.dataset.index].qty += 1;
      renderCart();
    });
  });

  document.querySelectorAll(".qty-minus").forEach(btn => {
    btn.addEventListener("click", () => {
      if (cart[btn.dataset.index].qty > 1) {
        cart[btn.dataset.index].qty -= 1;
        renderCart();
      }
    });
  });
  updateCartTotal();
}



/* RENDER WISHLIST */
function renderWishlist() {
  wishlistItemsContainer.innerHTML = "";

  if (wishlist.length === 0) {
    wishlistItemsContainer.innerHTML = "<p>No items in wishlist.</p>";
    return;
  }

  wishlist.forEach(item => {
    wishlistItemsContainer.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}">
        <div>
          <h4>${item.name}</h4>
          <p>₹${item.price}</p>
        </div>
      </div>
    `;
  });
}

/* PRODUCT CARD INTERACTIONS */
document.querySelectorAll(".product-card").forEach(card => {

  const product = {
    name: card.dataset.name,
    price: Number(card.dataset.price),
    img: card.dataset.img,
    qty: 1
  };

  const addToCartBtn = card.querySelector(".actions button:not(.buy)");
  const buyNowBtn = card.querySelector(".buy");
  const wishlistBtn = card.querySelector(".wishlist-icon");

  addToCartBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    addProductToCart(product);
  });

  buyNowBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    addProductToCart(product);
  });

  wishlistBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    wishlistBtn.classList.toggle("active");

    const exists = wishlist.find(item => item.name === product.name);

    if (!exists) {
      wishlist.push(product);
    } else {
      wishlist = wishlist.filter(item => item.name !== product.name);
    }

    renderWishlist();
  });

});

const searchInput = document.querySelector(".search");
const searchClearBtn = document.querySelector(".search-clear");

if (searchInput) {
  const searchForm = searchInput.closest("form");
  if (searchForm) searchForm.addEventListener("submit", (e) => e.preventDefault());
  searchInput.addEventListener("input", () => {
    toggleClearButton();
    applyFilters();
  });
}

if (searchClearBtn) {
  searchClearBtn.addEventListener("click", () => {
    if (!searchInput) return;
    searchInput.value = "";
    searchInput.focus();
    toggleClearButton();
    applyFilters();
  });
}

function toggleClearButton() {
  if (!searchClearBtn || !searchInput) return;
  searchClearBtn.style.display = searchInput.value.trim() === "" ? 'none' : 'block';
}
const sortDropdown = document.querySelector(".sort-dropdown");
const productGrid = document.querySelector(".product-gridd");

sortDropdown.addEventListener("change", () => {
  const cards = Array.from(document.querySelectorAll(".product-card"));

  if (sortDropdown.value === "price-low") {
    cards.sort((a, b) => a.dataset.price - b.dataset.price);
  } 
  else if (sortDropdown.value === "price-high") {
    cards.sort((a, b) => b.dataset.price - a.dataset.price);
  }

  cards.forEach(card => productGrid.appendChild(card));
});
const brandCheckboxes = document.querySelectorAll(
  '[id="apple"], [id="samsung"], [id="sony"], [id="oneplus"]'
);

const starCheckboxes = document.querySelectorAll(
  '[id="5stars"], [id="4stars"], [id="3stars"]'
);

brandCheckboxes.forEach(cb => cb.addEventListener("change", applyFilters));
let activeStarFilters = new Set();

starCheckboxes.forEach(cb => {
  cb.addEventListener("click", () => {
    const value = cb.value;

    if (activeStarFilters.has(value)) {
      activeStarFilters.delete(value);
      cb.checked = false;
    } else {
      activeStarFilters.add(value);
      cb.checked = true;
    }

    applyFilters();
  });
});


function applyFilters() {
  const searchValue = (searchInput ? searchInput.value : "").toLowerCase().trim();

  const selectedBrands = Array.from(brandCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.id.toLowerCase());

 const selectedStars = Array.from(activeStarFilters);


  document.querySelectorAll(".product-card").forEach(card => {
    const name = card.dataset.name.toLowerCase();
    const starCount = card.dataset.rating; // already correct

    const matchesSearch =
      searchValue === "" || name.includes(searchValue);

    const matchesBrand =
      selectedBrands.length === 0 ||
      selectedBrands.some(brand => name.includes(brand));

    const matchesStars =
      selectedStars.length === 0 ||
      selectedStars.includes(starCount);

    card.style.display =
      matchesSearch && matchesBrand && matchesStars
        ? "block"
        : "none";

    // Highlight matching text in the card title
    const titleEl = card.querySelector('.card-back h3') || card.querySelector('h3');
    if (titleEl) {
      const fullTitle = card.dataset.name;
      if (searchValue === "") {
        titleEl.textContent = fullTitle;
      } else {
        const escaped = escapeRegExp(searchValue);
        const regex = new RegExp(`(${escaped})`, 'ig');
        titleEl.innerHTML = fullTitle.replace(regex, '<span class="highlight">$1</span>');
      }
    }
  });
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

