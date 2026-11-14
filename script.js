function initializePageControls() {
  var menuToggle = document.querySelector(".menu-toggle");
  var navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    function setMenuState(isOpen) {
      menuToggle.setAttribute("aria-expanded", isOpen);

      if (isOpen) {
        menuToggle.setAttribute("aria-label", "Close navigation menu");
        navLinks.classList.add("show-menu");
      } else {
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        navLinks.classList.remove("show-menu");
      }
    }

    menuToggle.addEventListener("click", function () {
      var menuIsOpen = menuToggle.getAttribute("aria-expanded") === "true";
      setMenuState(!menuIsOpen);
    });

    var navItems = navLinks.getElementsByTagName("a");

    for (var linkIndex = 0; linkIndex < navItems.length; linkIndex++) {
      navItems[linkIndex].addEventListener("click", function () {
        setMenuState(false);
      });
    }
  }

  var carousel = document.getElementById("carouselStacked");

  if (!carousel) {
    return;
  }

  var slides = carousel.getElementsByClassName("carousel-item");

  if (slides.length === 0) {
    return;
  }

  var indicators = carousel.getElementsByClassName("carousel-indicators")[0];
  var indicatorButtons = [];

  if (indicators) {
    for (
      var indicatorIndex = 0;
      indicatorIndex < slides.length;
      indicatorIndex++
    ) {
      var indicator = document.createElement("button");
      indicator.type = "button";
      indicator.className = "carousel-indicator";
      indicator.setAttribute(
        "aria-label",
        "Show image " + (indicatorIndex + 1) + " of " + slides.length,
      );
      indicator.setAttribute("aria-pressed", "false");
      indicators.appendChild(indicator);
      indicatorButtons.push(indicator);
    }
  }

  function setActiveSlide(activeSlideIndex) {
    for (var slideIndex = 0; slideIndex < slides.length; slideIndex++) {
      if (slideIndex === activeSlideIndex) {
        slides[slideIndex].classList.add("active");
        slides[slideIndex].setAttribute("aria-hidden", "false");
      } else {
        slides[slideIndex].classList.remove("active");
        slides[slideIndex].setAttribute("aria-hidden", "true");
      }
    }

    for (
      var buttonIndex = 0;
      buttonIndex < indicatorButtons.length;
      buttonIndex++
    ) {
      if (buttonIndex === activeSlideIndex) {
        indicatorButtons[buttonIndex].classList.add("active");
        indicatorButtons[buttonIndex].setAttribute("aria-pressed", "true");
      } else {
        indicatorButtons[buttonIndex].classList.remove("active");
        indicatorButtons[buttonIndex].setAttribute("aria-pressed", "false");
      }
    }
  }

  var activeIndex = 0;

  for (var startIndex = 0; startIndex < slides.length; startIndex++) {
    if (slides[startIndex].classList.contains("active")) {
      activeIndex = startIndex;
    }
  }

  setActiveSlide(activeIndex);

  function showNextSlide() {
    activeIndex = (activeIndex + 1) % slides.length;
    setActiveSlide(activeIndex);
  }

  function restartAutoplay() {
    window.clearInterval(autoplayTimer);
    autoplayTimer = window.setInterval(showNextSlide, 4000);
  }

  var autoplayTimer = window.setInterval(showNextSlide, 4000);
  var carouselButtons = carousel.getElementsByClassName("carousel-button");

  for (
    var carouselButtonIndex = 0;
    carouselButtonIndex < carouselButtons.length;
    carouselButtonIndex++
  ) {
    carouselButtons[carouselButtonIndex].addEventListener("click", function () {
      if (this.getAttribute("data-carousel-slide") === "next") {
        activeIndex = (activeIndex + 1) % slides.length;
      } else {
        activeIndex = (activeIndex - 1 + slides.length) % slides.length;
      }

      setActiveSlide(activeIndex);
      restartAutoplay();
    });
  }

  for (
    var indicatorClickIndex = 0;
    indicatorClickIndex < indicatorButtons.length;
    indicatorClickIndex++
  ) {
    indicatorButtons[indicatorClickIndex].addEventListener(
      "click",
      function () {
        activeIndex = indicatorButtons.indexOf(this);
        setActiveSlide(activeIndex);
        restartAutoplay();
      },
    );
  }

  var carouselImages = carousel.getElementsByTagName("img");

  for (var imageIndex = 0; imageIndex < carouselImages.length; imageIndex++) {
    carouselImages[imageIndex].addEventListener("click", function () {
      showNextSlide();
      restartAutoplay();
    });
  }
}

