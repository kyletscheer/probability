let events = [];
let combinations = [];
let combinationsProbabilities = [];
function handleFormSubmission(event) {
  event.preventDefault(); // Prevent default form submission behavior
  calculateCombinations();
  runExperiments(10000);
}

function addEvent() {
  const eventsContainer = document.getElementById("eventsContainer");

  const eventDiv = document.createElement("div");
  eventDiv.innerHTML = `
                  <label for="eventName${events.length}">Event Name:</label>
                  <input type="text" id="eventName${events.length}" required />
                  <label for="eventProbability${events.length}">Probability (0-1):</label>
                  <input type="number" min="0" max="1" step="0.0001" id="eventProbability${events.length}" required />
              `;

  eventsContainer.appendChild(eventDiv);
}

function calculateCombinations() {
  // Get all the input fields for events and probabilities
  const eventNames = document.querySelectorAll('[id^="eventName"]');
  const eventProbabilities = document.querySelectorAll(
    '[id^="eventProbability"]'
  );

  // Clear the previous events data
  events = [];

  // Store the user-submitted events and probabilities in the events array
  for (let i = 0; i < eventNames.length; i++) {
    const eventName = eventNames[i].value;
    const eventProbability = parseFloat(eventProbabilities[i].value);
    events.push({ name: eventName, probability: eventProbability });
  }

  const totalEvents = events.length;
  combinations = []; // Remove local declaration
  combinationsProbabilities = []; // Remove local declaration

  // Generate all possible combinations using binary counting
  for (let i = 0; i < 2 ** totalEvents; i++) {
    const combination = [];
    let probability = 1;

    for (let j = 0; j < totalEvents; j++) {
      if (i & (1 << j)) {
        combination.push(events[j].name);
        probability *= events[j].probability;
      }
    }

    if (combination.length > 0) {
      combinations.push(combination.join(", "));
      combinationsProbabilities.push(probability);
    }
  }

  // Calculate the probability that no combination of events occurs (complementary probability)
  let complementaryProbability = 1;
  for (let i = 0; i < combinationsProbabilities.length; i++) {
    complementaryProbability -= combinationsProbabilities[i];
  }

  // Insert the complementary probability at the beginning of the combinations list
  combinations.unshift("None");
  combinationsProbabilities.unshift(complementaryProbability);

  displayCombinations(combinations, combinationsProbabilities);
}

function displayCombinations(combinations, probabilities) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  for (let i = 0; i < combinations.length; i++) {
    const combinationText = `${combinations[i]} - Probability: ${probabilities[
      i
    ].toFixed(4)}`;
    const combinationElement = document.createElement("p");
    combinationElement.textContent = combinationText;
    resultDiv.appendChild(combinationElement);
  }
}
function runExperiments() {
  const numExperimentsInput = document.getElementById("numExperiments");
  const numExperiments = parseInt(numExperimentsInput.value);

  if (isNaN(numExperiments) || numExperiments <= 0) {
    alert("Please enter a valid number of experiments (greater than 0).");
    return;
  }

  // Calculate theoretical probabilities first
  calculateCombinations();

  const numCombinations = combinations.length;
  const occurrences = new Array(numCombinations).fill(0);

  for (let i = 0; i < numExperiments; i++) {
    let random = Math.random();
    let cumulativeProbability = 0;

    for (let j = 0; j < numCombinations; j++) {
      cumulativeProbability += calculateTheoreticalProbability(j);
      if (random <= cumulativeProbability) {
        occurrences[j]++;
        break;
      }
    }
  }

  displayResults(
    combinations,
    combinationsProbabilities,
    occurrences,
    numExperiments
  );
}

function displayResults(
  combinations,
  theoreticalProbabilities,
  occurrences,
  numExperiments
) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  const table = document.createElement("table");
  table.classList.add("table", "table-striped", "table-bordered");
  const tableHead = document.createElement("thead");
  tableHead.innerHTML = `
        <tr>
          <th>Combination</th>
          <th>Number of Events</th>
          <th>Theoretical Probability</th>
          <th>Experimental Result Probability</th>
        </tr>
      `;
  const tableBody = document.createElement("tbody");

  for (let i = 0; i < combinations.length; i++) {
    const combinationText = combinations[i];
    const theoreticalProbability = calculateTheoreticalProbability(i);
    const experimentalProbability = occurrences[i] / numExperiments;
    const numEvents = combinationText.split(", ").length; // Calculate number of events

    const row = document.createElement("tr");
    row.innerHTML = `
                      <td>${combinationText}</td>
                      <td>${numEvents}</td>
                      <td>${theoreticalProbability.toFixed(4)}</td>
                      <td>${experimentalProbability.toFixed(4)}</td>
                  `;

    tableBody.appendChild(row);
  }
  table.appendChild(tableHead);
  table.appendChild(tableBody);
  resultDiv.appendChild(table);
  $(table).DataTable({
    dom: "Bfrtip", // Add buttons to the DOM
    buttons: ["copy", "csv"], // Specify which buttons to display
  });
}
function calculateTheoreticalProbability(index) {
  // Calculate the theoretical probability for the combination at the given index
  let probability = 1;

  for (let i = 0; i < events.length; i++) {
    const eventProbability = events[i].probability;
    const isInCombination = (index & (1 << i)) !== 0;

    if (isInCombination) {
      probability *= eventProbability;
    } else {
      probability *= 1 - eventProbability;
    }
  }

  return probability;
}

//Make 2 events right away
addEvent();
addEvent();
