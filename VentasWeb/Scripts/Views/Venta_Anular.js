
var tabladata;



$(document).ready(function () {

    $.datepicker.regional['es'] = {
        closeText: 'Cerrar',
        prevText: '< Ant',
        nextText: 'Sig >',
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['es']);


    $("#txtFechaInicio").datepicker();
    $("#txtFechaFin").datepicker();
    $("#txtFechaInicio").val(ObtenerFecha());
    $("#txtFechaFin").val(ObtenerFecha());


    tabladata = $('#tbVentas').DataTable({
        "ajax": {
            "url": $.MisUrls.url._ObtenerVentas + "?codigo=&fechainicio=" + ObtenerFecha() + "&fechafin=" + ObtenerFecha() + "&numerodocumento=&nombres=",
            "type": "GET",
            "datatype": "json"
        },
        "columns": [

            
            {
                "data": "IdVenta", render: function (data) {
                    return "<button class='btn btn-danger btn-sm ml-2' type='button' onclick='Anular(" + data + ")'><i class='fas fa-ban'></i>Anular</button> <button class='btn btn-success btn-sm ml-2' type='button' onclick='Imprimir(" + data + ")'><i class='far fa-clipboard'></i> Ver</button>"
                }
            },

             
            { "data": "TipoDocumento" },
            { "data": "Codigo" },
            { "data": "FechaRegistro" },
             
            {
                "data": "oCliente", render: function (data) {
                    return data.NumeroDocumento
                }
            },
            {
                "data": "oCliente", render: function (data) {
                    return data.Nombre
                }
            },
             {
                 "data": "oUsuario", render: function (data) {
                     return data.NombreUsuario
                 }
             },
            {
                "data": "TotalCosto", render: function (data) {

                    return "C$./ " + (data).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                }
            },
              
             {
                 "data": "Activo", "render": function (data) {
                     if (data) {
                         return '<span class="badge badge-success">Activo</span>'
                     } else {
                         return '<span class="badge badge-danger">No Activo</span>'
                     }
                 }
             },
             {
                 "data": "oTienda", render: function (data) {

                     return data.Nombre
                 }
             },
              
        ],
        "language": {
            "url": $.MisUrls.url.Url_datatable_spanish
        },
        responsive: true
    });

    


});

function Anular($id) {


    swal({
        title: "Mensaje",
        text: "¿Desea anular el documento seleccionado?",
        type: "warning",
        showCancelButton: true,

        confirmButtonText: "Si",
        confirmButtonColor: "#DD6B55",

        cancelButtonText: "No",

        closeOnConfirm: true
    },

        function () {
            jQuery.ajax({
                url: $.MisUrls.url._AnularVentas + "?id=" + $id,
                type: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {

                    if (data.resultado) {
                        tabladata.ajax.reload();
                    } else {
                        swal("Mensaje", "No se pudo anular el documento", "warning")
                    }
                },
                error: function (error) {
                    console.log(error)
                },
                beforeSend: function () {

                },
            });
        });

}


function buscar() {

    if ($("#txtFechaInicio").val().trim() == "" || $("#txtFechaFin").val().trim() == "") {
        swal("Mensaje", "Debe ingresar fechas", "warning")
        return;
    }

    tabladata.ajax.url($.MisUrls.url._ObtenerVentas + "?" +
        "codigo=" + $("#txtCodigoVenta").val().trim() +
        "&fechainicio=" + $("#txtFechaInicio").val().trim() +
        "&fechafin=" + $("#txtFechaFin").val().trim() +
        "&numerodocumento=" + $("#txtDocumentoCliente").val() +
        "&nombres=" + $("#txtNombreCliente").val()).load();
}

function ObtenerFecha() {

    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = (('' + day).length < 2 ? '0' : '') + day + '/' + (('' + month).length < 2 ? '0' : '') + month + '/' + d.getFullYear();

    return output;
}


function Imprimir(id) {

    var url = $.MisUrls.url._DocumentoVenta + "?IdVenta=" + id;
    window.open(url);

}

       

