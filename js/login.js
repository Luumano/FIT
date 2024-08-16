function userLogin() {
    let identificador = document.getElementById('user-identificador').value;
    let password = document.getElementById('user-password').value;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://fit.rf.gd/conexao/usuarioLogin.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                alert(xhr.responseText);
                if (xhr.responseText.includes("bem-sucedido")) {
                    window.location.href = 'principal.html';
                }
            } else {
                alert("Erro ao fazer login.");
            }
        }
    };
    xhr.send("identificador=" + encodeURIComponent(identificador) + "&password=" + encodeURIComponent(password));
}

function adminLogin() {
    let password = document.getElementById('admin-password').value;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://fit.rf.gd/conexao/loginstaff.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                alert(xhr.responseText);
                if (xhr.responseText.includes("bem-sucedido")){
                    window.location.href = "inscritos.html";
                }
            } else {
                alert("Erro ao fazer login.");
            }
        }
    };
    xhr.send("password=" + encodeURIComponent(password));
}
