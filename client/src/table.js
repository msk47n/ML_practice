let orderNumber = 1;
let grandTotal = 0;
let sortState = {};

function addRow() {
    const storeName = document.getElementById('store-name').value.trim();
    const purchaseDate = document.getElementById('purchase-date').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const finalPrice = parseFloat(document.getElementById('final-price').value) || 0.00;

    if (!storeName || !purchaseDate || !paymentMethod || isNaN(finalPrice)) {
        alert("Please fill out all fields correctly.");
        return;
    }

    const tableBody = document.getElementById('order-body');
    const row = tableBody.insertRow();

    row.insertCell(0).textContent = orderNumber++;
    row.insertCell(1).textContent = storeName;
    row.insertCell(2).textContent = purchaseDate;
    
    // Image Cell
    const tempImage = localStorage.getItem("tempImage");
    const imageCell = row.insertCell(3);
    if (tempImage) {
        const rowId = orderNumber - 1;

        // Creating thumbnail image
        const img = document.createElement("img");
        img.src = tempImage;
        img.alt = "Receipt";
        img.style.width = "60px";
        img.style.height = "auto";
        img.style.borderRadius = "4px";
        img.style.boxShadow = "0 0 3px rgba(0,0,0,0.2)";

        // Preview in pop-up on-click
        img.onclick = () => {
            const preview = window.open("", "_blank");
            preview.document.write(`<img src="${tempImage}" style="max-width:100%;">`);
        }

        // Wrap image in link that also opens in new tab
        const link = document.createElement("a");
        link.href = tempImage;
        link.target = "_blank";
        link.appendChild(img);
        imageCell.appendChild(link);

        // Save image to localstorage array
        const imageList = JSON.parse(localStorage.getItem("savedImages") || "[]");
        imageList.push({ id: orderNumber - 1, image: tempImage });
        localStorage.setItem("savedImages", JSON.stringify(imageList));

        localStorage.removeItem("tempImage");
        const targetImage = document.getElementById("target");
        if (targetImage) targetImage.src = "";
    } else {
        imageCell.textContent = "N/A";
    }

    row.insertCell(4).textContent = paymentMethod;
    row.insertCell(5).textContent = `$${finalPrice.toFixed(2)}`;

    // Add Edit & Delete buttons
    const actionCell = row.insertCell(6);
    actionCell.innerHTML = `
        <div class="action-buttons">
            <button onclick="editRow(this)" class="btn btn-sm btn-warning">Edit</button>
            <button onclick="deleteRow(this)" class="btn btn-sm btn-danger">Delete</button>
        </div>
    `;

    clearForm();
}

function deleteRow(button) {
    const row = button.closest('tr');
    const rowIndex = row.rowIndex - 1; // table header accounting
    const tableBody = document.getElementById("order-body");

    // get order number (in first cell)
    const rowId = parseInt(row.cells[0].textContent);

    // Remove from savedImages
    let imageList = JSON.parse(localStorage.getItem("savedImages") || "[]");
    imageList = imageList.filter(item => item.id !== rowId);
    localStorage.setItem("savedImages", JSON.stringify(imageList));

    // remove row
    tableBody.deleteRow(rowIndex);
    row.remove();

    updateOrderNumber();
}

function editRow(button) {
    const row = button.closest('tr');
    const cells = row.cells;

    document.getElementById('store-name').value = cells[1].textContent;
    document.getElementById('purchase-date').value = cells[2].textContent;
    document.getElementById('payment-method').value = cells[3].textContent;
    document.getElementById('final-price').value = cells[4].textContent.replace("$", '');

    row.remove();
}

function clearForm() {
    document.getElementById('store-name').value = '';
    document.getElementById('purchase-date').value = '';
    document.getElementById('payment-method').value = '';
    document.getElementById('final-price').value = '';
}

function sortTable(colIndex) {
    const table = document.getElementById("order-table");
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows);

    // Determine sort direction
    const isAscending = sortState[colIndex] = !sortState[colIndex];

    rows.sort((a, b) => {
        let valA = a.cells[colIndex].textContent.trim();
        let valB = b.cells[colIndex].textContent.trim();

        // Try to parse numbers (like Final Price)
        const numA = parseFloat(valA.replace(/[^0-9.-]+/g, ""));
        const numB = parseFloat(valB.replace(/[^0-9.-]+/g, ""));

        // Compare numbers if valid
        if (!isNaN(numA) && !isNaN(numB)) {
            return isAscending ? numA - numB : numB - numA;
        }

        // Handle dates
        const dateA = Date.parse(valA);
        const dateB = Date.parse(valB);
        if (!isNaN(dateA) && !isNaN(dateB)) {
            return isAscending ? dateA - dateB : dateB - dateA;
        }

        // Fallback to string comparison
        return isAscending
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
    });

    // Reattach sorted rows
    rows.forEach(row => tbody.appendChild(row));

    // Recalculate order numbers in column 0
    updateOrderNumbers();
}


function updateOrderNumber() {
    // order number error update
    const tableBody = document.getElementById('order-body');
    const rows = tableBody.rows;

    for(let i = 0; i < rows.length; i++) {
        rows[i].cells[0].textContent = i + 1;
    }

    orderNumber = rows.length + 1;
}