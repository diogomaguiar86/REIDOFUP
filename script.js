const ticketForm = document.getElementById('ticketForm');
const ticketsTableBody = document.querySelector('#ticketsTable tbody');
const searchInput = document.getElementById('search');

let tickets = [];

// 1⃣ Carrega tickets salvos assim que a página carregar
window.addEventListener('load', () => {
  const saved = localStorage.getItem('reiDoFupTickets');
  tickets = saved ? JSON.parse(saved) : [];
  renderTable();
});

ticketForm.addEventListener('submit', e => {
  e.preventDefault();
  const ticket = {
    datetime: document.getElementById('datetime').value,
    ticketNumber: document.getElementById('ticketNumber').value,
    status: document.getElementById('status').value,
    cliente: document.getElementById('cliente').value,
    observacao: document.getElementById('observacao').value
  };
  tickets.push(ticket);
  saveTickets(); // 2⃣ Salva no localStorage
  ticketForm.reset();
  renderTable();
});

searchInput.addEventListener('input', renderTable);

function renderTable() {
  const term = searchInput.value.toLowerCase();
  ticketsTableBody.innerHTML = '';

  tickets.forEach((t, index) => {
    if (Object.values(t).some(val => val.toLowerCase().includes(term))) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${t.datetime}</td>
        <td>${t.ticketNumber}</td>
        <td>${t.status}</td>
        <td>${t.cliente}</td>
        <td>${t.observacao}</td>
        <td>
          <button class="action-btn edit-btn" onclick="editTicket(${index})">Editar</button>
          <button class="action-btn delete-btn" onclick="deleteTicket(${index})">Excluir</button>
        </td>
      `;
      ticketsTableBody.appendChild(row);
    }
  });
}

function saveTickets() {
  localStorage.setItem('reiDoFupTickets', JSON.stringify(tickets));
}

window.editTicket = function(index) {
  const t = tickets[index];
  document.getElementById('datetime').value = t.datetime;
  document.getElementById('ticketNumber').value = t.ticketNumber;
  document.getElementById('status').value = t.status;
  document.getElementById('cliente').value = t.cliente;
  document.getElementById('observacao').value = t.observacao;

  tickets.splice(index, 1);
  saveTickets(); // 2⃣ Atualiza no localStorage
  renderTable();
};

window.deleteTicket = function(index) {
  tickets.splice(index, 1);
  saveTickets(); // 2⃣ Atualiza no localStorage
  renderTable();
};
