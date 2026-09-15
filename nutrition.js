const burger = document.querySelector(".burger");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileMenuClose = document.querySelector(".mobile-menu-close");

function setNutritionMenu(open) {
  if (!burger || !mobileMenu) return;

  mobileMenu.classList.toggle("is-open", open);
  mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
  burger.setAttribute("aria-expanded", open ? "true" : "false");
  document.body.style.overflow = open ? "hidden" : "";
}

if (burger) {
  burger.addEventListener("click", function () {
    setNutritionMenu(true);
  });
}

if (mobileMenuClose) {
  mobileMenuClose.addEventListener("click", function () {
    setNutritionMenu(false);
  });
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && mobileMenu && mobileMenu.classList.contains("is-open")) {
    setNutritionMenu(false);
  }
});
