var moveCatBtn = document.querySelector(".move-cat-btn");

moveCatBtn.addEventListener("click", function () {
  document.querySelector(".kitty-first-move").classList.toggle("active");
  document.querySelector(".kitty-first-move").classList.toggle("hide");

  document.querySelector(".kitty-second-move").classList.toggle("active");
  document.querySelector(".kitty-second-move").classList.toggle("hide");
});

var sectionElement = document.querySelector(".sparkle");
var tag = document.createElement("img");
tag.classList.add("sparkle-img");
sectionElement.appendChild(tag);
document.querySelector(".sparkle-img").classList.add("hide");


document.querySelector(".sparkle-btn").addEventListener("click", function () {
  document.querySelector(".sparkle-img").src = "CSS/sparkle.png";
  document.querySelector(".sparkle-img").classList.toggle("active");
  document.querySelector(".sparkle-img").classList.toggle("hide");
});


let scrollDistance =  document.getElementById('showScroll').innerHTML = pageYOffset;

window.onscroll = () => { 
  let scrollDistance =  document.getElementById('showScroll').innerHTML = pageYOffset;
  if (scrollDistance >= 100) {
    document.querySelector(".scroll-to-top-btn").classList.remove("hide");  
    document.querySelector(".scroll-to-top-btn").classList.add("active");  

  } else{
    document.querySelector(".scroll-to-top-btn").classList.remove("active");  
    document.querySelector(".scroll-to-top-btn").classList.add("hide");  
  }
  console.log(scrollDistance);
}
document.querySelector(".scroll-to-top-btn").addEventListener("click", function () {
  let scrollDistance =  document.getElementById('showScroll').innerHTML = pageYOffset;
  window.scroll(0, scrollDistance-=1100)
});


const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if(userPrefersDark){
  document.body.classList.add("dark-mode");
}
