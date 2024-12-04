let orderId = 1;
let botId = 1;
const orders = [];
const bots = [];

function createOrder(type) {
  const order = {
    id: orderId++,
    type: type.toUpperCase(),
    status: "PENDING",
  };

  if (type.toUpperCase() === "VIP") {
    // Find the index of the first normal order
    const firstNormalIndex = orders.findIndex((o) => o.type !== "VIP");

    if (firstNormalIndex === -1) {
      // If there are no normal orders, append the VIP order to the end
      orders.push(order);
    } else {
      // Insert the VIP order before the first normal order
      orders.splice(firstNormalIndex, 0, order);
    }
  } else {
    // Add normal orders to the end of the array
    orders.push(order);
  }

  updateOrdersTable();
  assignOrderToBot();
}

function addBot() {
  const bot = {
    id: botId++,
    status: "IDLE",
    orderId: null,
  };
  bots.push(bot);
  updateBotsTable();
  assignOrderToBot();
}

function assignOrderToBot() {
  const pendingOrder = orders.find((order) => order.status === "PENDING");
  if (pendingOrder) {
    const idleBot = bots.find((bot) => bot.status === "IDLE");
    if (idleBot) {
      pendingOrder.status = "PROCESSING";
      idleBot.status = "BUSY";
      idleBot.orderId = pendingOrder.id;
      setTimeout(() => completeOrder(idleBot, pendingOrder), 10000);
      updateOrdersTable();
      updateBotsTable();
    }
  }
}

function completeOrder(bot, order) {
  order.status = "COMPLETE";
  bot.status = "IDLE";
  bot.orderId = null;
  updateOrdersTable();
  updateBotsTable();
  assignOrderToBot();
}

function updateOrdersTable() {
  const ordersTableBody = document.querySelector("#ordersTable tbody");
  ordersTableBody.innerHTML = "";
  orders.forEach((order) => {
    const row = `
    <tr>
      <td>${order.id}</td>
      <td>${order.type}</td>
      <td>${order.status}</td>
    </tr>
  `;
    ordersTableBody.insertAdjacentHTML("beforeend", row);
  });
}

function updateBotsTable() {
  const botsTableBody = document.querySelector("#botsTable tbody");
  botsTableBody.innerHTML = ""; // Clear the table body before updating

  bots.forEach((bot) => {
    const row = `
<tr>
  <td>${bot.id}</td>
  <td>${bot.status}</td>
  <td>${bot.orderId || "N/A"}</td>
  <td>
    <button onclick="deleteBot(${bot.id})">-Bot</button>
  </td>
</tr>
`;
    botsTableBody.insertAdjacentHTML("beforeend", row);
  });
}

function deleteBot(botId) {
  const botIndex = bots.findIndex((bot) => bot.id === botId);
  if (botIndex === -1) return; // Bot not found

  // If the bot is processing an order, reset the order's status to PENDING
  const botToRemove = bots[botIndex];
  if (botToRemove.status === "BUSY" && botToRemove.orderId) {
    const order = orders.find((order) => order.id === botToRemove.orderId);
    if (order) {
      order.status = "PENDING"; // Reset the order's status
    }
  }

  // Remove the bot from the bots array
  bots.splice(botIndex, 1);

  // Update the table
  updateBotsTable();
  updateOrdersTable(); // In case any orders were affected
}
