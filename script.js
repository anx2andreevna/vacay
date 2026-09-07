const categoryButtons = document.querySelectorAll("[data-section]");

const burger = document.querySelector(".burger");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileMenuClose = document.querySelector(".mobile-menu-close");

const menuContent = document.querySelector("#menu-content");
const menuTime = document.querySelector("#menu-time");

const imageModal = document.querySelector("#image-modal");
const imageModalPhoto = document.querySelector("#image-modal-photo");
const imageModalClose = document.querySelector("#image-modal-close");


function setMenu(open) {
  if (!mobileMenu || !burger) return;

  mobileMenu.classList.toggle("is-open", open);

  mobileMenu.setAttribute(
    "aria-hidden",
    open ? "false" : "true"
  );

  burger.setAttribute(
    "aria-expanded",
    open ? "true" : "false"
  );

  document.body.style.overflow =
    open ? "hidden" : "";
}


if (burger) {
  burger.addEventListener("click", function () {
    setMenu(true);
  });
}


if (mobileMenuClose) {
  mobileMenuClose.addEventListener("click", function () {
    setMenu(false);
  });
}


async function loadMenuSection(section) {
  if (!menuContent) return;

  try {
    const response = await fetch(
      "sections/" + section + ".html",
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(
        "Не удалось загрузить раздел: " + section
      );
    }

    const html = await response.text();

    menuContent.innerHTML = html;

    menuContent.insertAdjacentHTML(
        "beforeend",
        `
            <p class="allergy-note">
            *просьба предупреждать об имеющихся у вас аллергии на определенные продукты
            </p>
        `
        );

    if (menuTime) {
      menuTime.textContent =
        section === "breakfast"
          ? "до 14:00"
          : "с 14:00";
    }

    // При переключении раздела
    // возвращаем страницу в самый верх
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    });

  } catch (error) {
    console.error(error);

    menuContent.innerHTML = `
      <p class="section-error">
        Раздел временно недоступен
      </p>
    `;
  }
}


categoryButtons.forEach(function (button) {
  button.addEventListener("click", function () {

    const section =
      button.getAttribute("data-section");

    categoryButtons.forEach(function (item) {
      item.classList.remove("is-active");
    });

    button.classList.add("is-active");

    button.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"
    });

    loadMenuSection(section);
  });
});


function openImageModal(image) {
  if (!imageModal || !imageModalPhoto) return;

  imageModalPhoto.src =
    image.currentSrc || image.src;

  imageModalPhoto.alt =
    image.alt || "";

  imageModal.classList.add("is-open");

  imageModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow = "hidden";
}


function closeImageModal() {
  if (!imageModal || !imageModalPhoto) return;

  imageModal.classList.remove("is-open");

  imageModal.setAttribute(
    "aria-hidden",
    "true"
  );

  imageModalPhoto.src = "";
  imageModalPhoto.alt = "";

  document.body.style.overflow = "";
}


if (menuContent) {
  menuContent.addEventListener(
    "click",
    function (event) {

      const image =
        event.target.closest(".dish-photo");

      if (!image) return;

      openImageModal(image);
    }
  );
}


if (imageModalClose) {
  imageModalClose.addEventListener(
    "click",
    function (event) {

      event.stopPropagation();

      closeImageModal();
    }
  );
}


if (imageModal) {
  imageModal.addEventListener(
    "click",
    function (event) {

      if (event.target === imageModal) {
        closeImageModal();
      }
    }
  );
}


document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Escape" &&
      imageModal &&
      imageModal.classList.contains("is-open")
    ) {
      closeImageModal();
    }
  }
);


// При первом открытии сайта
// загружаем завтраки
loadMenuSection("breakfast");