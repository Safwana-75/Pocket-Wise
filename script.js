// Save user name
function saveName() {
    const name = document.getElementById("username").value;

    if (name.trim() === "") {
        alert("Please enter your name!");
        return;
    }

    localStorage.setItem("username", name);
    window.location.href = "setup.html";
}


// Save budget and goal
function saveSetup() {
    const budget = parseFloat(document.getElementById("budget").value);
    const goal = parseFloat(document.getElementById("goal").value);

    if (!budget || !goal) {
        alert("Please enter both Budget and Goal");
        return;
    }

    localStorage.setItem("budget", budget);
    localStorage.setItem("goal", goal);

    // Initialize these if not already
    localStorage.setItem("expenses", JSON.stringify([]));
    localStorage.setItem("savings", 0);

    window.location.href = "index.html";
}



// Load dashboard data
function loadDashboard() {
    const name = localStorage.getItem("username");
    const budget = parseFloat(localStorage.getItem("budget")) || 0;
    const spent = parseFloat(localStorage.getItem("spent")) || 0;
    const goal = localStorage.getItem("goal") || 0;

    if (name) {
        document.getElementById("welcome").innerText = "Welcome back, " + name + "!";
    }

    if (document.getElementById("budgetDisplay")) {
        document.getElementById("budgetDisplay").innerText = "₹ " + budget;
        document.getElementById("spentDisplay").innerText = "₹ " + spent;
        document.getElementById("remainingDisplay").innerText = "₹ " + (budget - spent);
        document.getElementById("goalDisplay").innerText = "₹ " + goal;
    }
}
// ===== EXPENSES PAGE =====

if (window.location.pathname.includes("expenses.html")) {

    const budget = parseFloat(localStorage.getItem("budget")) || 0;
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    function updateUI() {
        let totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
        let remaining = budget - totalSpent;

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

        if (totalSpent + amount > budget) {
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
            expenses.filter(e => e.category === cat)
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
                        "#ACB493",
                        "#8A947B",
                        "#D69F93",
                        "#E0B6AC",
                        "#677462"
                    ]
                }]
            }
        });
    }

    updateUI();
}
// ===== SAVINGS PAGE =====

if (window.location.pathname.includes("savings.html")) {

    let savings = parseFloat(localStorage.getItem("savings")) || 0;
    const goal = parseFloat(localStorage.getItem("goal")) || 0;

    function updateSavingsUI() {

        document.getElementById("currentSavings").innerText = "₹ " + savings;
        document.getElementById("savingsGoal").innerText = "₹ " + goal;

        let progressPercent = 0;

        if (goal > 0) {
            progressPercent = (savings / goal) * 100;
            if (progressPercent > 100) progressPercent = 100;
        }

        document.getElementById("progressFill").style.width = progressPercent + "%";
    }

    window.addIncome = function() {

        const amount = parseFloat(document.getElementById("incomeAmount").value);

        if (!amount || amount <= 0) {
            alert("Enter valid amount");
            return;
        }

        savings += amount;
        localStorage.setItem("savings", savings);

        document.getElementById("incomeAmount").value = "";

        updateSavingsUI();
    };

    updateSavingsUI();
}
// ===== DASHBOARD PAGE =====
if (window.location.pathname.includes("index.html")) {

    const name = localStorage.getItem("username") || "User";
    const budget = parseFloat(localStorage.getItem("budget")) || 0;
    const goal = parseFloat(localStorage.getItem("goal")) || 0;

    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    // Calculate total spent
    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

    const remaining = budget - totalSpent;

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
