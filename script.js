// State Management
const state = {
  events: [],
  results: null,
  chartInstance: null,
  theme: localStorage.getItem("theme") || "light",
};

// Example Scenarios
const examples = [
  {
    title: "Coin Flips",
    description: "Three fair coin flips",
    events: [
      { name: "Coin 1 Heads", probability: 0.5 },
      { name: "Coin 2 Heads", probability: 0.5 },
      { name: "Coin 3 Heads", probability: 0.5 },
    ],
  },
  {
    title: "Dice Rolls",
    description: "Rolling specific numbers on two dice",
    events: [
      { name: "Die 1 is 6", probability: 0.1667 },
      { name: "Die 2 is 6", probability: 0.1667 },
    ],
  },
  {
    title: "Weather Forecast",
    description: "Multiple weather conditions",
    events: [
      { name: "Rain Tomorrow", probability: 0.3 },
      { name: "Wind > 20mph", probability: 0.4 },
      { name: "Temperature > 70°F", probability: 0.6 },
    ],
  },
  {
    title: "Medical Test",
    description: "Diagnostic test accuracy",
    events: [
      { name: "Patient Has Disease", probability: 0.01 },
      { name: "Test Shows Positive", probability: 0.95 },
    ],
  },
  {
    title: "Product Quality",
    description: "Manufacturing defects",
    events: [
      { name: "Component A Defect", probability: 0.02 },
      { name: "Component B Defect", probability: 0.03 },
      { name: "Component C Defect", probability: 0.01 },
    ],
  },
  {
    title: "Sports Game",
    description: "Team performance outcomes",
    events: [
      { name: "Team Scores > 100", probability: 0.65 },
      { name: "Team Wins", probability: 0.55 },
      { name: "Star Player Scores 30+", probability: 0.4 },
    ],
  },
];

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
  loadEventsFromStorage();
  setupEventListeners();
  renderExamples();

  if (state.events.length === 0) {
    addEvent({ name: "Event A", probability: 0.5 });
    addEvent({ name: "Event B", probability: 0.5 });
  }
});

// Theme Management
function initializeTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  updateThemeIcon();
}

function toggleTheme() {
  state.theme = state.theme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", state.theme);
  localStorage.setItem("theme", state.theme);
  updateThemeIcon();

  // Recreate chart with new theme
  if (state.chartInstance) {
    state.chartInstance.destroy();
    createChart(state.results);
  }
}

function updateThemeIcon() {
  const icon = document.querySelector("#themeToggle i");
  icon.className = state.theme === "light" ? "fas fa-moon" : "fas fa-sun";
}

// Event Management
function addEvent(eventData = null) {
  const event = eventData || {
    id: Date.now(),
    name: `Event ${state.events.length + 1}`,
    probability: 0.5,
  };

  if (!event.id) event.id = Date.now();

  state.events.push(event);
  saveEventsToStorage();
  renderEvents();
}

function removeEvent(id) {
  state.events = state.events.filter((e) => e.id !== id);
  saveEventsToStorage();
  renderEvents();

  if (state.results) {
    document.getElementById("resultsSection").style.display = "none";
    state.results = null;
  }
}

function updateEvent(id, field, value) {
  const event = state.events.find((e) => e.id === id);
  if (event) {
    event[field] = field === "probability" ? parseFloat(value) : value;
    saveEventsToStorage();
  }
}

function clearAllEvents() {
  if (confirm("Are you sure you want to clear all events?")) {
    state.events = [];
    saveEventsToStorage();
    renderEvents();
    document.getElementById("resultsSection").style.display = "none";
  }
}

function renderEvents() {
  const container = document.getElementById("eventsList");

  if (state.events.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No events added yet. Click "Add Event" to get started.</p>';
    return;
  }

  container.innerHTML = state.events
    .map(
      (event, index) => `
                <div class="event-item" data-id="${event.id}">
                    <i class="fas fa-grip-vertical event-drag-handle"></i>
                    <div class="event-inputs">
                        <div class="form-group">
                            <label>Event Name</label>
                            <input type="text" value="${event.name}" 
                                   onchange="updateEvent(${event.id}, 'name', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Probability (0-1)</label>
                            <input type="number" value="${event.probability}" 
                                   min="0" max="1" step="0.01"
                                   onchange="updateEvent(${event.id}, 'probability', this.value)">
                        </div>
                    </div>
                    <div class="event-actions">
                        <button class="icon-btn" onclick="removeEvent(${event.id})" title="Remove event">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `
    )
    .join("");

  // Validate probabilities
  validateProbabilities();
}

