let fileCont = 'no file loaded';


var editor = monaco.editor.create(document.getElementById('container'), {
	value: "no file loaded",
	language: 'javascript',

	lineNumbers: 'on',
	roundedSelection: false,
	scrollBeyondLastLine: false,
	readOnly: false,
	theme: 'vs-dark',
	automaticLayout: true
});


async function openDir() {
  let dir = await window.showDirectoryPicker();
	console.log(dir)
}

async function openFile() {
	[fileHandle] = await window.showOpenFilePicker();
  const fileData = await fileHandle.getFile();
	let text = await fileData.text();
	console.log(text)

}