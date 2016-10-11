'use strict';

var fs = require('fs');
var path = require('path');

var hooks = {
  afterEditorFormBlocks: function (blocks, json, abe) {

    var getobj = function (obj, idx, key) {
      var res = [];
      for(var o in obj) {
        res.push({
          "type": "text",
          "key": key + '[' + idx + ']-' + o,
          "desc": o,
          "maxLength": "",
          "tab": "reference",
          "placeholder": "",
          "value": obj[o],
          "source": null,
          "display": "",
          "reload": false,
          "order": "",
          "required": "",
          "editable": false,
          "visible": "",
          "block": "",
          "autocomplete": "",
          "paginate": "",
          "hint": ""
        });
      }
      return res;
    };

    var rex = new RegExp('{{abe(.*?)source=["|\']' + abe.config.reference.url +'(.*?)json["|\'](.*?)}}', 'g')
    var tpl = abe.cmsTemplates.template.getTemplate(json.abe_meta.template);
    var matches = tpl.match(rex);
    if(matches){
      blocks.reference = {};
      matches.forEach(function (match) {
        var reference = [];
        var index = 0;
        var sourceAttr = abe.cmsData.regex.getAttr(match, 'source');
        var jsonData = abe.cmsData.file.get(path.join(abe.config.root, sourceAttr));
        var fileName = sourceAttr.replace(new RegExp(abe.config.reference.url + '/(.*?)\.json'), '$1');
        json.reference = [];
        if(Object.prototype.toString.call(jsonData) === "[object Array]"){
          jsonData.forEach(function (el) {
            if(Object.prototype.toString.call(el) === "[object Object]") {
              reference = reference.concat(getobj(el, index++, fileName));
              json.reference.push(el)
            }
          });
        }
        if(reference.length > 0) blocks.reference[fileName] = reference;
      });
    }
console.log(blocks)
    return blocks;
  },
  beforeSave: function(obj, abe) {
    if(typeof obj.json.content.reference !== 'undefined' && obj.json.content.reference !== null) delete obj.json.content.reference;
    return obj
  }
};

exports.default = hooks;
