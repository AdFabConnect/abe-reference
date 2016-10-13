var Reference = function (el) {
	this.el = el;
	this.input = el.querySelector('.form-abe');
	this.label = el.querySelector('label');
	this.labelText = this.label.textContent.trim();
	this.bindEvt();
};

var save = function save (node, label) {
	console.log(node, label)
	var xhr = new XMLHttpRequest();
	var blocks = node;
	var datas = [];
	var saveJson = [];
	var key;

	if(typeof blocks !== 'undefined' && blocks !== null && blocks.length > 0){
		Array.prototype.forEach.call(blocks, function (block) {
	  	var inputs = block.querySelectorAll('.form-abe');
	  	Array.prototype.forEach.call(inputs, function (input) {
	  		var id = input.id;
	  		key = id.split('[')[0];
	  		var index = id.match(/\[(.*?)\]/)[1];
	  		var subkey = id.split('-')[1];
	  		if(typeof datas[key] === 'undefined' || datas[key] === null) datas[key] = [];
	  		if(typeof datas[key][index] === 'undefined' || datas[key][index] === null) datas[key][index] = {};
	  		datas[key][index][subkey] = input.value
	  	});
	  });
	}

	for(var key in datas){
		for (var i = 0; i < datas[key].length; i++) {
			saveJson.push(datas[key][i])
		}
	}
	xhr.open('GET', '/abe/plugin/abe-reference/create?&k=' + label + '&v=' + JSON.stringify(saveJson) + '&f=' + key);
	xhr.send(null);
	xhr.onreadystatechange = function () {
	  if (xhr.readyState === 4) {
	    if (xhr.status === 200) {
	      // console.log(xhr.responseText); // 'This is the returned text.'
	      setTimeout(function () {
	      	abe.editorReload.instance.reload();
	      }, 200);
	    } else {
	      console.log('Error: ' + xhr.status); // An error occurred during the request.
	    }
	  }
	};
};

Reference.prototype.bindEvt = function bindEvt () {
	this.input.addEventListener('blur', function (e) {
		save(this.el.parentNode.parentNode.parentNode.querySelectorAll('.list-block'), encodeURIComponent(this.labelText));
	}.bind(this));
};

document.addEventListener("DOMContentLoaded", function(event) {
	var initElement = [];
	var initDeletebtn = [];
  var addBlocks = function () {
  	var els = document.querySelectorAll('.tab-pane#reference [data-block] .form-group');
  	if(typeof els === 'undefined' || els === null) return;
	  Array.prototype.forEach.call(els, function (el) {
	  	if(initElement.indexOf(el) < 0){
	  		new Reference(el);
	  		initElement.push(el);
	  	}
	  });
  	var rmBlocks = document.querySelectorAll('.tab-pane#reference [data-block] .remove-block');
  	if(typeof rmBlocks === 'undefined' || rmBlocks === null) return;
	  Array.prototype.forEach.call(rmBlocks, function (rmBlock) {
	  	if(initDeletebtn.indexOf(rmBlock) < 0){
				rmBlock.addEventListener('click', function (e) {
					var rmBlockDaddy = rmBlock.parentNode.parentNode;
					setTimeout(function () {
						save(rmBlockDaddy.querySelectorAll('.list-block'), rmBlockDaddy.querySelector('label').textContent.trim());
					}, 200);
				}.bind(this));
	  		initDeletebtn.push(rmBlock);
	  	}
	  });
  };

  addBlocks();

  var btnAdds = document.querySelectorAll('.tab-pane#reference .add-block');
  Array.prototype.forEach.call(btnAdds, function (btnAdd) {
  	btnAdd.addEventListener('click', addBlocks);
  });
});

