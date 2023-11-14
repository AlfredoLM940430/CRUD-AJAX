
$(document).ready(function () {

    salir();
    leer();
    guardar();
    editar();

});

//Salir
function salir() {

    $('#salir').on('click', function() {
        $.ajax({
            type: "POST",
            url: "https://lionware.dev/services/uvm/webservice/",
            data: {
                method: 'sistema.salir',
                uvmuid: localStorage.getItem('uvmuid'),
            },

            success: function (data) {
                if (data.status == 'success') {    
                    toastr.success(data.message),
                    time();
                } else {
                    toastr.danger(data.message);
                }
            },
            error: function (data){
                let x = data.responseText;
                let obj = JSON.parse(x); 
                toastr.error("Error al salir, " + obj.message);
            }
        });
    });
}

let saliendo;
function time() {
  saliendo = setTimeout(locacion, 3000);
}

function locacion() {
    window.location = 'index.html';
}

//Leer
var tabla = $("#tbl");
function leer() {
    $.ajax({
        type: "POST",
        url: "https://lionware.dev/services/uvm/webservice/",
        async: true,
        data: {
            method: 'sistema.registros.leer',
            uvmuid: localStorage.getItem('uvmuid'),  
        },
        success: function (data) {
            listado(data);
        },
        error: function(data) {
            console.log(data.responseJSON.message);
        }
    });
}

function listado(items) {
    $.each(items, function (index, item) {
        filaTBL(item);
    });
}

function filaTBL(item) {
    $("#tbl").append(ContTBL(item));
}

function ContTBL(usr) {
    var ciclo =`          
            <tr>
                <td class="align-middle" id="nombre"> ${usr.nombre}</td> 
                <td class="align-middle" id="edad"> ${usr.edad}</td>

                <td>
                    <div">
                        <button class="btn" data-toggle="modal" title="Editar" data-target="#modelId" data-id="${usr.id} ${usr.nombre} ${usr.edad}" onclick="usrEDT(this)" id="editar">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-edit" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ff9300" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                            <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                            <line x1="16" y1="5" x2="19" y2="8" />
                            </svg>
                        </button>
                        
                        <button class="btn" data-toggle="modal" title="Eliminar" data-target="#dlete" data-id="${usr.id}" onclick="usrDLT(this)" id="eliminar">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-x" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ff2825" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                            <path d="M10 12l4 4m0 -4l-4 4" />
                            </svg>
                        </button>
                    </div>
                </td>

            </tr>
            `;
    return ciclo;   
}

//Agregar
function guardar() {

    $('#guardar').click(function () {
        
        $("button").prop("disabled", true),
        $('#guardar').html('Guardando');

        let nmbre = $('#nmbre').val();
        let edd = $('#edd').val();
        
        $.ajax({
            type: "POST",
            url: "https://lionware.dev/services/uvm/webservice/",
            async: true,
            data: {
                method: 'sistema.registros.alta',
                uvmuid: localStorage.getItem('uvmuid'),
                nombre: nmbre,
                edad: edd,
            },
            success: function (data) {

                toastr.success(data.message),
                $("button").prop("disabled", false),
                NuevoUSR = new Object(),
                NuevoUSR.id = data.record,
                NuevoUSR.nombre = nmbre,
                NuevoUSR.edad = edd,
                agregarScss(NuevoUSR),
                $('#svv').modal('hide'),
                $('#guardar').html('Guardar');
            },
            error: function(data) {
                $("button").prop("disabled", false),
                $('#guardar').html('Guardar'),
                toastr.warning(data.responseJSON.message);
            }
        });    
    });
}

function agregarScss(data) {

    filaTBL(data);
    Reset();
}

//Eliminar
let obj = {};
function usrDLT(idr) {
    
    let id = $(idr).data("id");
    $("#almacenarid").val(id);
    obj = idr;
}

$('#dlte').click(function () {
    $("button").attr("disabled", true);
    $('#dlte').html('Eliminando');
    let x = $("#almacenarid").val();

    $.ajax({
        type: "POST",
        url: "https://lionware.dev/services/uvm/webservice/",
        async: true,
        data: {
            method: 'sistema.registros.eliminar',
            uvmuid: localStorage.getItem('uvmuid'),
            id: x,
        },
        success: function (data) {
            toastr.success(data.message),
            $(obj).parents("tr").remove(),
            $("button").attr("disabled", false),
            $('#dlete').modal('hide'),
            $('#dlte').html('Eliminar');
        },
        error: function (data) {
            toastr.success(data.responseJSON.message),
            $("button").attr("disabled", false),
            $('#dlte').html('Eliminar');
        },
    });
});

function usrEDT(idr) {

    let usr = $(idr).data('id');
    let ine = usr.split(" ");

    $("#almacenarid").val(ine[0]);
    $('#nb').val(ine[1]);
    $('#ed').val(ine[2]);
}

function editar() {

    $('#actz').click(function () {

        $("button").attr("disabled", true);
        $('#actz').html('Actualizando');
        let x = $("#almacenarid").val();
    
        let name = $('#nb').val();
        let edad = $('#ed').val();
    
        $('#mid').html('ID: ' + '<span class="ssid">' + x + '</span>');
    
        ActUSR = new Object(),
        ActUSR.id = x;
        ActUSR.nombre = name;
        ActUSR.edad = edad;
    
        $.ajax({
            type: "POST",
            url: "https://lionware.dev/services/uvm/webservice/",
            data: {
                method: 'sistema.registros.actualizar',
                uvmuid: localStorage.getItem('uvmuid'),
                id: x,
                nombre: name,
                edad: edad,
            },
            success: function (data) {
                $("button").attr("disabled", false),
                toastr.success(data.message),
                EditarScss(ActUSR),
                $('#modelId').modal('hide'),
                $('#actz').html('Actualizar');

            },
            error: function (data) {
                $("button").attr("disabled", false),
                $('#actz').html('Actualizar'),
                toastr.warning(data.responseJSON.message);
            },
        });
    });
}

function EditarScss(data) {
    EdtTable(data);
    Reset();
}

function EdtTable(usr) {

    let fila = $("#tbl button[data-id='" + usr.id + "']").parents("tr")[0];
    $(fila).after(ContTBL(usr) );
    $(fila).remove();
    Reset();
}

// Limpiar
$('#cln').click(function () {
    Reset();
});

function Reset() {

    $('#nb').val("");
    $('#ed').val("");
    $("#almacenarid").val("");
    $('#nmbre').val("");
    $('#edd').val("");
}