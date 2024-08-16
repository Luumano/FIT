function generateQRCode() {
    let matricula = document.getElementById('search-matricula').value;
    let nome = document.getElementById('search-nome').value;

    let userTable = document.getElementById('registration-table').getElementsByTagName('tbody')[0];
    let rows = userTable.getElementsByTagName('tr');

    var registration = null;

    for (let i = 0; i < rows.length; i++) {
        let cells = rows[i].getElementsByTagName('td');
        let tableMatricula = cells[0].textContent;
        let tableNome = cells[1].textContent;
        let tableEmail = cells[2].textContent;

        if (tableMatricula === matricula && tableNome === nome) {
            registration = {
                matricula: tableMatricula,
                nome: tableNome,
                email: tableEmail
            };
            break;
        }
    }

    if (registration) {
        let qrData = `Matrícula: ${registration.matricula}, Nome: ${registration.nome}, Email: ${registration.email}`;
        let qrCodeContainer = document.getElementById('qrcode');
        qrCodeContainer.innerHTML = "";
        let qrCode = new QRCode(qrCodeContainer, {
            text: qrData,
            width: 128,
            height: 128
        });

        let downloadButton = document.getElementById('download-qrcode');
        let canvas = qrCodeContainer.querySelector('canvas');
        downloadButton.href = canvas.toDataURL();

        document.getElementById('qrcode-container').style.display = 'block';
    } else {
        alert('Usuário não encontrado.');
    }
}
