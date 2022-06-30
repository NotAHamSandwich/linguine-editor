let editor;
const getFiles = require('get-all-files');
ace.require("ace/ext-language_tools", "ace/ext-emmet");
const ipc = require('electron').ipcRenderer;
let filepath;
const pathTool = require('path')
let i = 0;
let e = 1;
let j = 2;
let openFiles = []
let filesInBrowser = []
let openedFiles = []
let footerTypeData = []
let footerLineCountData = []
let fileInBrowserID = 0;
let phase = true;
var fileTypes =  {
  " ": "abap",
  " ": "abc",
  " ": "actionscript",
  " ": "ada",
  " ": "alda",
  " ": "apache_config",
  " ": "apex",
  " ": "applescript",
  " ": "aql",
  " ": "asciidoc",
  " ": "asl",
  " ": "assembly_x86",
  " ": "autohotkey",
  " ": "batchfile",
  " ": "c_cpp",
  " ": "c9search",
  " ": "cirru",
  " ": "clojure",
  " ": "cobol",
  " ": "coffee",
  " ": "coldfusion",
  " ": "crystal",
  ".cs": "csharp",
  " ": "csound_document",
  " ": "csound_orchestra",
  " ": "csound_score",
  ".csp": "csp",
  ".css": "css",
  " ": "curly",
  " ": "d",
  " ": "dart",
  " ": "diff",
  " ": "django",
  " ": "dockerfile",
  " ": "dot",
  " ": "drools",
  " ": "edifact",
  " ": "eiffel",
  " ": "ejs",
  " ": "elixir",
  " ": "elm",
  " ": "erlang",
  " ": "forth",
  " ": "fortran",
  ".fs": "fsharp",
  " ": "fsl",
  " ": "ftl",
  " ": "gcode",
  " ": "gherkin",
  " ": "gitgnore",
  " ": "glsl",
  " ": "gobstones",
  " ": "golang",
  " ": "graphqlschema",
  " ": "groovy",
  " ": "haml",
  " ": "handlebars",
  " ": "haskell_cabal",
  " ": "haskell",
  " ": "haxe",
  " ": "hjson",
  " ": "html_elixir",
  " ": "html_ruby",
  ".html": "html",
  " ": "ini",
  " ": "io",
  " ": "jack",
  " ": "jade",
  ".java": "java",
  ".js": "javascript",
  ".json": "json",
  " ": "json5",
  " ": "jsoniq",
  " ": "jsp",
  " ": "jssm",
  " ": "jsx",
  " ": "julia",
  " ": "kotlin",
  " ": "latex",
  " ": "latte",
  " ": "less",
  " ": "liquid",
  " ": "lisp",
  " ": "livescript",
  " ": "logiql",
  " ": "lsl",
  " ": "lua",
  " ": "luapage",
  " ": "lucene",
  " ": "makefile",
  " ": "markdown",
  " ": "mask",
  " ": "matlab",
  " ": "maze",
  " ": "mediawiki",
  " ": "mel",
  " ": "mips",
  " ": "mixal",
  " ": "mushcode",
  " ": "mysql",
  " ": "nginx",
  " ": "nim",
  " ": "nix",
  " ": "nsis",
  " ": "nunjucks",
  " ": "objectivec",
  " ": "ocaml",
  " ": "pascal",
  " ": "perl",
  " ": "pgsql",
  " ": "php laravel blade",
  ".php": "php",
  " ": "pig",
  ".txt": "plain_text",
  " ": "powershell",
  " ": "praat",
  " ": "prisma",
  " ": "prolog",
  " ": "properites",
  " ": "protobuf",
  " ": "puppet",
  ".py": "python",
  " ": "qml",
  " ": "r",
  " ": "raku",
  " ": "razor",
  " ": "rdoc",
  " ": "red",
  " ": "redshift",
  " ": "rhtml",
  " ": "rst",
  " ": "ruby",
  " ": "rust",
  ".sass": "sass",
  " ": "scad",
  " ": "scala",
  " ": "scheme",
  " ": "scrypt",
  ".scss": "scss",
  " ": "sh",
  " ": "sjs",
  " ": "slim",
  " ": "smarty",
  " ": "smithy",
  " ": "snippets",
  " ": "soy_template",
  " ": "space",
  " ": "sparql",
  " ": "sql",
  " ": "sqlserver",
  " ": "stylus",
  " ": "svg",
  " ": "swift",
  " ": "tcl",
  " ": "terraform",
  " ": "tex",
  " ": "text",
  " ": "textile",
  " ": "toml",
  " ": "tsx",
  " ": "turtle",
  " ": "twig",
  " ": "typescript",
  " ": "vala",
  " ": "vbscript",
  " ": "velocity",
  " ": "verilog",
  " ": "vhdl",
  " ": "visualforce",
  " ": "wollok",
  " ": "xml",
  " ": "xquery",
  " ": "yaml",
  " ": "zeek",
}

let editorLib = {
  init() {
    editor = ace.edit("container");
    editor.setTheme("ace/theme/one_dark");

    editor.setBehavioursEnabled(true);
    editor.setShowPrintMargin(false);

    editor.setOption("enableEmmet", true);

    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        showPrintMargin: false,
    });
  }
}

