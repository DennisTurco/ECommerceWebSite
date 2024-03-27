$(document).ready(function () {
    $("#SearchInput").on("keyup", function Search() {
        var value = $(this).val().toLowerCase();
        $("#SearchTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});


$(document).ready(function Search2() {
    $("#SearchInput2").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#SearchTable2 tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});