initializePageControls();

function initializeThemeToggle() {
  var themeToggle = document.querySelector(".theme-toggle");

  if (!themeToggle) {
    return;
  }

  function setTheme(theme) {
    var isLight = theme === "light";
    document.body.setAttribute("data-theme", isLight ? "light" : "dark");
    var actionLabel = isLight ? "Switch to dark mode" : "Switch to light mode";
    themeToggle.setAttribute("aria-label", actionLabel);
    themeToggle.setAttribute("title", actionLabel);
    themeToggle.setAttribute("aria-pressed", isLight ? "true" : "false");
  }

  var savedTheme = "dark";

  try {
    var storedTheme = window.localStorage.getItem("gym4u-theme");

    if (storedTheme === "light" || storedTheme === "dark") {
      savedTheme = storedTheme;
    }
  } catch (error) {
    console.error("Unable to read the saved theme preference.", error);
  }

  setTheme(savedTheme);

  themeToggle.addEventListener("click", function () {
    var nextTheme =
      document.body.getAttribute("data-theme") === "light" ? "dark" : "light";
    setTheme(nextTheme);

    try {
      window.localStorage.setItem("gym4u-theme", nextTheme);
    } catch (error) {
      console.error("Unable to save the theme preference.", error);
    }
  });
}

initializeThemeToggle();

function getCartItems() {
  var savedCart;

  try {
    savedCart = window.localStorage.getItem("gym4u-cart");
  } catch (error) {
    console.error("Unable to read the saved cart.", error);
    return [];
  }

  if (!savedCart) {
    return [];
  }

  try {
    var cartItems = JSON.parse(savedCart);

    if (Array.isArray(cartItems)) {
      return cartItems;
    }
  } catch (error) {
    console.error("The saved cart data could not be read.", error);
  }

  return [];
}

function updateCartCount() {
  var cartCounts = document.querySelectorAll(".cart-count");
  var cartLinks = document.querySelectorAll(".cart-link");
  var cartItems = getCartItems();
  var itemCount = 0;

  for (var itemIndex = 0; itemIndex < cartItems.length; itemIndex++) {
    itemCount += Number(cartItems[itemIndex].quantity) || 0;
  }

  for (var countIndex = 0; countIndex < cartCounts.length; countIndex++) {
    cartCounts[countIndex].textContent = itemCount;
    cartCounts[countIndex].hidden = itemCount === 0;
  }

  for (var linkIndex = 0; linkIndex < cartLinks.length; linkIndex++) {
    cartLinks[linkIndex].setAttribute(
      "aria-label",
      "Shopping cart, " + itemCount + (itemCount === 1 ? " item" : " items"),
    );
  }
}

updateCartCount();

function saveCartItems(cartItems) {
  try {
    window.localStorage.setItem("gym4u-cart", JSON.stringify(cartItems));
    updateCartCount();
    return true;
  } catch (error) {
    console.error("Unable to save the cart.", error);
    return false;
  }
}

