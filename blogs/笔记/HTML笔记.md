---
title: HTML笔记
date: 2019-07-09 15:44:12
tags:
    - HTML
---

## 1. 常用的标签

    <html> <body> <title> <meta> <body> 每个html文本都要有
    <p>  <h1>..<h6> <hr> <br> 段落，标题，分割线，换行
    <a href="link-url">描述</a>

<!--more-->
## 2. 其他标签
    <b> <i> 加粗 ，斜体
    <strong> <em> 重要文本 和上边两个标签视觉效果相似
    <a href="httpUrl" target="_blank">描述</a>
## 3.HTML CSS
* 内联样式：在HTML属性内使用

`<p style="color:blue;margin-left:20px;">这是一个段落。</p>`
* 内部样式表： 在`<head>`区域使用`<style>`
```
<head>
<style type="text/css">
body {background-color:yellow;}        
p {color:blue;}
</style>
</head>
```
* 外部引用： 使用外部CSS文件 使用`<link>` 标签
```
<head>
<link ref="stylesheet" type="text/css" href="mystyle.css">
</head>
```
## 4.元素标签
### 图像
`<img src="image-url" alt="description" width="100" height="200">`
### 表格
```
<table border="1">
<tr>
    <td>first row,first cell</td>
    <td>first row,second cell</td>
</tr>
</table>
```
### 列表
* 有序列表

`<ol><li>the context of ol</li></ol>`

* 无序列表

`<ul><li>the context of ul</li></ul>`

* 自定义列表

`<dl><dt>the context of dl</dt><dd>description of dt</dd></dl>`

### 区块
> 大多数HTML元素被定义为**块级元素**和**内联元素**,块级元素在显示时，通常会以新行开始和结束,而内联元素不会以新行开始

*  `<div> 是块级元素，它可用于组合其他HTML 的容器`
*  `<span> 是内联元素，可用作文本的容器`

### 表单
> 表单是一个包含表单元素的区域，表单元素是指允许用户在表单元素中输入内容，比如:      **textarea(文本域), radio-buttons(单选框), checkbox(多选框), select(下拉列表)**
```
<form name="input" action="html_from_action.php" mothod="get">
Username:<input type="text" name="username">
Password:<input type="password" name="password">
<input type="radio" name="sex" value="male">Male<br>
<input type="radio" name="sex" value="female">Female<br>
<input type="checkbox" name="vehicle" value="Bike">Bike<br>
<input type="checkbox" name="vehicle" value="Car">Car<br>
<select name="cars">
<option value="volvo">Volvo</option>
<option value="jik">Jik</option>
</select>
<input type="submit" value="Submit">
</form>
```
### 框架
> 定义一个内联的**iframe**

`<iframe src="url" frameborder="0"></iframe>`

### HTML 脚本
`<script>document.write("hello world!")</script>`

## END
