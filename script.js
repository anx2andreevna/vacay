const categoryButtons = document.querySelectorAll(".category[data-section]");

const burger = document.querySelector(".burger");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileMenuClose = document.querySelector(".mobile-menu-close");

const menuContent = document.querySelector("#menu-content");
const menuTime = document.querySelector("#menu-time");

const imageModal = document.querySelector("#image-modal");
const imageModalPhoto = document.querySelector("#image-modal-photo");
const imageModalClose = document.querySelector("#image-modal-close");

let currentSection = "breakfast";
let requestNumber = 0;


/* =========================
   МОБИЛЬНОЕ МЕНЮ
========================= */

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


/* =========================
   АКТИВНАЯ КАТЕГОРИЯ
========================= */

function setActiveCategory(section) {
  categoryButtons.forEach(function (button) {
    if (button.dataset.section === section) {
      button.classList.add("is-active");
    } else {
      button.classList.remove("is-active");
    }
  });
}


/* =========================
   ЗАГРУЗКА РАЗДЕЛА
========================= */

async function loadMenuSection(section) {
  if (!menuContent) return;

  currentSection = section;

  const thisRequest = ++requestNumber;

  setActiveCategory(section);

  if (menuTime) {
    menuTime.textContent =
      section === "breakfast"
        ? "до 14:00"
        : "с 14:00";
  }

  try {
    const response = await fetch(
      `./sections/${section}.html?v=${Date.now()}`,
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(
        `Ошибка загрузки ${section}: ${response.status}`
      );
    }

    const html = await response.text();

    /*
      Если пользователь успел нажать другую вкладку,
      старый запрос ничего не меняет.
    */
    if (thisRequest !== requestNumber) {
      return;
    }

    menuContent.innerHTML = html;

    menuContent.insertAdjacentHTML(
      "beforeend",
      `
        <p class="allergy-note">
          *просьба предупреждать об имеющихся у вас аллергии на определенные продукты
        </p>
      `
    );

    /*
      Каждый раздел открывается сверху.
    */
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    });

  } catch (error) {
    if (thisRequest !== requestNumber) {
      return;
    }

    console.error(error);

    menuContent.innerHTML = `
      <p class="section-error">
        Раздел временно недоступен
      </p>
    `;
  }
}


/* =========================
   ПЕРЕКЛЮЧЕНИЕ КАТЕГОРИЙ
========================= */

categoryButtons.forEach(function (button) {
  button.addEventListener("click", function (event) {
    event.preventDefault();

    const section = button.dataset.section;

    if (!section) return;

    loadMenuSection(section);
  });
});


/* =========================
   МОДАЛЬНАЯ КАРТИНКА
========================= */

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


/* =========================
   ПЕРВАЯ ЗАГРУЗКА
========================= */

loadMenuSection("breakfast");