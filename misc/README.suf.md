
## 知道某个重要信息，但repo中未列出？

欢迎贡献！请 [PR](https://github.com/ZenithalHourlyRate/thuservices/pulls)！

需要注意的是[本 repo](https://github.com/ZenithalHourlyRate/thuservices) 中使用了 [pre-commit hook](https://github.com/ZenithalHourlyRate/thuservices/blob/master/pre-commit)，请[安装](https://git-scm.com/book/zh/v2/%E8%87%AA%E5%AE%9A%E4%B9%89-Git-Git-%E9%92%A9%E5%AD%90)，并在有 bash 与 python3 的环境中进行 commit。

在 pre-commit hook 的作用下，README.md 是自动生成的，故如果需要在 README.md 中修改，请在 [misc 文件夹](https://github.com/ZenithalHourlyRate/thuservices/tree/master/misc)下进行。

### 编译

```
python3 -m pip install --user -r requirements.txt # 安装 Python 依赖包
mkdocs serve # 直接在本地 serve，或者：
mkdocs build --clean # 生成于 site/ 文件夹中
```

## LICENSE

本站的文本遵循 CC BY-NC 4.0

本项目内的存放的代码遵循代码文件内自带的 LICENSE。若代码文件中未附带 LICENSE，则认为该文件暂无 LICENSE，有需求者可以联系相应 committer。
