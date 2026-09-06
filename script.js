const categories = document.querySelectorAll('.category');

categories.forEach((button) => {
  button.addEventListener('click', () => {
    categories.forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    button.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  });
});

const burger = document.querySelector('.burger');
const menu = document.querySelector('.mobile-menu');
const close = document.querySelector('.mobile-menu-close');

function setMenu(open) {
  menu.classList.toggle('is-open', open);
  menu.setAttribute('aria-hidden', String(!open));
  burger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
}

burger.addEventListener('click', () => setMenu(true));
close.addEventListener('click', () => setMenu(false));

const menuContent = document.querySelector("#menu-content");
const menuCategories = document.querySelectorAll("[data-section]");

async function loadMenuSection(section) {
  try {
    const response = await fetch(`sections/${section}.html`);

    if (!response.ok) {
      throw new Error(`Не удалось загрузить ${section}`);
    }

    const html = await response.text();

    menuContent.innerHTML = html;
  } catch (error) {
    console.error(error);

    menuContent.innerHTML = `
      <p>Раздел временно недоступен</p>
    `;
  }
}

menuCategories.forEach((category) => {
  category.addEventListener("click", () => {
    const section = category.dataset.section;

    categories.forEach((item) => {
      item.classList.remove("active");
    });

    category.classList.add("active");

    loadMenuSection(section);
  });
});

loadMenuSection("breakfast");
