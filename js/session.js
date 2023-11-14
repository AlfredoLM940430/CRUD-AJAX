
$(document).ready(function () {
    ingresar();
});

//Ingresar
function ingresar() {

    $('#ingresar').on('click', function() {
        ingresando();
        
        $("button").attr("disabled", true);
        $.ajax({
            type: "POST",
            url: "https://lionware.dev/services/uvm/webservice/",
            async: true,
            data: {
                method: 'sistema.ingresar',
                usuario: $('#usr').val(),
                contrasena: $('#pwd').val(),
            },
            success: function (data) {

                if(data.status == 'success') {

                    console.log(data),
                    toastr.success('Bienvenido... Iniciando Sesión'),
                    localStorage.setItem('uvmuid', data.uvmuid),
                    $("button").attr("disabled", false),
                    time();

                } else {
                    toastr.warning(data.message),
                    $("button").attr("disabled", false);
                }

            },
            error: function(data){

                let x = data.responseText;
                let obj = JSON.parse(x); 
                toastr.error(obj.message);
                $("button").attr("disabled", false);
                
            }
        });
    });
}

let ingress;
function time() {
  ingress = setTimeout(locacion, 3000),
  $("button").attr("disabled", true),
  $('#ingresar').text("Ingresar");
}

function locacion() {
    window.location = 'registros.html';
}

function ingresando(){
    let x = ($('#ingresar').text());
    if(x === "Ingresar"){
        $('#ingresar').text("Ingresando");
    } else {
        $('#ingresar').text("Ingresar");
    }
}




