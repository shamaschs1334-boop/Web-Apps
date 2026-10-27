
// ========================================
// CAMPUS BITES - ORDER MANAGEMENT
// ========================================

// Meal prices in Pakistani Rupees
const mealPrices = {
    chicken: 650,
    pasta: 500,
    sandwich: 100
};

// Meal size prices
const sizePrices = {
    regular: 0,
    extraLarge: 150
};

// Extra item prices
const extraPrices = {
    juice: 180,
    dessert: 120
};

// Select HTML elements
const orderForm = document.getElementById("orderForm");
const mealSelect = document.getElementById("meal");

const sizeOptions = document.querySelectorAll(
    'input[name="mealSize"]'
);

const extraOptions = document.querySelectorAll(".extra");

const currentTotal = document.getElementById("currentTotal");
const orderSummary = document.getElementById("orderSummary");
const errorMessage = document.getElementById("errorMessage");

const tipButton = document.getElementById("tipButton");
const tipMessage = document.getElementById("tipMessage");

// Store the calculated order price
let orderTotal = 0;


// ========================================
// CALCULATE TOTAL PRICE
// ========================================

const calculateTotal = () => {
    let total = 0;

    // Add selected meal price
    const selectedMeal = mealSelect.value;

    if (selectedMeal !== "") {
        total += mealPrices[selectedMeal];
    }

    // Add selected size price
    const selectedSize = document.querySelector(
        'input[name="mealSize"]:checked'
    ).value;

    total += sizePrices[selectedSize];

    // Add prices of checked extras
    extraOptions.forEach((extra) => {
        if (extra.checked) {
            total += extraPrices[extra.value];
        }
    });

    // Save and display total
    orderTotal = total;
    currentTotal.textContent = `PKR ${orderTotal}`;

    return orderTotal;
};


// ========================================
// GET SELECTED MEAL NAME
// ========================================

const getMealName = () => {
    const selectedOption =
        mealSelect.options[mealSelect.selectedIndex];

    return selectedOption.textContent;
};


// ========================================
// GET SELECTED SIZE
// ========================================

const getMealSize = () => {
    const selectedSize = document.querySelector(
        'input[name="mealSize"]:checked'
    ).value;

    return selectedSize === "extraLarge"
        ? "Extra Large"
        : "Regular";
};


// ========================================
// GET SELECTED EXTRAS
// ========================================

const getSelectedExtras = () => {
    const selectedExtras = [];

    extraOptions.forEach((extra) => {
        if (extra.checked) {
            const extraName =
                extra.nextElementSibling.nextElementSibling
                    .querySelector("strong").textContent;

            selectedExtras.push(extraName);
        }
    });

    return selectedExtras.length > 0
        ? selectedExtras.join(", ")
        : "No extras";
};


// ========================================
// UPDATE PRICE WHEN OPTIONS CHANGE
// ========================================

// Meal selection event
mealSelect.addEventListener("change", calculateTotal);

// Meal size events
sizeOptions.forEach((sizeOption) => {
    sizeOption.addEventListener("change", calculateTotal);
});

// Optional extra events
extraOptions.forEach((extraOption) => {
    extraOption.addEventListener("change", calculateTotal);
});


// ========================================
// CREATE SUMMARY ROWS SAFELY
// ========================================

const addSummaryItem = (label, value) => {
    const summaryItem = document.createElement("div");
    summaryItem.className = "summary-item";

    const itemLabel = document.createElement("strong");
    itemLabel.textContent = `${label}: `;

    const itemValue = document.createElement("span");
    itemValue.textContent = value;

    summaryItem.append(itemLabel, itemValue);
    orderSummary.appendChild(summaryItem);
};


// ========================================
// HANDLE ORDER FORM SUBMISSION
// ========================================

orderForm.addEventListener("submit", (event) => {

    // Prevent page reload
    event.preventDefault();

    // Clear old errors
    errorMessage.textContent = "";

    // Validate required fields and email
    if (!orderForm.checkValidity()) {
        orderForm.reportValidity();
        return;
    }

    // Validate meal selection
    if (!mealSelect.value) {
        errorMessage.textContent =
            "Please select a meal before placing your order.";
        return;
    }

    // Read student details
    const studentName = document.getElementById(
        "studentName"
    ).value.trim();

    const studentEmail = document.getElementById(
        "studentEmail"
    ).value.trim();

    // Read meal details
    const mealName = getMealName();
    const mealSize = getMealSize();
    const selectedExtras = getSelectedExtras();

    // Recalculate the final amount
    const finalTotal = calculateTotal();

    // Remove initial or previous summary
    orderSummary.replaceChildren();

    // Add all order information
    addSummaryItem("Student Name", studentName);
    addSummaryItem("Email", studentEmail);
    addSummaryItem("Meal", mealName);
    addSummaryItem("Size", mealSize);
    addSummaryItem("Extras", selectedExtras);
    addSummaryItem("Final Total", `PKR ${finalTotal}`);

    // Display order confirmation
    const confirmation = document.createElement("p");

    confirmation.className = "text-success fw-bold mt-3";
    confirmation.textContent =
        "Your order has been placed successfully!";

    orderSummary.appendChild(confirmation);
});


// ========================================
// FETCH A TIP FROM A PUBLIC JSON API
// ========================================

tipButton.addEventListener("click", async () => {

    // Show loading status
    tipMessage.textContent = "Fetching a helpful tip...";

    try {
        // Fetch random advice from the public API
        const response = await fetch(
            "https://api.adviceslip.com/advice"
        );

        // Handle unsuccessful HTTP response
        if (!response.ok) {
            throw new Error("The API request failed.");
        }

        // Parse JSON response
        const data = await response.json();

        // Display the received advice
        tipMessage.textContent = data.slip.advice;

    } catch (error) {
        // Display a useful error message
        tipMessage.textContent =
            "Unable to load a tip. Check your internet connection and try again.";
    }
});


// ========================================
// INITIALIZE THE APPLICATION
// ========================================

// Initial total should be PKR 0
calculateTotal();
