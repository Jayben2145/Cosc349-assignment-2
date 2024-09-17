document.addEventListener('DOMContentLoaded', function () {
    let currentIndex = 0;
    const images = document.querySelectorAll('.carousel img');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
  
    // Show the first image
    if (images.length > 0) {
      images[0].classList.add('active');
    }
  
    // Function to show the next image
    function showNextImage() {
      images[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add('active');
    }
  
    // Function to show the previous image
    function showPreviousImage() {
      images[currentIndex].classList.remove('active');
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      images[currentIndex].classList.add('active');
    }
  
    // Event listeners for the arrows
    rightArrow.addEventListener('click', showNextImage);
    leftArrow.addEventListener('click', showPreviousImage);
  });
  