var matrix;
var $table;
var rowMajor = false;
var msbendian = false;

$(function () {

	matrix = createArray(16, 16);
	updateTable();
	initOptions();

	$('#_output').hide();
});

function updateTable() {
	var width = matrix[0].length;
	var height = matrix.length;

	$('#_grid').html('');
	$('#_grid').append(populateTable(null, height, width, ""));

	// events
	$table.on("mousedown", "td", toggle);
	$table.on("mouseenter", "td", toggle);
	$table.on("dragstart", function () { return false; });
}

function initOptions() {
	$('#clearButton').click(function () { matrix = createArray(matrix.length, matrix[0].length); updateTable(); $('#_output').hide(); });
	$('#generateButton').click(updateCode);

	$('#widthDropDiv li a').click(function () {
		var width = parseInt($(this).html());
		var height = matrix.length;
		matrix = createArray(height, width);
		updateTable();
		updateSummary();
	});

	$('#heightDropDiv li a').click(function () {
		var width = matrix[0].length;
		var height = parseInt($(this).html());
		matrix = createArray(height, width);
		updateTable();
		updateSummary();
	});

	$('#byteDropDiv li a').click(function () {
		var selection = $(this).html();
		rowMajor = selection.startsWith("Row");
		updateSummary();
	});

	$('#endianDropDiv li a').click(function () {
		var selection = $(this).html();
		msbendian = selection.startsWith("Big");
		updateSummary();
	});

	updateSummary();
}

function updateSummary() {
	var width = matrix[0].length;
	var height = matrix.length;
	var summary = width + "px by " + height + "px, ";

	if (rowMajor) summary += "row major, ";
	else summary += "column major, ";

	if (msbendian) summary += "big endian.";
	else summary += "little endian.";

	$('#_summary').html(summary);
}

function updateCode() {
	$('#_output').show();
	var width = matrix[0].length;
	var height = matrix.length;
	var bytes = generateByteArray();
	var output = "bool data[" + matrix.length + "]" + "[" + matrix[0].length + "] = {";
	for (var y = 0; y < height; y++) {
		output += "{ "
		for (var x = 0; x < width; x++) {
			output += bytes[y * width + x] + ", ";
		}
		output = output.slice(0, -2);
		output += " },\n";
	}
	output = output.slice(0, -2);
	output += "};";
	$('#_output').html(output);
	$('#_output').removeClass('prettyprinted');
	prettyPrint();
}

function generateByteArray() {
	var width = matrix[0].length;
	var height = matrix.length;
	var buffer = new Array(width * height);
	var bytes = new Array((width * height) / 8);

	// Column Major
	var temp;
	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
			temp = matrix[y][x];
			if (!temp) temp = 0;
			// Row Major or Column Major?
			if (!rowMajor) {
				if (temp == 0) {
					buffer[x * height + y] = "false";
				}
				else {
					buffer[x * height + y] = "true";
				}
			}
			else {
				if (temp == 0) {
					buffer[y * width + x] = "false";
				}
				else {
					buffer[y * width + x] = "true";
				}
			}

		}
	}

	// Read buffer 8-bits at a time
	// and turn it into bytes

	return buffer;
}

function toggle(e) {
	var x = $(this).data('i');
	var y = $(this).data('j');

	if (e.buttons == 1 && !e.ctrlKey) {
		matrix[x][y] = 1;
		$(this).addClass('on');
	}
	else if (e.buttons == 2 || (e.buttons == 1 && e.ctrlKey)) {
		matrix[x][y] = 0;
		$(this).removeClass('on');
	}

	return false;
}

function populateTable(table, rows, cells, content) {
	if (!table) table = document.createElement('table');
	for (var i = 0; i < rows; ++i) {
		var row = document.createElement('tr');
		row.id = i;
		for (var j = 0; j < cells; ++j) {
			var tr = document.createElement('td');
			tr.id = j;
			tr.setAttribute('onmouseover', "coordinates(" + tr.id + ',' + row.id + ");");
			row.appendChild(tr);
			$(row.cells[j]).data('i', i);
			$(row.cells[j]).data('j', j);
		}
		table.appendChild(row);
	}
	$table = $(table);
	return table;
}

// (height, width)
function createArray(length) {

	var arr = new Array(length || 0),
		i = length;

	if (arguments.length > 1) {
		var args = Array.prototype.slice.call(arguments, 1);
		while (i--) arr[length - 1 - i] = createArray.apply(this, args);
	}

	return arr;
}



var add_height = document.getElementById("add_height");
add_height.addEventListener("keyup", function (event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		var height_ul = document.getElementById('dropdown_height');
		var height_li = document.createElement("li");
		var height_a = document.createElement("a");
		height_a.href = "#";
		height_a.innerText = add_height.value;
		height_li.appendChild(height_a);
		height_ul.prepend(height_li);
		initOptions();
	}
});



var add_width = document.getElementById("add_width");
add_width.addEventListener("keyup", function (event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		var width_ul = document.getElementById('dropdown_width');
		var width_li = document.createElement("li");
		var width_a = document.createElement("a");
		width_a.href = "#";
		width_a.innerText = add_width.value;
		width_li.appendChild(width_a);
		width_ul.prepend(width_li);

		initOptions();
	}
});


function coordinates(row, col) {
	document.getElementById('coor_row').innerText = row;
	document.getElementById('coor_col').innerText = col;
}