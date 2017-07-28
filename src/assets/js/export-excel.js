/**
 * Created by dongishan on 12/06/2017.
 */
var exportToExcelFile = (function () {
  var uri = 'data:application/vnd.ms-excel;base64,'
    ,
    template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv=Content-Type content="text/html; charset=windows-1252"> <meta name=ProgId content=Excel.Sheet> <meta name=Generator content="Microsoft Excel 11"/></head><body><table>{table}</table></body></html>' +
      '</head><body><table>{table}</table></body></html>'
    , base64 = function (s) {
      return window.btoa(unescape(encodeURIComponent(s)))
    }
    , format = function (s, c) {
      return s.replace(/{(\w+)}/g, function (m, p) {
        return c[p];
      })
    };
  return function (tables, names) {
    tables.forEach(function (table, index) {
      var name = names[index];
      if (!table.nodeType) table = document.getElementById(table);
      var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML};
      document.getElementById("downloadLink").href = uri + base64(format(template, ctx));
      document.getElementById("downloadLink").download = "Start Fund Project Application Form-"+name+".xls";
      document.getElementById("downloadLink").click();
    });
  }
})();
