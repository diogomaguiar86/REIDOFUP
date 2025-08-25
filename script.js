const ticketForm = document.getElementById('ticketForm');
const ticketsTableBody = document.querySelector('#ticketsTable tbody');
const searchInput = document.getElementById('search');

let tickets = [];

// Carrega os tickets salvos ao carregar a página
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
  saveTickets();
  ticketForm.reset();
  renderTable();
});

searchInput.addEventListener('input', renderTable);

function renderTable() {
  const term = searchInput.value.toLowerCase();
  ticketsTableBody.innerHTML = '';

  // Ordena por data e hora
  tickets.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

  tickets.forEach((t, index) => {
    if (Object.values(t).some(val => val.toLowerCase().includes(term))) {
      const displayDate = formatDateTime(t.datetime);
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${displayDate}</td>
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
  saveTickets();
  renderTable();
};

function formatDateTime(datetimeStr) {
  const date = new Date(datetimeStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month} ${hours}:${minutes}`;
}


window.deleteTicket = function(index) {
  tickets.splice(index, 1);
  saveTickets();
  renderTable();
};
