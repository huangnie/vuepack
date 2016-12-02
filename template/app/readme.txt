1、全局安装electron  

npm install electron -g
在cmd 直接输入 electron 直接启electron

2、编写第一个Electron应用

在任何地方，建立一个app的目录并新建3个文件：

1
2
3
4
app/
├── package.json
├── main.js
└── index.html
　　

 package.json

1
2
3
4
5
6
7
8
9
{
  "name"    : "your-app",
  "version" : "0.1.0",
  "main"    : "main.js",
  "scripts": {
    "start": "electron .",
    "package": "electron-packager ./ --all --out ~/Desktop/app --version 1.4.0 --overwrite --icon=./src/img/weather.ico"
  }
}
main.js

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
const electron = require('electron');
// 控制应用生命周期的模块
const {app} = electron;
// 创建本地浏览器窗口的模块
const {BrowserWindow} = electron;
 
// 指向窗口对象的一个全局引用，如果没有这个引用，那么当该javascript对象被垃圾回收的
// 时候该窗口将会自动关闭
let win;
 
function createWindow() {
  // 创建一个新的浏览器窗口
  win = new BrowserWindow({width: 1920, height: 1080});
 
  // 并且装载应用的index.html页面
  win.loadURL(`file://${__dirname}/index.html`);
 
  // 打开开发工具页面
  //win.webContents.openDevTools();
 
  // 当窗口关闭时调用的方法
  win.on('closed', () => {
    // 解除窗口对象的引用，通常而言如果应用支持多个窗口的话，你会在一个数组里
    // 存放窗口对象，在窗口关闭的时候应当删除相应的元素。
    win = null;
  });
}
 
// 当Electron完成初始化并且已经创建了浏览器窗口，则该方法将会被调用。
// 有些API只能在该事件发生后才能被使用。
app.on('ready', createWindow);
/* var mainWindow = new BrowserWindow({
  webPreferences: {
    nodeIntegration: false
  }
}); */
// 当所有的窗口被关闭后退出应用
app.on('window-all-closed', () => {
  // 对于OS X系统，应用和相应的菜单栏会一直激活直到用户通过Cmd + Q显式退出
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
 
app.on('activate', () => {
  // 对于OS X系统，当dock图标被点击后会重新创建一个app窗口，并且不会有其他
  // 窗口打开
  if (win === null) {
    createWindow();
  }
});
 
// 在这个文件后面你可以直接包含你应用特定的由主进程运行的代码。
// 也可以把这些代码放在另一个文件中然后在这里导入。
　　index.html 就可以随意添加的代码：

1
2
3
4
5
6
7
8
9
10
11
12
13
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Hello World!</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    We are using node <script>document.write(process.versions.node)</script>,
    Chrome <script>document.write(process.versions.chrome)</script>,
    and Electron <script>document.write(process.versions.electron)</script>.
  </body>
</html>
3、预览应用，就是把app那个文件直接投放到打开的 electron里面就可以查看效果了。

4、如果需要打包成asar 二级制的文件，

全局安装：npm install -g asar

打包：

C:>asar pack 文件夹路径 app.asar  //打包后只读不可修改的
5、发布成exe的问题。需要安装electron-prebuilt   npm install -g electron-prebuilt

6、在package写了发布的脚本，一直npm run-scritp package 打包就可以，ico的路径自己设置，也可以定义设置那个版本的：

那样就可以了，今天第一次接触，也遇到了第三方的库不能接入的问题。在github上找到的问题汇总：https://github.com/electron/electron/blob/master/docs-translations/zh-CN/faq/electron-faq.md