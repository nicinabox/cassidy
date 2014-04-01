this["JST"] = this["JST"] || {};

this["JST"]["application"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"row\">\n</div>\n";
  });

this["JST"]["generator"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<form action=\"\">\n  <div class=\"form-group\">\n    <input type=\"service\" name=\"service\" class=\"form-control input-lg\" placeholder=\"Eg, google.com\" autocomplete=\"off\" autocapitalize=\"off\" autocorrect=\"off\" autofocus>\n    <a href=\"#\" class=\"clear\" tabindex=\"-1\">&times;</a>\n  </div>\n\n  <div class=\"form-group\">\n    <input type=\"text\" class=\"result\" readonly>\n    <small class=\"hint\">\n      <span class=\"super-key\">⌘</span>C\n    </small>\n  </div>\n</form>\n";
  });

this["JST"]["no_results"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h3 class=\"no-results\">\n  ";
  if (helper = helpers.message) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.message); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n</h3>\n";
  return buffer;
  });

this["JST"]["phrase"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"form-group\">\n  <label for=\"phrase\">Phrase</label>\n  <a href=\"#\" class=\"small toggle-visibility\">Show</a>\n\n  <input type=\"password\" name=\"phrase\" id=\"phrase\" class=\"form-control\"value=\"";
  if (helper = helpers.phrase) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.phrase); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n</div>\n";
  return buffer;
  });

this["JST"]["service"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  if (helper = helpers.service) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.service); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n<span class=\"remove\">&times;</span>\n";
  return buffer;
  });

this["JST"]["settings"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function";


  buffer += "<form action=\"\">\n  <div class=\"form-group\">\n    <label for=\"\">Options</label>\n    <div class=\"toggle\">\n      <input type=\"checkbox\" name=\"lower\" id=\"lower\" "
    + escapeExpression((helper = helpers.checked || (depth0 && depth0.checked),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.lower), options) : helperMissing.call(depth0, "checked", (depth0 && depth0.lower), options)))
    + ">\n      <label for=\"lower\">a-z</label>\n    </div>\n\n    <div class=\"toggle\">\n      <input type=\"checkbox\" name=\"upper\" id=\"upper\" "
    + escapeExpression((helper = helpers.checked || (depth0 && depth0.checked),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.upper), options) : helperMissing.call(depth0, "checked", (depth0 && depth0.upper), options)))
    + ">\n      <label for=\"upper\">A-Z</label>\n    </div>\n\n    <div class=\"toggle\">\n      <input type=\"checkbox\" name=\"number\" id=\"number\" "
    + escapeExpression((helper = helpers.checked || (depth0 && depth0.checked),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.number), options) : helperMissing.call(depth0, "checked", (depth0 && depth0.number), options)))
    + ">\n      <label for=\"number\">0-9</label>\n    </div>\n\n    <div class=\"toggle\">\n      <input type=\"checkbox\" name=\"dash\" id=\"dash\" "
    + escapeExpression((helper = helpers.checked || (depth0 && depth0.checked),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.dash), options) : helperMissing.call(depth0, "checked", (depth0 && depth0.dash), options)))
    + ">\n      <label for=\"dash\">-/_</label>\n    </div>\n\n    <div class=\"toggle\">\n      <input type=\"checkbox\" name=\"symbol\" id=\"symbol\" "
    + escapeExpression((helper = helpers.checked || (depth0 && depth0.checked),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.symbol), options) : helperMissing.call(depth0, "checked", (depth0 && depth0.symbol), options)))
    + ">\n      <label for=\"symbol\">!@#$%</label>\n    </div>\n  </div>\n\n  <div class=\"form-group\">\n    <label for=\"length\">Length</label>\n    <input type=\"number\" name=\"length\" id=\"length\" class=\"form-control\" value=\"";
  if (helper = helpers.length) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.length); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n  </div>\n\n  <div class=\"form-group\">\n    <label for=\"key\">Key</label>\n    <input type=\"text\" name=\"key\" id=\"key\" class=\"form-control\" value=\"";
  if (helper = helpers.key) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.key); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n    <small class=\"help-block\">\n      Your key is unique to you. You'll need it to generate the same passwords.\n    </small>\n  </div>\n</form>\n\n<div class=\"placeholder-passphrase\"></div>\n\n<div class=\"danger-zone\">\n  <a href=\"#\" class=\"btn btn-link reset-settings\">Reset</a><br>\n  <a href=\"#\" class=\"btn btn-link btn-link-danger clear-data\">Clear all data</a>\n</div>\n";
  return buffer;
  });

this["JST"]["sidebar"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"tab-content\"></div>\n";
  });

this["JST"]["sidebar_tabs_view"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<li class=\"active\">\n  <a href=\"#services\" data-toggle=\"pill\">Services</a>\n</li>\n<li>\n  <a href=\"#settings\" data-toggle=\"pill\">Settings</a>\n</li>\n";
  });