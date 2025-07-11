let orderNumber = 1;
let grandTotal = 0;
let sortState = {};

// testing updating
window.addEventListener('DOMContentLoaded', updateTotalSum);

// Loading any information stored on the localstorage
window.onload = function() {
    const tempData = JSON.parse(localStorage.getItem('tempFormData'));
    if (tempData) {
        document.getElementById('store-name').value = tempData.storeName || '';
        document.getElementById('purchase-date').value = tempData.purchaseDate || '';
        document.getElementById('payment-method').value = tempData.paymentMethod || '';
        document.getElementById('comments').value = tempData.comments || '';
        document.getElementById('final-price').value = tempData.finalPrice || '';

        if (tempData.tempImage) {
            localStorage.setItem('tempImage', tempData.tempImage); // ensure compatibility with existing addRow logic
            const targetImage = document.getElementById('target');
            if (targetImage) {
                targetImage.src = tempData.tempImage;
            }
        }
    }
};


function addRow() {
    const storeName = document.getElementById('store-name').value.trim();
    const purchaseDate = document.getElementById('purchase-date').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const finalPrice = parseFloat(document.getElementById('final-price').value) || 0.00;
    const comments = document.getElementById('comments').value.trim();

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
    row.insertCell(5).textContent = comments
    row.insertCell(6).textContent = `$${finalPrice.toFixed(2)}`;

    // Add Edit & Delete buttons
    const actionCell = row.insertCell(7);
    actionCell.innerHTML = `
        <div class="action-buttons">
            <button onclick="editRow(this)" class="btn btn-sm btn-warning">Edit</button>
            <button onclick="deleteRow(this)" class="btn btn-sm btn-danger">Delete</button>
        </div>
    `;

    clearForm();
    updateTotalSum();
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
    updateTotalSum();
}

function editRow(button) {
    const row = button.closest('tr');
    const cells = row.cells;

    document.getElementById('store-name').value = cells[1].textContent;
    document.getElementById('purchase-date').value = cells[2].textContent;
    
    const imgElement = cells[3].querySelector('img');
    if (imgElement) {
        const imageSrc = imgElement.src;
        localStorage.setItem('tempImage', imageSrc);
        const targetImage = document.getElementById('src');
        if (targetImage) {
            targetImage.src = imageSrc;
        }
    } else {
        localStorage.removeItem('tempIamge');
    }

    document.getElementById('payment-method').value = cells[4].textContent;
    document.getElementById('comments').value = cells[5].textContent;
    document.getElementById('final-price').value = cells[6].textContent.replace("$", '');

    row.remove();
    storeTempFormData();
}

function clearForm() {
    document.getElementById('store-name').value = '';
    document.getElementById('purchase-date').value = '';
    document.getElementById('src').value = ''; // image capture removal
    document.getElementById('payment-method').value = '';
    document.getElementById('comments').value = '';
    document.getElementById('final-price').value = '';

    localStorage.removeItem('tempFormData');
    localStorage.removeItem('tempImage');
}

function storeTempFormData() {
    const storeName = document.getElementById('store-name').value.trim();
    const purchaseDate = document.getElementById('purchase-date').value;
    const tempImage = localStorage.getItem('tempImage') || null;
    const paymentMethod = document.getElementById('payment-method').value;
    const comments = document.getElementById('comments').value.trim();
    const finalPrice = document.getElementById('final-price').value;

    const tempData = {
        storeName, purchaseDate, tempImage, paymentMethod, finalPrice
    }

    localStorage.setItem('tempFormData', JSON.stringify(tempData));
}

// sort table - not called
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

// --------------------------------------------- //

async function exportTableAsZip() {
    const zip = new JSZip();
    const data = [];
    const table = document.getElementById('order-body');
    
    if (!table) {
        alert("Table not found");
        return;
    }

    const rows = table.rows;

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].cells;

        const img = cells[3].querySelector('img');
        let imageName = null;

        if (img && img.src.startsWith('data:image')) {
            const base64 = img.src.split(',')[1];
            imageName = `image_${i}.png`;
            zip.file(imageName, base64, {base64: true});
        }

        data.push({
            order: cells[0].textContent,
            storeName: cells[1].textContent,
            purchaseDate: cells[2].textContent,
            image: imageName,
            paymentMethod: cells[4].textContent,
            comments: cells[5].textContent,
            finalPrice: cells[6].textContent
        });
    }

    zip.file("data.json", JSON.stringify(data, null, 2))

    const blob = await zip.generateAsync({type: "blob"});
    saveAs(blob, "exported_data.zip");
}

function importZipFile(file) {
    const zip = new JSZip();

    zip.loadAsync(file).then(async (contents) => {
        const dataFile = await contents.file("data.json").async("string");
        const data = JSON.parse(dataFile);

        const images = {};
        for (const filename in contents.files) {
            if (filename.endsWith(".png") || filename.endsWith(".jpg")) {
                const base64 = await contents.file(filename).async("base64");
                images[filename] = "data:image/png;base64," + base64;
            }
        }

        // Clear existing table
        document.getElementById('order-body').innerHTML = '';
        orderNumber = 1;

        for (const rowData of data) {
            const tableBody = document.getElementById('order-body');
            const row = tableBody.insertRow();

            row.insertCell(0).textContent = orderNumber++;
            row.insertCell(1).textContent = rowData.storeName;
            row.insertCell(2).textContent = rowData.purchaseDate;

            const imageCell = row.insertCell(3);
            if (rowData.image && images[rowData.image]) {
                const img = document.createElement("img");
                img.src = images[rowData.image];
                img.alt = "Receipt";
                img.style.width = "60px";
                img.style.borderRadius = "4px";
                img.style.boxShadow = "0 0 3px rgba(0,0,0,0.2)";

                img.onclick = () => {
                    const preview = window.open("", "_blank");
                    preview.document.write(`<img src="${img.src}" style="max-width:100%;">`);
                };

                const link = document.createElement("a");
                link.href = img.src;
                link.target = "_blank";
                link.appendChild(img);
                imageCell.appendChild(link);
            } else {
                imageCell.textContent = "N/A";
            }

            row.insertCell(4).textContent = rowData.paymentMethod;
            row.insertCell(5).textContent = rowData.comments;
            row.insertCell(6).textContent = rowData.finalPrice;

            const actionCell = row.insertCell(7);
            actionCell.innerHTML = `
                <div class="action-buttons">
                    <button onclick="editRow(this)" class="btn btn-sm btn-warning">Edit</button>
                    <button onclick="deleteRow(this)" class="btn btn-sm btn-danger">Delete</button>
                </div>
            `;
        }
    });

    updateTotalSum();
}

function updateTotalSum() {
    const totalDisplay = document.getElementById('total-display');
    const tableBody = document.getElementById('order-body');
    let total = 0;

    if (!tableBody || !totalDisplay) {
        console.error("Missing table body or total display element.");
        return;
    }

    const rows = tableBody.rows;
    for (let i = 0; i < rows.length; i++) {
        const priceCell = rows[i].cells[5]; // Final price column
        if (priceCell) {
            const value = parseFloat(priceCell.textContent.replace('$', '').trim());
            if (!isNaN(value)) {
                total += value;
            }
        }
    }

    totalDisplay.textContent = `Grand Total: $${total.toFixed(2)}`;
}