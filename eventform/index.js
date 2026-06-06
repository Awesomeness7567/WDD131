const form = document.querySelector("#EventForm");
const travelRange = document.querySelector("#travelRange");
const notesContainer = document.querySelector("#notesContainer");
const notesLabel = document.querySelector("#notesLabel");
const notes = document.querySelector("#notes");
const output = document.querySelector("#output");

function updateNotesField() {
  const value = travelRange.value;

  if (value === "one") {
    notesContainer.hidden = false;
    notesLabel.textContent = "Student I#";
  }
  else if (value === "many") {
    notesContainer.hidden = false;
    notesLabel.textContent = "Access Code";
  }
  else {
    notesContainer.hidden = true;
  }
}

travelRange.addEventListener("change", updateNotesField);
updateNotesField();

function isPastDate(value) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const chosen = new Date(value);

  return chosen < today;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  output.innerHTML = "";

  const firstName = form.firstName.value.trim();
  const lastName = form.lastName.value.trim();
  const email = form.email.value.trim();
  const type = form.travelRange.value;
  const availableDate = form.availableDate.value;
  const note = form.notes.value.trim();

  let errors = [];

  if (type === "one") {
    if (!/^\d{9}$/.test(note)) {
      errors.push("Student I# must be exactly 9 digits.");
    }
  }

  if (type === "many") {
    if (note.toUpperCase() !== "EVENT131") {
      errors.push("Access Code must be EVENT131.");
    }
  }

  if (isPastDate(availableDate)) {
    errors.push("Please choose a future date.");
  }

  if (errors.length > 0) {
    output.innerHTML = `
      <h3>Please fix the following errors:</h3>
      <ul>
        ${errors.map(error => `<li>${error}</li>`).join("")}
      </ul>
    `;
    return;
  }

  output.innerHTML = `
    <h2>Event Registration Successful!</h2>

    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Type:</strong> ${type === "one" ? "Student" : "Guest"}</p>
    <p><strong>Date:</strong> ${availableDate}</p>

    <hr>

    <h3>Ticket Information</h3>
    <p>Your ticket has been reserved.</p>
    <p>Please bring a photo ID.</p>
    <p>Check-in begins 30 minutes before the event.</p>
  `;

  form.reset();
  updateNotesField();
});