//A layout logic for the navbar and footer to be rendered on each page. Just like in react/next or other libraries that uses layout systems.

async function loadLayout() {
  try {
    const navbar = await fetch("/src/components/navbar.html").then((res) =>
      res.text()
    );
    document.body.insertAdjacentHTML("afterbegin", navbar);
    const footer = await fetch("/src/components/footer.html").then((res) =>
      res.text()
    );
    document.body.insertAdjacentHTML("beforeend", footer);
  } catch (error) {
    console.error("Error loading layout", error);
  }
}
loadLayout();
