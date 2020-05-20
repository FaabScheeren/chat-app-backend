const socket = io();

// Form elements
const $messageForm = document.querySelector("form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");

// Location elements
const $locationButton = document.querySelector("#send-location");

socket.on("message", (message) => {
  console.log(`${message}`);
});

socket.on("updateMessage", (input) => {
  console.log(`This is the message ${input}`);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Disable form
  $messageFormButton.setAttribute("disabled", "disabled");

  // Ways to select input element by name
  // const input = document.querySelector('input[name="inputfield"]').value;
  const input = e.target.elements.inputfield.value;
  socket.emit("formSubmit", input, (error) => {
    // Enable form
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    if (error) {
      return console.log(error);
    }
    console.log("The message was deliverd!");
  });
});

$locationButton.addEventListener("click", (e) => {
  $locationButton.setAttribute("disabled", "disabled");

  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const location = {
      longitude: position.coords.longitude,
      latitude: position.coords.latitude,
    };

    socket.emit("sendLocation", location, (message) => {
      $locationButton.removeAttribute("disabled");
      console.log(message);
    });
  });
});
