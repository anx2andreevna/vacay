const categoryButtons = document.querySelectorAll(
  ".category[data-section]"
);

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
   БУРГЕР-МЕНЮ
========================= */

function setMenu(open) {
  if (!mobileMenu || !burger) return;

  mobileMenu.classList.toggle(
    "is-open",
    open
  );

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
  burger.addEventListener(
    "click",
    function () {
      setMenu(true);
    }
  );
}


if (mobileMenuClose) {
  mobileMenuClose.addEventListener(
    "click",
    function () {
      setMenu(false);
    }
  );
}


/* =========================
   АКТИВНАЯ КАТЕГОРИЯ
========================= */

function setActiveCategory(section) {
  categoryButtons.forEach(
    function (button) {

      if (
        button.dataset.section === section
      ) {
        button.classList.add(
          "is-active"
        );
      } else {
        button.classList.remove(
          "is-active"
        );
      }

    }
  );
}


/* =========================
   ЗАГРУЗКА РАЗДЕЛОВ
========================= */

async function loadMenuSection(section) {
  if (!menuContent) return;

  currentSection = section;

  const thisRequest =
    ++requestNumber;

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


    const html =
      await response.text();


    /*
      Если пользователь уже нажал
      другую категорию,
      старый запрос ничего не делает
    */

    if (
      thisRequest !== requestNumber
    ) {
      return;
    }


    menuContent.innerHTML =
      html;


    menuContent.insertAdjacentHTML(
      "beforeend",
      `
        <p class="allergy-note">
          *просьба предупреждать об имеющихся у вас аллергии на определенные продукты
        </p>
      `
    );


    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    });


  } catch (error) {

    if (
      thisRequest !== requestNumber
    ) {
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

categoryButtons.forEach(
  function (button) {

    button.addEventListener(
      "click",
      function (event) {

        event.preventDefault();


        const section =
          button.dataset.section;


        if (!section) return;


        loadMenuSection(section);

      }
    );

  }
);


/* =========================
   МОДАЛЬНАЯ КАРТИНКА
========================= */

function openImageModal(image) {
  if (
    !imageModal ||
    !imageModalPhoto
  ) {
    return;
  }


  imageModalPhoto.src =
    image.currentSrc ||
    image.src;


  imageModalPhoto.alt =
    image.alt || "";


  imageModal.classList.add(
    "is-open"
  );


  imageModal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.style.overflow =
    "hidden";
}


function closeImageModal() {
  if (
    !imageModal ||
    !imageModalPhoto
  ) {
    return;
  }


  imageModal.classList.remove(
    "is-open"
  );


  imageModal.setAttribute(
    "aria-hidden",
    "true"
  );


  imageModalPhoto.src = "";
  imageModalPhoto.alt = "";


  document.body.style.overflow =
    "";
}


/* Клик по фотографии */

if (menuContent) {

  menuContent.addEventListener(
    "click",
    function (event) {

      const image =
        event.target.closest(
          ".dish-photo"
        );


      if (!image) return;


      openImageModal(image);

    }
  );

}


/* Закрытие по крестику */

if (imageModalClose) {

  imageModalClose.addEventListener(
    "click",
    function (event) {

      event.stopPropagation();

      closeImageModal();

    }
  );

}


/* Закрытие по фону */

if (imageModal) {

  imageModal.addEventListener(
    "click",
    function (event) {

      if (
        event.target === imageModal
      ) {
        closeImageModal();
      }

    }
  );

}


/* =========================
   ESC
========================= */

document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Escape"
    ) {

      if (
        imageModal &&
        imageModal.classList.contains(
          "is-open"
        )
      ) {
        closeImageModal();
      }


      if (
        mobileMenu &&
        mobileMenu.classList.contains(
          "is-open"
        )
      ) {
        setMenu(false);
      }

    }

  }
);


/* =========================
   ПЕРВАЯ ЗАГРУЗКА
========================= */

loadMenuSection(
  "breakfast"
);

const nutritionSearch =
  document.querySelector("#nutrition-search");

const nutritionSearchEmpty =
  document.querySelector("#nutrition-search-empty");


function normalizeSearchText(text) {
  return text
    .toLowerCase()
    .replace(/ё/g, "е")
    .trim();
}


function filterNutritionTable() {
  if (!nutritionSearch) return;

  const query =
    normalizeSearchText(nutritionSearch.value);

  const sections =
    document.querySelectorAll(".nutrition-section");

  let visibleRows = 0;


  sections.forEach(function (section) {

    const rows =
      section.querySelectorAll(".nutrition-table__row");

    let visibleInSection = 0;


    rows.forEach(function (row) {

      const name =
        row.querySelector(".nutrition-table__name");

      if (!name) return;


      const dishName =
        normalizeSearchText(name.textContent);


      const matches =
        query === "" ||
        dishName.includes(query);


      row.hidden = !matches;


      if (matches) {
        visibleInSection++;
        visibleRows++;
      }

    });


    section.hidden =
      query !== "" &&
      visibleInSection === 0;

  });


  if (nutritionSearchEmpty) {

    nutritionSearchEmpty.hidden =
      query === "" ||
      visibleRows > 0;

  }

}


if (nutritionSearch) {

  nutritionSearch.addEventListener(
    "input",
    filterNutritionTable
  );

}