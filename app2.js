const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];
// error alert 
const errorAlert = document.getElementById('errorAlert');
// Enter Button working
const EnterBtn = document.getElementById('search');

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  errorAlert.classList.add('d-none');
  imagesArea.classList.remove('d-none');
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = `<div>
    <img class="img-fluid  img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">
      <h6 class="text-center">Download: ${image.downloads}</h6> 
    </div>`;
    gallery.appendChild(div)
  })
  toggleSpin();
}

const getImages = (query) => {
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
//   .then(response => response.json())
//   .then(data => showImages(data.hits))
//   .catch(error => console.log(error))
    .then(response => response.json())
    .then(data => {
      if(data.hits.length > 0){
         showImages(data.hits);
      }else{
        errorShow();
      }
    }) 
    .catch(error => errorShow())
}


let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  
 
  let item = sliders.indexOf(img);
  if (item === -1) {
    element.classList.add('added');
    sliders.push(img);
  } else {
    sliders.splice(item, 1);
    element.classList.remove('added');
  }
}
// complete till this 

var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.classList.add('d-none');
  const duration = document.getElementById('duration').value || 1000;
  const durationWork = duration < 1 ? 1000 : duration * 500;
//   console.log(duration);
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, durationWork);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  searchAlbum();
})

function searchAlbum(){
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  toggleSpin();
  getImages(search.value)
  sliders.length = 0;
}

sliderBtn.addEventListener('click', function () {
  createSlider()
})


// loading spinner added  
function toggleSpin(){
  const loading = document.getElementById('loading-spinner');
  loading.classList.toggle('d-none');
}

//  error message 
function errorShow(){
  toggleSpin();
  errorAlert.classList.remove('d-none');
  imagesArea.classList.add('d-none')
}

// Enter button working
EnterBtn.addEventListener('keypress', function (event) {
    if(event.key === 'Enter'){
      searchAlbum();
    }
  })