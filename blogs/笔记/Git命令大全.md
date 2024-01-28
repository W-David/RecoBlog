---
title: Git命令大全
date: 2019-05-22 12:49:15
tags: 
  - Git
---

## 1.连接远程仓库
* 生成 SSH Key :
  `ssh-keygen -t rsa -C "youremail@example.com"`
* 验证是否成功：
  `ssh -T git@github.com`

<!-- more -->

## 2.新建代码库
* `git init`
* `git init [project_name]`
* `git clone [url]`

## 3.配置
* `git config --list	`		    # 显示当前的Git配置
* `git config --global user.name "[userName]"`
* `git config --global user.email "[userEmail]"`

## 4.添加/删除文件
* `git add [filelist...]	`		# 添加文件到暂存区
* `git add [dir]`
* `git add .`
* `git rm [filelist...]`
* `git rm --cached [file]   `            # 停止追踪指定文件，但该文件会保留在工作区

## 5.代码提交
* `git commit -m "[message]"`
* `git commit -v 	`		         # 提交时显示所有的diff信息

## 6.分支
* `git branch`				# 列出所有的本地分支
* `git  branch -r` 		      # 列出所有的远程分支
* `git branch -a`          	       # 列出所有的分支
* `git branch [branch_name]` 
* `git checkout -b [branch_name]`           # 创建新分支并切换到新分支
*   `git merge [branch]`                                  # 合并指定分支到当前分支
* `git branch -d [branch_name]`               # 删除分支

## 7.远程同步
* `git remote add [remote] [url]`       # remote是仓库的别名，便于引用，增加一个的远程仓库
* `git fetch [remote]`                              # 下载所有远程仓库变动
* `git remote -v`                                        # 显示所有远程仓库
* `git pull [remote] [branch]`             # 取回远程仓库的变化，并与本地分支合并
* `git push [remote] [branch]`              # 上传本地分支到远程仓库



## 8.查看信息

* `git status` 						# 显示有变更的文件
* `git log`						       # 显示当前分支的版本历史
* `git show [commit]`                                   # 显示某次提交的元数据和内容变化