function validateProbabilities() {
  const totalProb = state.events.reduce((sum, e) => sum + e.probability, 0);
  const container = document.getElementById("eventsList");

  // Remove existing warnings
  const existingWarning = container.querySelector(".alert-warning");
  if (existingWarning) existingWarning.remove();

  if (state.events.some((e) => e.probability < 0 || e.probability > 1)) {
    container.insertAdjacentHTML(
      "beforeend",
      `
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>Warning: All probabilities must be between 0 and 1.</span>
                    </div>
                `
    );
  }
}

// Storage
function saveEventsToStorage() {
  localStorage.setItem("events", JSON.stringify(state.events));
}

function loadEventsFromStorage() {
  const saved = localStorage.getItem("events");
  if (saved) {
    try {
      state.events = JSON.parse(saved);
      renderEvents();
    } catch (e) {
      console.error("Failed to load events from storage");
    }
  }
}

// Calculation Engine
function calculateCombinations() {
  if (state.events.length === 0) {
    alert("Please add at least one event.");
    return null;
  }

  if (state.events.some((e) => e.probability < 0 || e.probability > 1)) {
    alert("All probabilities must be between 0 and 1.");
    return null;
  }

  const n = state.events.length;
  const combinations = [];

  // Generate all 2^n combinations
  for (let i = 0; i < Math.pow(2, n); i++) {
    const combination = {
      mask: i,
      events: [],
      notEvents: [],
      probability: 1,
    };

    for (let j = 0; j < n; j++) {
      if (i & (1 << j)) {
        combination.events.push(state.events[j].name);
        combination.probability *= state.events[j].probability;
      } else {
        combination.notEvents.push(state.events[j].name);
        combination.probability *= 1 - state.events[j].probability;
      }
    }

    combinations.push(combination);
  }

  return combinations;
}

