# watch [boolean]
webpack 可以监听文件变化，当它们修改后会重新编译. 这个配置是关于如何启动这个功能，以及当watch无法正常运行时，可以做的调整.
watch模式是默认关闭的. 在 webpack-dev-server 和 webpack-dev-middleware 中 watch模式是默认开启.

# watchOptions
## watchOptions.aggregateTimeout [number] [默认300] 单位ms
当第一个文件更改，会再重新构建前增加延迟. 这个选项允许 webpack 将这段时间内进行的任何其他改动都聚合到一次重新构建中.
## watchOptions.ignored
对于某些系统，监听大量文件系统会导致大量的CPU或内存占用, 使用这个选项可以排除一些不必要的监听.
例子：
```js
// node_modules
ignored: /node_modules/
// 任意指定文件
ignored: "file.js"
```
## watchOptions.poll [boolean | number] 
传递true开启polling， 或者指定时间进行轮询. 每个多少毫秒检查一次变动.
如果watch没有生效，可以尝试这个选项. Watch 在 NFS 和 VirtualBox 机器上不适用.

# webpack 一些对应的命令行参数
info-verbosity: none | info | verbose
```cmd
webpack --watch --info-verbosity verbose
```

# watch 未被触发时的故障排除
## 文件修改未做处理
运行webpack时，通过使用 --progress 标志，来验证文件修改后，是否通知 webpack. 如果进度条显示成功，则可能是配置问题，而不是文件监视问题.
## 没有足够的文件观察者
确认系统中有足够多的文件观察者，如果这个值太低，webpack中的文件观察者将无法识别修改:
```cmd
cat /proc/sys/fs/inotify/max_user_watches
```
Arch 用户： 将 fs.inotify.max_user_watches=524288 添加到 /etc/sysctl.d/99-sysctl.conf 中，然后执行 sysctl --system
Ubuntu 用户：请执行：echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

## IDE 问题
vim： 确保 backupcopy=yes. (:set backupcopy=yes)
webstorm： 禁用 safe write. File -> Settings -> System Settings -> Use "Safe Write" (save changes to a temporary file first)
