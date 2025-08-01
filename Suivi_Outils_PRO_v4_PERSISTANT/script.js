
let adminMode = false;
let tableauData = [];

window.onload = () => {
    const outilSelect = document.getElementById("outil");
    outils.forEach(o => {
        const opt = document.createElement("option");
        opt.value = o.code;
        opt.textContent = `${o.nom} (${o.code})`;
        outilSelect.appendChild(opt);
    });
    chargerSauvegarde();
};

function sauvegarder() {
    const lignes = Array.from(document.querySelectorAll("tbody tr")).map(row => {
        return {
            user: row.cells[0].textContent,
            outil: row.cells[1].textContent,
            code: row.cells[2].textContent,
            dateEmprunt: row.cells[3].textContent,
            heureEmprunt: row.cells[4].textContent,
            etatAvant: row.cells[5].textContent,
            validePar: row.cells[6].textContent,
            dateRetour: row.cells[7].textContent,
            heureRetour: row.cells[8].textContent,
            etatApres: row.cells[9].textContent,
            status: row.cells[10].textContent
        };
    });
    localStorage.setItem("suivi_outils", JSON.stringify(lignes));
}

function chargerSauvegarde() {
    const saved = localStorage.getItem("suivi_outils");
    if (!saved) return;
    const data = JSON.parse(saved);
    const tbody = document.querySelector("tbody");
    data.forEach(item => {
        const tr = document.createElement("tr");
        tr.classList.add(item.status === "Rendu" ? "valid" : "pending");
        tr.innerHTML = `
            <td>${item.user}</td><td>${item.outil}</td><td>${item.code}</td>
            <td>${item.dateEmprunt}</td><td>${item.heureEmprunt}</td>
            <td>${item.etatAvant}</td><td>${item.validePar}</td>
            <td>${item.dateRetour}</td><td>${item.heureRetour}</td><td>${item.etatApres}</td>
            <td>${item.status}</td>
            <td>
                <button onclick="rendre(this)">Rendre</button>
                <button onclick="supprimer(this)" style="display:none;">Supprimer</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function emprunter() {
    const user = document.getElementById("user").value.trim();
    const outilSelect = document.getElementById("outil");
    const code = outilSelect.value;
    const outilNom = outilSelect.options[outilSelect.selectedIndex].text.split(" (")[0];
    const date = new Date();
    const etatAvant = prompt("État AVANT utilisation (ex: Bon, Rayé, Neuf)");
    const validePar = prompt("Validé par :");
    const tbody = document.querySelector("tbody");
    const tr = document.createElement("tr");
    tr.classList.add("pending");
    tr.innerHTML = `
        <td>${user}</td><td>${outilNom}</td><td>${code}</td>
        <td>${date.toLocaleDateString()}</td><td>${date.toLocaleTimeString()}</td>
        <td>${etatAvant}</td><td>${validePar}</td>
        <td></td><td></td><td></td><td>Non rendu</td>
        <td>
            <button onclick="rendre(this)">Rendre</button>
            <button onclick="supprimer(this)" style="display:none;">Supprimer</button>
        </td>
    `;
    tbody.appendChild(tr);
    sauvegarder();
}

function rendre(btn) {
    const row = btn.closest("tr");
    const now = new Date();
    const etatApres = prompt("État APRÈS utilisation ?");
    row.cells[7].textContent = now.toLocaleDateString();
    row.cells[8].textContent = now.toLocaleTimeString();
    row.cells[9].textContent = etatApres;
    row.cells[10].textContent = "Rendu";
    row.classList.remove("pending");
    row.classList.add("valid");
    sauvegarder();
}

function supprimer(btn) {
    const row = btn.closest("tr");
    row.remove();
    sauvegarder();
}

function toggleAdmin() {
    adminMode = !adminMode;
    document.querySelectorAll("tr").forEach(row => {
        const delBtn = row.querySelector("button:nth-child(2)");
        if (delBtn) delBtn.style.display = adminMode ? "inline-block" : "none";
    });
}