async function runSimulation() {
  const numExperiments = parseInt(
    document.getElementById("numExperiments").value
  );

  if (!numExperiments || numExperiments < 1) {
    alert("Please enter a valid number of experiments.");
    return;
  }

  if (numExperiments > 1000000) {
    alert("Maximum 1,000,000 experiments allowed.");
    return;
  }

  const combinations = calculateCombinations();
  if (!combinations) return;

  // Show animation container
  const animContainer = document.getElementById("animationContainer");
  animContainer.style.display = "block";

  const occurrences = new Array(combinations.length).fill(0);
  const vizContainer = document.getElementById("experimentViz");
  vizContainer.innerHTML = "";

  // Color mapping for visualization
  const colors = generateColors(combinations.length);

  const batchSize = 100;
  const updateInterval = Math.max(1, Math.floor(numExperiments / 100));

  for (let i = 0; i < numExperiments; i++) {
    const random = Math.random();
    let cumProb = 0;

    for (let j = 0; j < combinations.length; j++) {
      cumProb += combinations[j].probability;
      if (random <= cumProb) {
        occurrences[j]++;

        // Add visual dot
        if (i % updateInterval === 0 && vizContainer.children.length < 1000) {
          const dot = document.createElement("div");
          dot.className = "experiment-dot";
          dot.style.backgroundColor = colors[j];
          vizContainer.appendChild(dot);
        }
        break;
      }
    }

    // Update progress
    if (i % batchSize === 0) {
      const progress = (i / numExperiments) * 100;
      document.getElementById("progressFill").style.width = progress + "%";
      document.getElementById(
        "animationStatus"
      ).textContent = `Running experiments... ${i.toLocaleString()} / ${numExperiments.toLocaleString()}`;

      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  document.getElementById("progressFill").style.width = "100%";
  document.getElementById(
    "animationStatus"
  ).textContent = `Completed ${numExperiments.toLocaleString()} experiments!`;

  // Calculate results
  state.results = combinations.map((combo, i) => ({
    ...combo,
    theoretical: combo.probability,
    experimental: occurrences[i] / numExperiments,
    count: occurrences[i],
  }));

  displayResults();
}

function displayResults() {
  document.getElementById("resultsSection").style.display = "block";

  // Stats overview
  const statsGrid = document.getElementById("statsGrid");
  const totalCombos = state.results.length;
  const mostLikely = state.results.reduce(
    (max, r) => (r.theoretical > max.theoretical ? r : max),
    state.results[0]
  );
  const avgDiff =
    state.results.reduce(
      (sum, r) => sum + Math.abs(r.theoretical - r.experimental),
      0
    ) / totalCombos;

  statsGrid.innerHTML = `
                <div class="stat-card">
                    <div class="stat-value">${totalCombos}</div>
                    <div class="stat-label">Total Combinations</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${(
                      mostLikely.theoretical * 100
                    ).toFixed(1)}%</div>
                    <div class="stat-label">Highest Probability</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${(avgDiff * 100).toFixed(2)}%</div>
                    <div class="stat-label">Avg Difference</div>
                </div>
            `;

  // Results table
  renderResultsTable();

  // Chart
  createChart(state.results);

  // Calculation breakdown
  renderCalculationBreakdown();

  // Scroll to results
  document
    .getElementById("resultsSection")
    .scrollIntoView({ behavior: "smooth" });
}

function renderResultsTable() {
  const tbody = document.getElementById("resultsBody");
  const fullNotation = document.getElementById("notationToggle").checked;

  tbody.innerHTML = state.results
    .sort((a, b) => b.theoretical - a.theoretical)
    .map((result) => {
      const diff = Math.abs(result.theoretical - result.experimental);
      const diffPercent = (diff * 100).toFixed(2);
      const diffClass = diff > 0.05 ? 'style="color: var(--warning)"' : "";

      let label;
      if (fullNotation) {
        const parts = [];
        if (result.events.length > 0) {
          parts.push(result.events.join(" AND "));
        }
        if (result.notEvents.length > 0) {
          parts.push("NOT (" + result.notEvents.join(" OR ") + ")");
        }
        label = parts.length > 0 ? parts.join(" AND ") : "None";
      } else {
        label = result.events.length > 0 ? result.events.join(", ") : "None";
      }

      return `
                        <tr>
                            <td><strong>${label}</strong></td>
                            <td>${result.events.length}</td>
                            <td>${(result.theoretical * 100).toFixed(2)}%</td>
                            <td>${(result.experimental * 100).toFixed(2)}%</td>
                            <td ${diffClass}>${diffPercent}%</td>
                        </tr>
                    `;
    })
    .join("");
}

function renderCalculationBreakdown() {
  const breakdown = document.getElementById("calculationBreakdown");
  const sample = state.results.slice(0, 5); // Show first 5

  breakdown.innerHTML = sample
    .map((result) => {
      const parts = [];

      state.events.forEach((event) => {
        if (result.events.includes(event.name)) {
          parts.push(`P(${event.name}) = ${event.probability}`);
        } else {
          parts.push(
            `P(NOT ${event.name}) = ${(1 - event.probability).toFixed(4)}`
          );
        }
      });

      const calculation = parts.join(" × ");
      const label =
        result.events.length > 0 ? result.events.join(", ") : "None";

      return `
                    <div style="padding: 1rem; background: var(--bg-secondary); border-radius: 0.5rem; margin-bottom: 1rem;">
                        <strong style="color: var(--primary);">${label}:</strong><br>
                        <code style="display: block; margin: 0.5rem 0; padding: 0.5rem; background: var(--bg-tertiary); border-radius: 0.25rem;">
                            ${calculation} = ${result.theoretical.toFixed(6)}
                        </code>x
                        <small style="color: var(--text-secondary);">
                            Result: ${(result.theoretical * 100).toFixed(
                              2
                            )}% probability
                        </small>
                    </div>
                `;
    })
    .join("");
}

function createChart(results) {
  const ctx = document.getElementById("probabilityChart");

  if (state.chartInstance) {
    state.chartInstance.destroy();
  }

  const isDark = state.theme === "dark";
  const textColor = isDark ? "#d1d5db" : "#6b7280";
  const gridColor = isDark ? "#374151" : "#e5e7eb";

  const sortedResults = [...results]
    .sort((a, b) => b.theoretical - a.theoretical)
    .slice(0, 10);

  state.chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: sortedResults.map((r) =>
        r.events.length > 0 ? r.events.join(", ") : "None"
      ),
      datasets: [
        {
          label: "Theoretical",
          data: sortedResults.map((r) => r.theoretical * 100),
          backgroundColor: "rgba(99, 102, 241, 0.7)",
          borderColor: "rgba(99, 102, 241, 1)",
          borderWidth: 2,
        },
        {
          label: "Experimental",
          data: sortedResults.map((r) => r.experimental * 100),
          backgroundColor: "rgba(139, 92, 246, 0.7)",
          borderColor: "rgba(139, 92, 246, 1)",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: textColor },
        },
        title: {
          display: true,
          text: "Top 10 Combinations by Probability",
          color: textColor,
          font: { size: 16, weight: "bold" },
        },
      },
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { color: gridColor },
        },
        y: {
          ticks: {
            color: textColor,
            callback: (value) => value + "%",
          },
          grid: { color: gridColor },
          title: {
            display: true,
            text: "Probability (%)",
            color: textColor,
          },
        },
      },
    },
  });
}

