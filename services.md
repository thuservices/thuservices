# 清华服务使用指北（主要面向 Linux 用户）

本文将重点关注清华一些服务在 Linux 机器，包括远端服务器上的使用说明

以及校园专供 Windows 10 的激活指南

## SSLVPN

在 Linux 机器上没有 PULSE SECURE 客户端，除了可以使用 WEB VPN 外，也可使用 `openconnect` 来做到连接清华VPN。

若是 Debian 系，包括 Ubuntu，可以使用

```bash
$ apt-get install openconnect
```

若是 Arch Linux，可以使用

```bash
$ pacman -S openconnect
```

安装此软件。其余发行版请自行查阅相应源。

安装完毕后，使用

```bash
$ openconnect --juniper https://sslvpn.tsinghua.edu.cn
```

输入帐号和密码后即连接上校园网，可以访问校内服务（INFO/USEREG）。

值得注意的是，与清华无关的流量依旧按照原有路由发出，此行为与 Windows 下不同。（此项需求证）

## 上网认证

### （自动）认证

参考 [GoAuthing](https://github.com/z4yx/GoAuthing)

下载好文件以后请合理放置在相应目录（如 /usr/local/bin）下，同时将配置文件放在合理目录下，即可使用

要做到自动认证，需将其中附带的 `goauthing.service` 与 `goauthing.timer` 放置 `/usr/lib/systemd/system/` 文件夹下 ，并调整相应内容以符合程序文件以及配置文件的路径，使用

``` bash
$ systemctl enable goauthing.service goauthing.timer
```

启动相应服务，即可达到自动认证的目的。

如果有打包者将此打包，请 PR。

### 远端服务器代认证

在某些服务器上无法使用浏览器打开 [net.tsinghua.edu.cn](https://net.tsinghua.edu.cn) 来认证，只能使用 [命令行工具](## （自动）认证) 或 准入代认证 的方式来认证。

对于代认证，需要先知道服务器的 IPv4 地址，形如 `166.111.x.x` 或 `59.66.x.x` 或 `101.x.x.x`，之后打开 [usereg.tsinghua.edu.cn](https://usereg.tsinghua.edu.cn) 准入代认证部分，填入 IP 即可上网。

关于准入与准出的问题，欢迎 PR。

据了解，准入代认证和连线其他 IP 分别负责校园网的准入和准出。当机器无准入时，校内不通；无准出时候，校内通但校外不通。

具体判据为无准入 ping 包无回应，无准出是 ping 包到出口即断。

万能方法是 准入代认证，不过可以在观察到已有准入时使用 连线其他IP 也可联网。

关于 IPv4 和 IPv6 在准入准出上线与掉线时的表现，以及校内二层接入/三层接入的表现，欢迎 PR

### Tsinghua-Secure

如果是校内环境，首先连接 `Tsinghua-Secure无线网使用指南` 进入 [usereg.tsinghua.edu.cn](https://usereg.tsinghua.edu.cn) , 登录后在 `自注册及修改口令处` 设置 Tsinghua-Secure 使用的密码，此密码不需要与 info 密码相同。

设置好后，除了使用 `NetworkManager` 等 GUI 工具，也可使用命令行完成相应 wifi 连接。

安装 `wpa_supplicant`，编辑 `/etc/wpa_supplicant/wpa_supplicant-nl80211-XXXX.conf`， 其中 `XXXX` 是本机网卡名称，输入一下内容

```
ctrl_interface=/var/run/wpa_supplicant
update_config=1

network={
        ssid="Tsinghua-Secure"
        proto=RSN
        key_mgmt=WPA-EAP
        pairwise=CCMP
        eap=PEAP
        identity="username"
        password="password"
        phase2="auth=MSCHAPV2"
        priority=9
}     
```

其中 `username` 与 `password` 为自己帐号相应信息。之后输入

```
$ systemctl enable --now wpa_supplicant-nl80211@XXXX.service
```

即可连接。

## 清华云盘

建议使用 [seafile.com/download](https://seafile.com/download) 中的 Linux 客户端，而不是 Terminal 客户端，因为 Terminal 客户端需要独立密码，此密码不同于 INFO 密码，不能获得，故不能通过 Terminal 客户端登录。

由于手动安装软件的方式是不为推崇的，请使用包管理器获取相应软件。对 Arch Linux 用户，Linux 客户端就是

```bash
pacman -S seafile-client
```

而非 `pacman -S seafile`，此包为 Terminal 客户端。其余发行版请自行找到对应包。

## ISATAP 
  
参考 [ipv6.tsinghua.edu.cn](https://ipv6.tsinghua.edu.cn)

### 获取IPv6挂PT

由于在家中使用 SSLVPN 后可获得公网 IP，可以使用 ISATAP 获取清华 IPv6 地址，以达到挂 PT 的功能，此处不做详细展开。

## WIN 10 激活

在 Linux 下使用该命令获取相关 cmd 指令

```
$ dig -t TXT win10.harrychen.xyz +short
```

或在 Windows 下使用

```
cmd> nslookup -q=TXT win10.harrychen.xyz
```

然后在连上 sslvpn 的情况下执行该脚本即可激活
