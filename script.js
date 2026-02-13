// ============================
// LOGIN PAGE
// ============================
function saveName(event) {

    event.preventDefault();

    const name = document.getElementById("username").value;

    if (name.trim() === "") {
        alert("Please enter your name!");
        return;
    }

    localStorage.setItem("username", name);
    window.location.href = "setup.html";
}



// ============================
// SETUP PAGE
// ============================
function saveSetup(event) {

    event.preventDefault();

    const budget = parseFloat(document.getElementById("budget").value);
    const goal = parseFloat(document.getElementById("goal").value);

    if (!budget || !goal) {
        alert("Please enter both Budget and Goal");
        return;
    }

    localStorage.setItem("budget", budget);
    localStorage.setItem("goal", goal);
    localStorage.setItem("expenses", JSON.stringify([]));
    localStorage.setItem("income", 0); // NEW: income storage

    window.location.href = "index.html";
}



// ============================
// DASHBOARD PAGE
// ============================
if (window.location.pathname.includes("index.html")) {

    const name = localStorage.getItem("username") || "User";
    const budget = parseFloat(localStorage.getItem("budget")) || 0;
    const goal = parseFloat(localStorage.getItem("goal")) || 0;
    const income = parseFloat(localStorage.getItem("income")) || 0;

    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

    const remaining = budget + income - totalSpent;

    document.getElementById("welcome").innerText =
        "Welcome back, " + name + "!";

    document.getElementById("budgetDisplay").innerText =
        "₹ " + budget;

    document.getElementById("spentDisplay").innerText =
        "₹ " + totalSpent;

    document.getElementById("remainingDisplay").innerText =
        "₹ " + remaining;

    document.getElementById("goalDisplay").innerText =
        "₹ " + goal;
}



// ============================
// EXPENSES PAGE
// ============================
if (window.location.pathname.includes("expenses.html")) {

    const budget = parseFloat(localStorage.getItem("budget")) || 0;
    const income = parseFloat(localStorage.getItem("income")) || 0;
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    function updateUI() {

        let totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
        let remaining = budget + income - totalSpent;

        document.getElementById("totalSpent").innerText = "₹ " + totalSpent;
        document.getElementById("currentBalance").innerText = "₹ " + remaining;

        const list = document.getElementById("expenseItems");
        list.innerHTML = "";

        if (expenses.length === 0) {
            list.innerHTML = "<li>No expenses yet</li>";
        } else {
            expenses.forEach(item => {
                const li = document.createElement("li");
                li.innerText = item.date + " | " + item.category + " | ₹ " + item.amount;
                list.appendChild(li);
            });
        }

        updateChart();
    }

    window.addExpense = function() {

        const amount = parseFloat(document.getElementById("amount").value);
        const category = document.getElementById("category").value;

        if (!amount || category === "") {
            alert("Please fill all fields");
            return;
        }

        let totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
        let remaining = budget + income - totalSpent;

        if (amount > remaining) {
            alert("Insufficient balance!");
            return;
        }

        const today = new Date().toLocaleDateString();

        expenses.push({ amount, category, date: today });
        localStorage.setItem("expenses", JSON.stringify(expenses));

        document.getElementById("amount").value = "";
        document.getElementById("category").value = "";

        updateUI();
    };

    let chart;

    function updateChart() {

        const categories = ["Food", "Travel", "Shopping", "Academic", "Other"];

        const data = categories.map(cat =>
            expenses
                .filter(e => e.category === cat)
                .reduce((sum, e) => sum + e.amount, 0)
        );

        if (chart) chart.destroy();

        const ctx = document.getElementById("expenseChart").getContext("2d");

        chart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: categories,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        "#8A947B",
                        "#D6B0A6",
                        "#b7e2c2",
                        "#6F7863",
                        "#F4EDE4"
                    ]
                }]
            }
        });
    }

    updateUI();
}



// ============================
// SAVINGS PAGE
// ============================
if (window.location.pathname.includes("savings.html")) {

    const budget = parseFloat(localStorage.getItem("budget")) || 0;
    const goal = parseFloat(localStorage.getItem("goal")) || 0;
    let income = parseFloat(localStorage.getItem("income")) || 0;
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    function calculateSavings() {

        const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
        return budget + income - totalSpent;
    }

    function updateSavingsUI() {

        const currentSavings = calculateSavings();

        document.getElementById("currentSavings").innerText =
            "₹ " + currentSavings;

        document.getElementById("savingsGoal").innerText =
            "₹ " + goal;

        let progressPercent = 0;

        if (goal > 0) {
            progressPercent = (currentSavings / goal) * 100;
            if (progressPercent > 100) progressPercent = 100;
        }

        document.getElementById("progressFill").style.width =
            progressPercent + "%";
    }

    window.addIncome = function() {

        const amount = parseFloat(document.getElementById("incomeAmount").value);

        if (!amount || amount <= 0) {
            alert("Enter valid amount");
            return;
        }

        income += amount;
        localStorage.setItem("income", income);

        document.getElementById("incomeAmount").value = "";

        updateSavingsUI();
    };

    updateSavingsUI();
}