document.addEventListener("keydown", function(e) {
  if (e.key.toLowerCase() === 's' && e.metaKey ){
    save()
    e.preventDefault()

  }
  if(e.key.toLowerCase() === 'o' && e.metaKey) {
    openFolder()
  }
  if (e.key.toLowerCase() === 'p' && e.metaKey) {
    openSettingsTab()
  }
});



ipc.on('selected-file', function (event, path) {
  const data = fs.readFileSync(path[0], 'utf8');
  editor = ace.edit("container");
  var newFile = ace.createEditSession(data);
  editorLib.init();
  openFiles[openFiles.length] = newFile;
  editor.setSession(newFile)
  editor.session.setMode("ace/mode/javascript")
  filepath = path[0]
  let filename = pathTool.basename(path[0])
  makeTab(filename)
});

ipc.on('selected-folder', function (event, files) {
  const list = document.getElementById('file-explorer-list')
  const child = list.childNodes
  console.log(child)
  for (let q = 0; q < child.length; q++) {
    list.innerHTML = '';
  }
  const pathName = pathTool.basename(files.filePaths[0])
  const folderLi = document.createElement('li')
  const folderSpan = document.createElement('span')
  const folderText = document.createTextNode(pathName)
  folderSpan.appendChild(folderText)
  folderLi.appendChild(folderSpan)
  folderLi.id = 'folder-header'
  list.appendChild(folderLi)
  folderSpan.appendChild(folderText)
  readDirRec(files.filePaths[0])
});

function readDirRec(path) {
  const data = fs.readdirSync(path)
  const dataLen = data.length
  for (let f = 0; f < dataLen; f++) {
    const joinedFilePath = pathTool.join(path, data[f])
    if (fs.statSync(joinedFilePath).isDirectory()) {
      arrayMove(data, f, 0)
    }
  }
  for (let x = 0; x < dataLen; x++) {
    const joinedFilePath = pathTool.join(path, data[x])
    if (fs.statSync(joinedFilePath).isDirectory()) {
      makeFileItemParent(data[x], data[x])
      readDirRec(joinedFilePath);
    }
    else {
      makeFileItemChild(data[x], pathTool.basename(path))
      let fileContent = fs.readFileSync(joinedFilePath, 'utf8')
      filesInBrowser[filesInBrowser.length] = fileContent
    }

    console.log(x, ' of ', dataLen)
  }

}

function openSettingsTab() {
  const tab = document.createElement('li');
  const tabDiv = document.createElement('div');
  const tabTextElement = document.createElement('span')
  const tabText = document.createTextNode("Settings");
  const tabClose = document.createElement('button')
  const tabCloseText = document.createTextNode('X');
  tabDiv.appendChild(tabTextElement);
  tabTextElement.appendChild(tabText);
  tabClose.appendChild(tabCloseText);
  tabClose.onclick = closeFile
  tabDiv.onclick = openSettings
  tab.classList.add('tab-button');
  tab.appendChild(tabDiv);
  tab.appendChild(tabClose);
  tabClose.id = i.toString().concat("close");
  tabDiv.id = e.toString().concat('div');
  const element = document.getElementById('tab-menu')
  element.appendChild(tab);
  i++;
  e++;
  let className = document.getElementsByClassName('tab-selected')
  className[0].classList.remove('tab-selected')
  tab.classList.add("tab-selected")
}

function openFolderBrowserTab() {
  let tabId = this.id
  console.log(tabId)
  const tab = document.getElementById(tabId)
  const parent = tab.parentNode
  const nodes = parent.childNodes
  let li = tab.getElementsByTagName('li')
  phase = !phase
  for (let m = 1; m < nodes.length; m++) {
    if (phase === true) {
      nodes[m].style.display = 'block';
    }
    else {
      nodes[m].style.display = 'none';
    }
  }

}

function openFileBrowserTab() {
  let itemId = this.id
  const browserTab = document.getElementById(itemId)
  let childNode = browserTab.childNodes
  let name = childNode[0].innerText
  const intId = parseInt(itemId)
  const file = filesInBrowser[intId]
  for (let t = 0; t < openedFiles.length; t++) {
    if (openedFiles[t] === name) {
      return
    }
  }
  openedFiles[openedFiles.length] = name
  editor = ace.edit("container");
  var newFile = ace.createEditSession(file);
  openFiles[openFiles.length] = newFile;
  editorLib.init();
  editor.setSession(newFile)
  let fileExt = pathTool.extname(name)
  let fileType = fileTypes[fileExt].toString()
  console.log(fileType)
  editor.session.setMode("ace/mode/" + fileType)
  makeTab(name)
  const lang = document.getElementById('lang')
  lang.innerText = fileType
  footerTypeData[footerTypeData.length] = fileType
  editor.session.selection.on('changeCursor', function(){
    const lineCount = document.getElementById('line-count')
    let cursorPos = editor.getCursorPosition()
    lineCount.innerText = cursorPos.row + ":" + cursorPos.column
  });
}

function arrayMove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}