function showCartItems() {
  var cartItemsContainer = document.getElementById("cart-items");

  if (!cartItemsContainer) {
    return;
  }

  var emptyMessage = document.getElementById("cart-empty");
  var cartContent = document.getElementById("cart-content");
  var totalElement = document.getElementById("cart-total");
  var cartItems = getCartItems();

  cartItemsContainer.innerHTML = "";

  if (cartItems.length === 0) {
    emptyMessage.hidden = false;
    cartContent.hidden = true;
    return;
  }

  emptyMessage.hidden = true;
  cartContent.hidden = false;

  var cartTotal = 0;

  for (var itemIndex = 0; itemIndex < cartItems.length; itemIndex++) {
    var item = cartItems[itemIndex];
    var itemPrice = Number(item.price);
    var itemQuantity = Number(item.quantity);
    var itemTotal = itemPrice * itemQuantity;
    cartTotal += itemTotal;

    var itemRow = document.createElement("div");
    itemRow.className = "cart-item-row";

    var productImage = document.createElement("img");
    productImage.className = "cart-item-image";
    productImage.src = item.image;
    productImage.alt = item.name;
    itemRow.appendChild(productImage);

    var itemDetails = document.createElement("div");
    itemDetails.className = "cart-item-details";

    var itemName = document.createElement("h2");
    itemName.textContent = item.name;
    itemDetails.appendChild(itemName);

    var itemQuantityText = document.createElement("p");
    itemQuantityText.textContent =
      "Quantity: " +
      itemQuantity +
      " x PHP " +
      itemPrice.toLocaleString("en-PH");
    itemDetails.appendChild(itemQuantityText);

    var itemTotalText = document.createElement("p");
    itemTotalText.className = "cart-line-total";
    itemTotalText.textContent = "PHP " + itemTotal.toLocaleString("en-PH");
    itemDetails.appendChild(itemTotalText);

    itemRow.appendChild(itemDetails);

    var removeButton = document.createElement("button");
    removeButton.className = "cart-remove-button";
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("data-item-index", itemIndex);
    removeButton.addEventListener("click", function () {
      var removeIndex = Number(this.getAttribute("data-item-index"));
      var updatedCart = getCartItems();
      updatedCart.splice(removeIndex, 1);

      if (saveCartItems(updatedCart)) {
        showCartItems();
      }
    });
    itemRow.appendChild(removeButton);

    cartItemsContainer.appendChild(itemRow);
  }

  totalElement.textContent = "PHP " + cartTotal.toLocaleString("en-PH");
}

function initializeProductCart() {
  var addButtons = document.getElementsByClassName("add-to-cart-button");
  var cartStatus = document.getElementById("cart-status");

  for (var buttonIndex = 0; buttonIndex < addButtons.length; buttonIndex++) {
    addButtons[buttonIndex].addEventListener("click", function () {
      var productId = this.getAttribute("data-product-id");
      var productName = this.getAttribute("data-product-name");
      var productPrice = Number(this.getAttribute("data-product-price"));
      var productImage = this.getAttribute("data-product-image");
      var cartItems = getCartItems();
      var productFound = false;

      for (var itemIndex = 0; itemIndex < cartItems.length; itemIndex++) {
        if (cartItems[itemIndex].id === productId) {
          cartItems[itemIndex].quantity++;
          productFound = true;
          break;
        }
      }

      if (!productFound) {
        cartItems.push({
          id: productId,
          name: productName,
          price: productPrice,
          image: productImage,
          quantity: 1,
        });
      }

      if (saveCartItems(cartItems)) {
        cartStatus.textContent = productName + " added to your cart.";
      } else {
        cartStatus.textContent =
          "Your cart could not be saved. Check your browser storage settings.";
      }
    });
  }

  showCartItems();

  var clearCartButton = document.getElementById("clear-cart");

  if (clearCartButton) {
    clearCartButton.addEventListener("click", function () {
      if (saveCartItems([])) {
        showCartItems();
      }
    });
  }
}

initializeProductCart();

window.addEventListener("storage", function (event) {
  if (event.key === "gym4u-cart") {
    updateCartCount();
    showCartItems();
  }
});

function initializeRevealAnimations() {
  var revealTargets = document.querySelectorAll(
    ".proposal-card, .page-cta, .info-section",
  );

  if (!revealTargets.length) {
    return;
  }

  var cardIndex = 0;

  revealTargets.forEach(function (element) {
    element.classList.add("reveal");

    if (element.classList.contains("proposal-card")) {
      element.style.transitionDelay = (cardIndex % 3) * 120 + "ms";
      cardIndex++;
    }
  });

  if (!window.IntersectionObserver) {
    revealTargets.forEach(function (element) {
      element.classList.add("is-visible");
    });
    return;
  }

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    },
  );

  revealTargets.forEach(function (element) {
    revealObserver.observe(element);
  });
}

initializeRevealAnimations();
