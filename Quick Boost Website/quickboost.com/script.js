// Select the image
const img = document.querySelector('.right-part img');

// Add event listener for mouseover and mouseout events
img.addEventListener('mouseover', function() {
  // Add event listener for mousemove event when mouse is over the image
  img.addEventListener('mousemove', handleMouseMove);
});

img.addEventListener('mouseout', function() {
  // Remove event listener for mousemove event when mouse leaves the image
  img.removeEventListener('mousemove', handleMouseMove);
});

function handleMouseMove(e) {
  // Get the mouse position
  const x = e.clientX;
  const y = e.clientY;

  // Get the center of the image
  const imgRect = img.getBoundingClientRect();
  const imgX = imgRect.left + (imgRect.width / 2);
  const imgY = imgRect.top + (imgRect.height / 2);

  // Calculate the angle between the center of the image and the mouse position
  const angleX = (imgY - y) / 5;
  const angleY = (imgX - x) / 5;

  // Apply the rotation
  img.style.transform = `perspective(4000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
}
