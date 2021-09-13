﻿
var tabladata;
$(document).ready(function () {
    activarMenu("Clientes");


    ////validamos el formulario
    $("#form").validate({
        rules: {
            numerodocumento: "required",
            nombres: "required",
            direccion: "required",
            telefono: "required"
        },
        messages: {
            numerodocumento: "(*)",
            nombres: "(*)",
            direccion: "(*)",
            telefono: "(*)"
        },
        errorElement: 'span'
    });



    tabladata = $('#tbdata').DataTable({
        "aProcessing": true,//activamos el procedimiento del datatable
        dom: 'Bfrtip',//definimos los elementos del control de la tabla
        buttons: [
                 $.extend(true, {}, buttonCommon, {
                     extend: 'excelHtml5',
                     className: 'btn btn-option',
                     text: '<i class="fa fa-table marginExcel"></i><br> Exportar',

                 })
        ],
        "ajax": {
            "url": $.MisUrls.url.ObtenerClientes,
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            { "data": "TipoDocumento" },
            { "data": "NumeroDocumento" },
            { "data": "Nombre" },
            { "data": "Direccion" },
            { "data": "Telefono" },
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
                "data": "IdCliente", "render": function (data, type, row, meta) {
                    return "<button class='btn btn-primary btn-sm' type='button' onclick='abrirPopUpForm(" + JSON.stringify(row) + ")'><i class='fas fa-pen'></i></button>" +
                        "<button class='btn btn-danger btn-sm ml-2' type='button' onclick='eliminar(" + data + ")'><i class='fa fa-cancel'></i></button>"
                },

                "orderable": false,
                "searchable": false,
                "width": "90px"
            }


        ],
        "language": {
            "url": $.MisUrls.url.Url_datatable_spanish
        },
        responsive: true
    });


})


function abrirPopUpForm(json) {

    $("#txtid").val(0);

    if (json != null) {

        $("#txtid").val(json.IdCliente);


        $("#cboclientetipodocumento").val(json.TipoDocumento);
        $("#txtNumeroDocumento").val(json.NumeroDocumento);
        $("#txtNombres").val(json.Nombre);
        $("#txtDireccion").val(json.Direccion);
        $("#txtTelefono").val(json.Telefono);
        $("#cboEstado").val(json.Activo == true ? 1 : 0);

    } else {
        $("#cboclientetipodocumento").val($("#cboclientetipodocumento option:first").val());
        $("#txtNumeroDocumento").val("");
        $("#txtNombres").val("");
        $("#txtDireccion").val("");
        $("#txtTelefono").val("");
        $("#cboEstado").val(1);

    }

    $('#FormModal').modal('show');

}


function Guardar() {

    if ($("#form").valid()) {

        var request = {
            objeto: {
                IdCliente: $("#txtid").val(),
                TipoDocumento: $("#cboclientetipodocumento").val(),
                NumeroDocumento: $("#txtNumeroDocumento").val(),
                Nombre: $("#txtNombres").val(),
                Direccion: $("#txtDireccion").val(),
                Telefono: $("#txtTelefono").val(),
                Activo: parseInt($("#cboEstado").val()) == 1 ? true : false
            }
        }

        jQuery.ajax({
            url: $.MisUrls.url._GuardarCliente,
            type: "POST",
            data: JSON.stringify(request),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {

                if (data.resultado) {
                    tabladata.ajax.reload();
                    $('#FormModal').modal('hide');
                } else {

                    swal("Mensaje", "No se pudo guardar los cambios", "warning")
                }
            },
            error: function (error) {
                console.log(error)
            },
            beforeSend: function () {

            },
        });

    }

}


function eliminar($id) {


    swal({
        title: "Mensaje",
        text: "¿Desea Desactivar el cliente seleccionado?",
        type: "warning",
        showCancelButton: true,

        confirmButtonText: "Si",
        confirmButtonColor: "#DD6B55",

        cancelButtonText: "No",

        closeOnConfirm: true
    },

        function () {
            jQuery.ajax({
                url: $.MisUrls.url._EliminarCliente + "?id=" + $id,
                type: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {

                    if (data.resultado) {
                        tabladata.ajax.reload();
                    } else {
                        swal("Mensaje", "No se pudo Desactivar al cliente", "warning")
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

function printData() {

    if ($('#tbdata tbody tr').length == 0) {
        swal("Mensaje", "No existen datos para imprimir", "warning")
        return;
    }

    var divToPrint = document.getElementById("tbdata");

    var style = "<style>";
    style = style + "table {width: 100%;font: 17px Calibri;}";
    style = style + "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
    style = style + "padding: 2px 3px;text-align: center;}";
    style = style + "</style>";

    newWin = window.open("");


    newWin.document.write(style);
    newWin.document.write("<h3>Reporte de Ventas</h3>");
    newWin.document.write(divToPrint.outerHTML);
    newWin.print();
    newWin.close();
}