function makeFileItemChild(name, parent) {
  let itemList = document.getElementById(parent);
  if (itemList === null) {
    itemList = document.getElementById('file-explorer-list')
  }
  const item = document.createElement('li');
  const itemDiv = document.createElement('div');
  const itemSpan = document.createElement('span');
  const itemName = document.createTextNode(name);
  itemDiv.onclick = openFileBrowserTab
  itemSpan.appendChild(itemName);
  itemDiv.appendChild(itemSpan);
  item.appendChild(itemDiv);
  itemList.appendChild(item);
  itemDiv.id = fileInBrowserID.toString().concat('browser-tab')
  fileInBrowserID++;
}

function makeFileItemParent(name, type) {
  const itemList = document.getElementById('file-explorer-list');
  const item = document.createElement('li');
  const itemDiv = document.createElement('div');
  const itemSpan = document.createElement('span');
  const itemName = document.createTextNode(name);
  itemDiv.onclick = openFolderBrowserTab
  itemDiv.id = j.toString().concat('file')
  item.id = type
  itemSpan.appendChild(itemName);
  itemDiv.appendChild(itemSpan);
  item.appendChild(itemDiv);
  itemList.appendChild(item);
  j++;
}

function makeTab(name) {
  const tab = document.createElement('li');
  const tabDiv = document.createElement('div');
  const tabTextElement = document.createElement('span')
  const tabText = document.createTextNode(name);
  const tabClose = document.createElement('button')
  const tabCloseText = document.createTextNode('X');
  tabDiv.appendChild(tabTextElement);
  tabTextElement.appendChild(tabText);
  tabClose.appendChild(tabCloseText);
  tabClose.onclick = closeFile
  tabDiv.onclick = openTab
  tab.classList.add('tab-button');
  tab.appendChild(tabDiv);
  tab.appendChild(tabClose);
  tabClose.id = i.toString().concat("close");
  tabDiv.id = e.toString().concat('div');
  const element = document.getElementById('tab-menu')
  element.appendChild(tab);
  i++;
  e++;
  let className = document.getElementsByClassName('tab-selected')
  className[0].classList.remove('tab-selected')
  tab.classList.add("tab-selected")
}

function openFile() {
  ipc.send('open-file-dialog')
}

function openFolder() {
  ipc.send("open-folder-dialog")
}

function closeFile() {
  let btnId = event.srcElement.id
  var btnStr = btnId.toString();
  const btn = document.getElementById(btnStr)
  btn.parentNode.remove();
  let intBtnId = parseInt(btnId)
  openFiles[intBtnId] = null
  let extra = document.createElement('div')
  extra.classList.add('tab-selected')
  document.body.appendChild(extra)
  let interation = 0;
  console.log(openFiles)
  for (let check = 0; check < openFiles.length; check++) {
    if (openFiles[check] === null) {
      interation++;
    }
    if (openFiles[check] != null) {
      editor.setSession(openFiles[check])
      const leftTab = document.getElementById(check.toString().concat('close'))
      const parentTab = leftTab.parentNode
      console.log(parentTab)
      const oldSelect = document.getElementsByClassName('tab-selected')
      oldSelect[0].classList.remove('tab-selected')
      parentTab.classList.add('tab-selected')
      break
    }
  }
  if (interation === openFiles.length) {
    ace.edit('container').destroy()
    makeNoFileTab()
  }
  const btnParent = btn.parentNode
  const btnDiv = btnParent.childNodes
  const btnSpan = btnDiv[0].childNodes
  const name = btnSpan[0].innerText
  for (let t = 0; t < openedFiles.length; t++) {
    if (openedFiles[t] === name) {
      openedFiles[t] = null
    }
  }

}

function makeNoFileTab() {
  const textSpan = document.createElement('span')
  const text = document.createTextNode("You Haven't Open Any Files")
  const btn = document.createElement('button')
  const btnText = document.createTextNode('Add Folder')
  const container = document.getElementById('container')
  textSpan.appendChild(text)
  btn.appendChild(btnText)
  container.appendChild(textSpan)
  container.appendChild(btn)
}

function openTab() {
  let tabId = this.id
  const tabBtn = document.getElementById(tabId)
  let intId = parseInt(tabId);
  intId--;
  let file = openFiles[intId];
  editor
  editor.setSession(file)
  editorLib.init();
  let className = document.getElementsByClassName('tab-selected')
  className[0].classList.remove('tab-selected')
  tabBtn.parentNode.classList.add('tab-selected')
  /*const list = document.getElementById('file-explorer-list')
  const kids = list.childNodes
  const tabChild = tabBtn.childNodes
  const tabName = tabChild[0].innerText
  for (let m = 1; m < kids.length; m++) {
    const underKids = kids[m].childNodes
    const underUnderKids = underKids[0].childNodes
    const name = underUnderKids[0].innerText
    if (name === tabName) {
      underUnderKids[0].style.backgroundColor = 'green'
    }*/
    let fileType = footerTypeData[intId]
    const lang = document.getElementById('lang')
    lang.innerText = fileType
}

function openSettings() {

}

function save() {
  const editorValue = editor.getValue();
  fs.writeFileSync(filepath, editorValue);
}
