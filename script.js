let cards = document.querySelector(".cards");
let btn = document.querySelector(".load-more");
let input = document.getElementById("input-search");
let lightbox = document.querySelector(".lightbox");
let closeBtn = lightbox.querySelector(".close");
let downloadBtn = lightbox.querySelector(".download");

let key = "BWOej0Yli31QEtRJ03AtC8xr0nmGOFKQXMwOoA9wYz5nDWKKgOeAMhdq";

let perPage = 15;
let currentPage = 1;

getImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
);

btn.addEventListener("click", loadMoreImages);
input.addEventListener("keyup", searchImages);
closeBtn.addEventListener("click", hiddenLightbox);
downloadBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));

function getImages(apiURL) {
  btn.innerText = "Loading...";
  btn.classList.add("disabled");
  fetch(apiURL, {
    headers: { Authorization: key },
  })
    .then((res) => res.json())
    .then((data) => {
      addImages(data.photos);
      btn.innerText = "Load More";
      btn.classList.remove("disabled");
    })
    .catch(() => alert("Failed to load images!"));
}

function addImages(images) {
  images.forEach((img) => {
    cards.innerHTML += `
      <li class="card" onclick="showLightbox('${img.photographer}', '${img.src.large2x}')">
        <img src="${img.src.large2x}" alt="img" />
        <div class="details">
          <div class="photographer">
            <span class="material-symbols-outlined"> photo_camera </span>
            <span>${img.photographer}</span>
          </div>
          <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();">
            <span class="material-symbols-outlined"> download </span>
          </button>
        </div>
      </li>
          `;
  });
}

function loadMoreImages() {
  currentPage++;
  let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  if (input.value.length > 0) {
    apiUrl = `https://api.pexels.com/v1/search?query=${input.value}&page=${currentPage}&per_page=${perPage}`;
  }
  getImages(apiUrl);
}

function searchImages(e) {
  if (e.target.value === "") return false;
  if (e.key === "Enter") {
    currentPage = 1;
    cards.innerHTML = "";
    getImages(
      `https://api.pexels.com/v1/search?query=${e.target.value}&page=${currentPage}&per_page=${perPage}`
    );
  }
}

function downloadImg(url) {
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      let a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => alert("Failed to download image!"));
}

function showLightbox(name, img) {
  lightbox.classList.add("show");
  lightbox.querySelector("img").src = img;
  lightbox.querySelector("span:last-child").innerText = name;
  document.body.style.overflow = "hidden";
  downloadBtn.setAttribute("data-img", img);
}

function hiddenLightbox() {
  lightbox.classList.remove("show");
  document.body.style.overflow = "auto";
}
