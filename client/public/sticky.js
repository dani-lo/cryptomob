// When the user scrolls the page, execute myFunction


var header;

// Get the offset position of the navbar
var sticky;

window.onscroll = function() {
    header =header ||  document.getElementById("toolbar");
    sticky = header && header.offsetTop;
    myFunction()
};
// Get the header


// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}