// Combinations Generator
function generateItemCombinations() {
  const input = document.getElementById("itemList").value;
  const items = input
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);

  if (items.length === 0) {
    alert("Please enter at least one item.");
    return;
  }

  const combinations = [];
  const n = items.length;

  for (let i = 0; i < Math.pow(2, n); i++) {
    const combo = [];
    for (let j = 0; j < n; j++) {
      if (i & (1 << j)) {
        combo.push(items[j]);
      }
    }
    combinations.push(combo);
  }

  document.getElementById("combinationsResults").style.display = "block";
  document.getElementById("totalCombos").textContent = combinations.length;

  const tbody = document.getElementById("combosTableBody");
  tbody.innerHTML = combinations
    .map(
      (combo) => `
                <tr>
                    <td>${
                      combo.length > 0 ? combo.join(", ") : "(Empty set)"
                    }</td>
                    <td>${combo.length}</td>
                </tr>
            `
    )
    .join("");
}

// Export Functions
function exportToCSV() {
  if (!state.results) return;

  const headers = [
    "Combination",
    "Events",
    "Theoretical",
    "Experimental",
    "Difference",
  ];
  const rows = state.results.map((r) => [
    r.events.length > 0 ? r.events.join("; ") : "None",
    r.events.length,
    r.theoretical.toFixed(6),
    r.experimental.toFixed(6),
    Math.abs(r.theoretical - r.experimental).toFixed(6),
  ]);

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "probability_results.csv";
  a.click();
}

async function exportToPDF() {
  if (!state.results) return;

  const element = document.getElementById("resultsSection");
  const canvas = await html2canvas(element);

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");
  const imgData = canvas.toDataURL("image/png");
  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  pdf.save("probability_results.pdf");
}

function shareResults() {
  const url = new URL(window.location.href);
  url.searchParams.set("events", JSON.stringify(state.events));

  if (navigator.share) {
    navigator.share({
      title: "Event Probability Results",
      url: url.toString(),
    });
  } else {
    navigator.clipboard.writeText(url.toString());
    alert("Link copied to clipboard!");
  }
}

// Examples
function renderExamples() {
  const container = document.getElementById("examplesList");
  container.innerHTML = examples
    .map(
      (ex, i) => `
                <div class="example-card" onclick="loadExample(${i})">
                    <div class="example-title">${ex.title}</div>
                    <div class="example-description">${ex.description}</div>
                    <small style="color: var(--text-secondary); margin-top: 0.5rem; display: block;">
                        ${ex.events.length} events
                    </small>
                </div>
            `
    )
    .join("");
}

function loadExample(index) {
  const example = examples[index];
  state.events = example.events.map((e) => ({
    ...e,
    id: Date.now() + Math.random(),
  }));
  saveEventsToStorage();
  renderEvents();
  closeModal("examplesModal");
}

// Utility Functions
function generateColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = ((i * 360) / count) % 360;
    colors.push(`hsl(${hue}, 70%, 60%)`);
  }
  return colors;
}

function openModal(id) {
  document.getElementById(id).classList.add("active");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("active");
}

// Event Listeners
function setupEventListeners() {
  // Theme toggle
  document.getElementById("themeToggle").onclick = toggleTheme;

  // Help modal
  document.getElementById("helpBtn").onclick = () => openModal("helpModal");
  document.getElementById("closeHelpModal").onclick = () =>
    closeModal("helpModal");

  // Examples modal
  document.getElementById("examplesBtn").onclick = () =>
    openModal("examplesModal");
  document.getElementById("closeExamplesModal").onclick = () =>
    closeModal("examplesModal");

  // Event management
  document.getElementById("addEventBtn").onclick = () => addEvent();
  document.getElementById("clearAllBtn").onclick = clearAllEvents;

  // Calculate
  document.getElementById("calculateBtn").onclick = runSimulation;

  // Notation toggle
  document.getElementById("notationToggle").onchange = () => {
    if (state.results) renderResultsTable();
  };

  // Export
  document.getElementById("exportCSV").onclick = exportToCSV;
  document.getElementById("exportPDF").onclick = exportToPDF;
  document.getElementById("shareBtn").onclick = shareResults;

  // Combinations generator
  document.getElementById("generateCombosBtn").onclick =
    generateItemCombinations;

  // Tab navigation
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.onclick = () => {
      const targetId = tab.dataset.tab;

      document
        .querySelectorAll(".tab")
        .forEach((t) => t.classList.remove("active"));
      document
        .querySelectorAll(".tab-content")
        .forEach((c) => c.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(targetId).classList.add("active");
    };
  });

  // Close modals on background click
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    };
  });

  // Load from URL params
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("events")) {
    try {
      state.events = JSON.parse(urlParams.get("events"));
      renderEvents();
    } catch (e) {
      console.error("Failed to load events from URL");
    }
  }
}
