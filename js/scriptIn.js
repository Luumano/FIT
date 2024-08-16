document.addEventListener('DOMContentLoaded', function() {
    loadRegistrations();
    setupCamera();
});

function loadRegistrations() {
    fetch('https://fit.rf.gd/conexao/registrados.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na rede ao carregar registros');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }

            const tbodyMatricula = document.querySelector('#registration-table tbody');
            const tbodyCpf = document.querySelector('#registration-tableAlunos tbody');

            tbodyMatricula.innerHTML = '';
            tbodyCpf.innerHTML = '';

            data.forEach(function(registration) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="${registration.confirmado ? 'confirmed' : ''}">${registration.identificador}</td>
                    <td class="${registration.confirmado ? 'confirmed' : ''}">${registration.nome}</td>
                    <td class="${registration.confirmado ? 'confirmed' : ''}">${registration.email}</td>
                    <td class="${registration.confirmado ? 'confirmed' : ''}">${registration.evento}</td>
                    <td class="${registration.confirmado ? 'confirmed' : ''}">${registration.hora || ''}</td>
                `;

                if (registration.tipo === 'matricula') {
                    tbodyMatricula.appendChild(row);
                } else if (registration.tipo === 'cpf') {
                    tbodyCpf.appendChild(row);
                }
            });
        })
        .catch(error => console.error('Erro ao carregar registros:', error));
}

function setupCamera() {
    document.getElementById('openCameraButton').addEventListener('click', function() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(function(stream) {
                let video = document.getElementById('video');
                video.srcObject = stream;
                video.style.display = 'block';
                video.play();

                const canvas = document.getElementById('canvas');
                const context = canvas.getContext('2d', { willReadFrequently: true });

                function scanQRCode() {
                    if (video.readyState === video.HAVE_ENOUGH_DATA) {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        context.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                        const code = jsQR(imageData.data, imageData.width, imageData.height);

                        if (code) {
                            console.log('Código QR lido:', code.data); // Adicione esta linha
                            confirmUser(code.data);
                            video.srcObject.getTracks().forEach(track => track.stop()); // Parar a câmera
                            video.style.display = 'none';
                        }
                    }
                    requestAnimationFrame(scanQRCode);
                }
                requestAnimationFrame(scanQRCode);
            })
            .catch(function(err) {
                console.log("Ocorreu um erro: " + err);
            });
        } else {
            console.log("A API getUserMedia não é suportada neste navegador.");
        }
    });
}

function confirmUser(data) {
    console.log('Dados do QR Code:', data); // Depuração

    // Extrair os dados do QR Code
    const fields = data.split(',').map(field => field.trim().split(': '));
    const qrData = {};
    fields.forEach(([key, value]) => {
        if (key && value) {
            qrData[key.trim().toLowerCase()] = value.trim();
        }
    });

    const qrTipo = qrData['matricula'] ? 'matricula' : 'cpf'; // Ajustado para identificar o tipo
    const qrId = qrData['matricula'] || qrData['cpf'];
    const qrNome = qrData['nome'];
    const qrEmail = qrData['email'];
    const qrHora = new Date().toLocaleString(); // Obter a data e hora atual

    console.log('Tipo do QR Code:', qrTipo); // Depuração
    console.log('ID do QR Code:', qrId); // Depuração
    console.log('Nome do QR Code:', qrNome); // Depuração
    console.log('Email do QR Code:', qrEmail); // Depuração
    console.log('Hora do QR Code:', qrHora); // Depuração

    const tableId = qrTipo === 'matricula' ? 'registration-table' : 'registration-tableAlunos';
    const userTable = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    const rows = userTable.getElementsByTagName('tr');

    let recordFound = false;

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const id = cells[0].textContent.trim();
        const nome = cells[1];
        const email = cells[2].textContent.trim();

        if (id === qrId && email === qrEmail) {
            console.log(`Registro encontrado: ${id}, ${email}`); // Depuração
            
            // Adiciona a classe 'confirmed' a todas as células
            Array.from(cells).forEach(cell => cell.classList.add('confirmed'));
            horaCell.textContent = qrHora;

            // Atualizar o registro no banco de dados
            fetch('./conexao/confirmar_presenca.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    identificador: qrId,
                    email: qrEmail,
                    hora: qrHora
                })
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    console.log(result.success);
                    showConfirmationMessage();
                    loadRegistrations(); // Recarregar a tabela para refletir a mudança
                } else {
                    console.error(result.error);
                }
            })
            .catch(error => console.error('Erro ao confirmar presença:', error));

            recordFound = true;
            break; // Sai do loop após encontrar e atualizar o registro
        }
    }

    if (!recordFound) {
        console.log('Registro não encontrado para confirmação.'); // Depuração
    }
}


function showConfirmationMessage() {
    const confirmationMessage = document.createElement('p');
    confirmationMessage.textContent = 'Presença confirmada!';
    confirmationMessage.style.color = 'green';
    document.body.appendChild(confirmationMessage);

    setTimeout(() => {
        confirmationMessage.remove();
    }, 3000);
}

document.getElementById('downloadExcel').addEventListener('click', function() {
    const data = JSON.parse(localStorage.getItem('registrations')) || [];
    const csv = data.map(row => Object.values(row).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'inscricoes.csv';
    a.click();
    window.URL.revokeObjectURL(url);
});
