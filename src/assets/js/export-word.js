/**
 * Created by dongishan on 19/06/2017.
 */

var exportToWordFile = (function () {
  var uri = 'data:application/vnd.ms-word;base64,'
    ,
    template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head></head><body><table>{table}</table></body></html>' +
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
      document.getElementById("downloadLink").download = "Start Fund Project Application Form-"+name+".doc";
      document.getElementById("downloadLink").click();
    });
  }
})();
