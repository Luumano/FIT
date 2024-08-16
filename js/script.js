function toggleDetails(eventId) {
    let details = document.getElementById('details-' + eventId);
    if (details.style.display === 'none' || details.style.display === '') {
        details.style.display = 'block';
    } else {
        details.style.display = 'none';
    }
}

function registerUser(eventId, type) {
    let idField = document.getElementById(type + '-' + eventId);
    let nomeField = document.getElementById('nome-' + (type === 'matricula' ? eventId : 2));
    let emailField = document.getElementById('email-' + (type === 'matricula' ? eventId : 2));

    if (!idField || !nomeField || !emailField) {
        console.error('Campos de formulário não encontrados.');
        return;
    }

    let identificador = idField.value;
    let nome = nomeField.value;
    let email = emailField.value;

    let data = {
        id: identificador,
        tipo: type,
        nome: nome,
        email: email,
        evento: "Evento " + eventId
    };

    $.ajax({
        type: 'POST',
        url: 'https://fit.rf.gd/conexao/register.php',
        data: data,
        success: function(response) {
            console.log(response);
            if (response === 'success') {
                let successDiv = document.getElementById('success-' + eventId);
                successDiv.style.display = 'block';

                let qrCodeDiv = document.getElementById('qrcode-' + eventId);
                qrCodeDiv.innerHTML = "";
                let qrText = `${type.toUpperCase()}: ${identificador}, Nome: ${nome}, Email: ${email}`;
                let qr = new QRCode(qrCodeDiv, {
                    text: qrText,
                    width: 128,
                    height: 128
                });

                setTimeout(() => {
                    let canvas = qrCodeDiv.querySelector('canvas');
                    let downloadLink = document.getElementById('download-' + eventId);
                    downloadLink.href = canvas.toDataURL('image/png');
                }, 500);
            } else {
                alert("Erro ao cadastrar.");
            }
        },
        error: function() {
            alert("Erro ao enviar dados.");
        }
    });
}
