document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('search-form').addEventListener('submit', function(event) {
        event.preventDefault();
        generateQRCode();
    });
});

function generateQRCode() {
        let matricula = document.getElementById('search-matricula').value;
        let nome = document.getElementById('search-nome').value;
    
    // Valida se os campos não estão vazios
    if (!matricula && !nome) {
        alert('Por favor, preencha ao menos um campo.');
        return;
    }

    let url = 'recuperar_qrcode.php';
    let data = {
        matricula: matricula,
        cpf: nome
    };

    $.ajax({
        url: url,
        type: 'GET',
        data: data,
        dataType: 'json',
        success: function(response) {
            var container = $('#qrcode-container');
            var qrcodeDiv = $('#qrcode');
            var downloadLink = $('#download-qrcode');

            if (response.success) {
                qrcodeDiv.html('<img src="' + response.qrcode + '" alt="QR Code">');
                downloadLink.attr('href', response.qrcode);
                container.show();
            } else {
                alert(response.message);
                container.hide();
            }
        },
        error: function(xhr, status, error) {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao recuperar o QR Code.');
        }
    });
}