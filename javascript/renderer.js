var editor = monaco.editor.create(document.getElementById('container'), {
	value: "// First line\nfunction hello() {\n\talert('Hello world!');\n}\n// Last line",
	language: 'javascript',

	lineNumbers: 'on',
	roundedSelection: false,
	scrollBeyondLastLine: false,
	readOnly: false,
	theme: 'vs-dark',
	automaticLayout: true
});
setTimeout(function () {
	editor.updateOptions({
		lineNumbers: 'on'
	});
}, 2000);


