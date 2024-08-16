$(document).ready(function() {
    $.ajax({
        url: "https://fit.rf.gd/js/conexao/perfil_usuario.php",
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if(response.data){
              // Preencher as informações do usuário
            $('#user-name').text(response.data.name);
            $('#user-id').text(response.data.matricula || response.data.cpf);
            $('#user-course').text(response.data.curso);
            $('#email').val(response.data.email);
            $('#curso').val(response.data.curso);

            const eventsList = $('#events-list');
            response.events.forEach(event => {
                    const listItem = `
                    <li>
                    <span>${event.nome}</span>
                    <div class="qrcode>
                        <img src="${event.qrcode}" alt="QR Code ${event.nome}">
                        <a href="${event.qrcode}" download="qrcode_${event.nome}.png">Baixar QR Code</a> 
                    </div>
                    </li>`;
                    eventsList.append(listItem);
                });
            } else {
                alert("Erro ao carregar dados do usuário.");
            }
        },
        error: function() {
            alert("Erro ao buscar os dados do usuário.");
        }
    });    
});