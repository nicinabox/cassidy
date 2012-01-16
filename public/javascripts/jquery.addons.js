$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(stringToBoolean(this.value) || '');
    } else {
      o[this.name] = stringToBoolean(this.value);
    }
  });
  for (i in o) {
    if($.isArray(o[i])) {
      o[i] = o[i][o[i].length-1]
    }
  }
  return o;
};

function stringToBoolean(string) {
  switch(string.toLowerCase()) {
    case "true": case "yes": case "1": return true;
    case "false": case "no": case "0": case null: return false;
    default: return string;
  }
}