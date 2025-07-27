import "./index.css";
import { optimizeCutting } from "./logic/optimizer";
import { CuttingState, Detail } from "./types/types";

interface InputTube {
  readonly id: number;
  readonly name: string;
  readonly length: number;
  readonly quantity: number;
}

type State = ReadonlyArray<InputTube>;

const saveToStorage = (tubes: State): void => {
  localStorage.setItem("tubes", JSON.stringify(tubes));
};

const loadFromStorage = (): State => {
  const saved = localStorage.getItem("tubes");
  return saved ? JSON.parse(saved) : [];
};

const addTube = (
  tubes: State,
  name: string,
  length: number,
  quantity: number,
): State => [...tubes, { id: Date.now(), name, length, quantity }];

const removeTube = (tubes: State, id: number): State =>
  tubes.filter((tube) => tube.id !== id);

const clearTubes = (): State => [];

const convertToDetails = (tubes: State): ReadonlyArray<Detail> =>
  tubes.map((tube) => ({
    name: tube.name,
    length: tube.length,
    amount: tube.quantity,
  }));

const updateDisplay = (tubes: State): void => {
  const tubeList = document.getElementById("tubeList")!;
  const tubeCount = document.getElementById("tubeCount")!;
  const clearBtn = document.getElementById("clearBtn")!;

  tubeCount.textContent = tubes.length.toString();

  if (tubes.length === 0) {
    tubeList.innerHTML =
      '<div class="text-center text-blue-200 py-8">No tubes added yet</div>';
    clearBtn.classList.add("hidden");
    return;
  }

  clearBtn.classList.remove("hidden");
  tubeList.innerHTML = tubes
    .map(
      (tube) => `
        <div class="flex justify-between items-center bg-blue-400 rounded-lg p-4 mb-3">
            <div>
                <div class="font-semibold">${tube.name}</div>
                <div class="text-sm text-blue-100">${tube.length}mm × ${tube.quantity}</div>
            </div>
            <button
                onclick="handleDeleteTube(${tube.id})"
                class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors"
            >
                Delete
            </button>
        </div>
    `,
    )
    .join("");
};

const showResults = (result: CuttingState): void => {
  const efficiency = (
    (1 - result.totalWaste / (result.tubes.length * 5500)) *
    100
  ).toFixed(1);

  let html = `
        <div class="mt-6 bg-green-500 rounded-2xl p-6">
            <h3 class="text-xl font-bold mb-4">Results</h3>
            <div class="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                    <div class="text-2xl font-bold">${result.tubes.length}</div>
                    <div class="text-sm">Tubes Needed</div>
                </div>
                <div>
                    <div class="text-2xl font-bold">${efficiency}%</div>
                    <div class="text-sm">Efficiency</div>
                </div>
                <div>
                    <div class="text-2xl font-bold">${result.totalWaste}</div>
                    <div class="text-sm">Waste (mm)</div>
                </div>
            </div>
            <div class="space-y-2">
    `;

  result.tubes.forEach((tube, index) => {
    html += `
            <div class="bg-green-400 rounded-lg p-3">
                <div class="font-semibold mb-2">Tube ${index + 1}:</div>
        `;

    tube.placedDetails.forEach((detail) => {
      html += `<div class="text-sm">• ${detail.name}: ${detail.length}mm</div>`;
    });

    html += `<div class="text-sm text-green-100 mt-1">Waste: ${tube.remainingLength}mm</div></div>`;
  });

  html += "</div></div>";
  document.getElementById("results")!.innerHTML = html;
};

let currentState: State = loadFromStorage();

const handleAddTube = (): void => {
  const nameInput = document.getElementById("tubeName") as HTMLInputElement;
  const lengthInput = document.getElementById("tubeLength") as HTMLInputElement;
  const quantityInput = document.getElementById(
    "tubeQuantity",
  ) as HTMLInputElement;

  const name = nameInput.value.trim();
  const length = parseInt(lengthInput.value);
  const quantity = parseInt(quantityInput.value);

  if (!name || !length || !quantity) {
    alert("Please fill all fields");
    return;
  }

  currentState = addTube(currentState, name, length, quantity);
  saveToStorage(currentState);
  updateDisplay(currentState);

  nameInput.value = "";
  lengthInput.value = "";
  quantityInput.value = "";
};

const handleDeleteTube = (id: number): void => {
  currentState = removeTube(currentState, id);
  saveToStorage(currentState);
  updateDisplay(currentState);
};

const handleClearTubes = (): void => {
  if (confirm("Clear all tubes?")) {
    currentState = clearTubes();
    saveToStorage(currentState);
    updateDisplay(currentState);
    document.getElementById("results")!.innerHTML = "";
  }
};

const handleOptimize = (): void => {
  if (currentState.length === 0) {
    alert("Add some tubes first!");
    return;
  }

  const details = convertToDetails(currentState);
  const result = optimizeCutting([...details]);
  showResults(result);
};

document.addEventListener("DOMContentLoaded", () => {
  updateDisplay(currentState);

  document.getElementById("addBtn")!.addEventListener("click", handleAddTube);
  document
    .getElementById("optimizeBtn")!
    .addEventListener("click", handleOptimize);
  document
    .getElementById("clearBtn")!
    .addEventListener("click", handleClearTubes);
});

(window as any).handleDeleteTube = handleDeleteTube;
