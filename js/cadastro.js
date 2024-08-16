document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const identificadorInput = document.getElementById('identificador');
    const tipoIdentificadorInput = document.getElementById('tipo_identificador');
    const identificador = identificadorInput.value.trim();

    //Define se é CPF ou Matrícula baseado na quantidade de caracteres
    if (/^\d{11}$/.test(identificador)){
        tipoIdentificadorInput.value = 'cpf';
    } else {
        tipoIdentificadorInput.value = 'matricula';
    }

    console.log('Identificador:', identificador);
    console.log('Tipo Identificador:', tipoIdentificadorInput.value);

    // Adicionar aqui a lógica de envio do formulário (AJAX, fetch, etc.)
    $.ajax({
        url: 'https://fit.rf.gd/js/conexao/cadastro.php',
        type: 'POST',
        data: new FormData(event.target),
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                $('#successMessage').show();
                setTimeout(function() {
                    $('#successMessage').hide();
                    window.location.href = 'index.html';
                }, 3000);
            } else {
                alert('Erro ao realizar cadastro: ' + data.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Erro:', error);
        }
    });
});