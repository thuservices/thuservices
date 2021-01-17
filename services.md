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

### 校园网基础知识

[清华大学校园网使用简介](https://its.tsinghua.edu.cn/helpsystem/train/CampusNetworkLectureNotes201909.pdf)

[清华大学校园网有线局域网用户准入系统使用说明（问与答）](https://its.tsinghua.edu.cn/helpsystem/wirednetwork/RealNameAuthenticationFAQ20190614.pdf)

上述文件太长不看版：在校园网中上网分为两步，一步是准入，另一步是准出。

没有准入与准出时，机器只能 ping 通 `166.111.8.28` 与 `2402:f000:1:801::8:28`，如果你有相应 v4 与 v6 地址。校内其他地址不通。

对于 IPv4 而言，当有准入而没有准出时，机器可以 ping 通校内机器，但不能 ping 通校外机器，即不能上外网。只有当有准入而且有准出时，机器可以连接外网。

对于 IPv6 而言，v6 只有准入这一步，有了准入，即可以连接外网。

对于 2 层接入的机器（紫荆宿舍网，教学楼无线网络，一些院系的网络），v4 认证与 v6 认证是联动进行的，即当 v4 准入时，v6 同时也准入。对于 3 层接入的机器（一些院系的网络），v4 与 v6 需要分别准入。

`Tsinghua-Secure` 使用的是另一套认证系统。

### 命令行认证 自动认证

参见 [utils.md](utils.md) 中的认证工具汇总。

以下参考 [GoAuthing](https://github.com/z4yx/GoAuthing)

#### 命令行认证

该软件实现了七个主要功能，分别是

```bash
auth-thu auth # v4准入
auth-thu deauth # 解除v4准入
auth-thu auth -6 # v6准入
auth-thu deauth -6 # 解除v6准入
auth-thu login # v4准出
auth-thu logout # 解除v4准出
auth-thu online # 保持机器在线
```

普通用户将其放在家目录下，作为命令行工具使用，即可满足大部分认证需求。

已知问题：在用户通过`auth-thu auth -C`（仅准入）后调用`auth-thu login`（仅准出），准出会失败。

#### 自动认证

对于系统管理员来说，可能存在服务器实现自动认证的需求。

下载好文件以后请合理放置在相应目录（如 /usr/local/bin）下，同时将配置文件放在合理目录下，即可使用

要做到自动**准入**，需将其中附带的 `goauthing.service` 与 `goauthing.timer` 放置 `/usr/lib/systemd/system/` 文件夹下 ，并调整相应内容以符合程序文件以及配置文件的路径，使用

``` bash
$ systemctl enable goauthing.service goauthing.timer
```

启动相应服务，即可达到自动认证的目的。如果要实现账户信息储存在用户家目录中而不是 `/etc` 中，可以参考 `goauthing@.{service,timer}`。

如果要实现 `v6` 的自动准入，可以拷贝并调整这些服务文件的一些参数，需要调整的参数请参考软件的文档。如果要实现自动准出，同样请参考相应参数修改。

如果有打包者将此打包，请 PR。目前在 AUR 中已存在 `auth-thu` 包。

### 远端服务器代认证

在某些服务器上无法使用浏览器打开 [net.tsinghua.edu.cn](https://net.tsinghua.edu.cn) 来认证，只能使用 [命令行工具](### 命令行认证 自动认证) 或「准入代认证」的方式来实现准入。

对于代认证，需要先知道服务器的 IPv4 地址，形如 `166.111.x.x` 或 `59.66.x.x` 或 `101.x.x.x`，之后打开 [usereg.tsinghua.edu.cn](https://usereg.tsinghua.edu.cn) 「准入代认证」部分，填入 IP 即可准入，在准入时可以选择是否打开准出。

对于某些三层接入的机器，如果要实现 v6 的准入，也可在「准入代认证」中实现准入。

对于有些服务器存在准入但没有准出的情况，可以使用「连线其他 IP」实现准出。 

关于准入与准出的问题，欢迎 PR。

关于 IPv4 和 IPv6 在准入准出上线与掉线时的表现，以及校内二层接入/三层接入的表现，欢迎 PR

### 远端服务器网页认证

有时 `usereg` 中的信息并不准确，如果此时还能 `ssh` 登录机器，除了之前提到的「命令行认证」外，还可以在登录时使用选项

```
ssh -D <port> host
```

这样在本地会搭建一个以 `<port>` 为端口的 socks5 代理，如果在浏览器中使用该代理，即可与往常一样实现网页认证。

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

### Tsinghua-Secure 仅校内登录方式

我们注意到，连接 Tsinghua-Secure 后获取的 IPv4 地址会自动进入准出表中，有可能在未预期的情况下挤占掉线已有的准出设备。

经过测试发现，如果在登录时使用的 username 为「username@tsinghua」（例如lh14@tsinghua），那么其登录行为与「仅校内登录」一样。这种情况下v4只有准入，v6有准入与准出。

在使用该方式认证后，笔者测试可以通过「net.tsinghua.edu.cn」进行准出，但有线网中这个行为不一样。

## 校园网特性讨论

### 二层隔离/邻居发现隔离

校园网的一大特性，是二层隔离/邻居发现隔离。对于v4来说，是前者；对于v6来说，是后者。这个机制为了安全而设计，但对不少开发者/使用者来说较为不方便。

这个特性本质上是核心交换机对广播域进行了划分，甚至使得只有一个客户端与网关在一个广播域中。

#### IPv4

当我们分配到例如 59.66.130.xx/24 的 IP 时，如果我们想连接 59.66.130.yy/24，我们可能会发现无法连接。注意到这两个在一个 /24 中，即一个二层中，这种情况下两台机器会通过ARP发现对方，但在学校的一些机制下，ARP不能工作。

这种情况下，需要在两台机器上增加以下路由。

```bash
ip r a 59.66.130.0/24 via 59.66.130.1
ip r a 59.66.130.1 dev eth0
```

需要根据实际情况修改相应参数。

#### IPv6

紫荆的 IPv6 不存在该问题，由于其地址是 /128 的。

当我们在一个 Tsinghua-Secure 下时，我们会通过 SLAAC 分配地址，即大家的地址都在一个同一个 /64 下，当互相之间想通信时，需要通过 NDP 进行发现。由于校园网的一些机制，NDP可能不会成功。

这种情况下，需要在两台机器上增加以下路由

```bash
ip r a 2402:f000:2:b801::/64 via fe80::xxxx dev wlan0
```
参数需要根据实际情况确认，第一个为 /64 的前缀，可以参考获得的地址或者参考 RA 来书写，第二个为网关的 LL 地址，与默认路由中显示的地址相同，第三个为无线网卡。

### 低端口阻断

按照前面的「使用简介」文档，IPv4 对 0到1024，8000到8100，3389 以及 9100 端口进行阻断。

### 动态 IP

对于动态IP，我们可以使用 DDNS 解决，各大提供商，例如 DNSPod，dns.he.net，cloudflare 都提供了该服务。

以 dns.he.net 为例，先增加一个 A/AAAA 记录，并选择使用 DDNS，创建好后创建更新 Token，记为 T。我们书写以下脚本

```
#!/bin/sh
curl -4 "https://domain.example.com:T@dyn.dns.he.net/nic/update?hostname=domain.example.com"
```
注意Token为其中的T。其余参数按照需要修改。

并用 cron 定期执行该脚本，例如每五分钟一次。可以参考 https://crontab.guru/ 命令获取具体阐释。

#### IPv6 静态后缀或短 IPv6 地址

我们知道，在 SLAAC 下（常见于Tsinghua-Secure），IPv6 地址的后64位可以由客户端自行决定，这时我们可以配置静态后缀，乃至短后缀，如果一个机器只在一个地点下，几乎可以认为前缀固定（需要验证）。

（吐槽：token 这套工具，几乎不在标准里面被提及，文档也少（IPv6 的文档本来就少），还是很小众的东西；毕竟谁需要静态后缀呢，同一个子网下的机器，与其使用静态后缀进行通信（没错，没有只有后缀的路由项，所以到网内另一台机器需要时刻加上前缀），不如配一个静态的私有地址）

往常我们分配到的 IPv6 较复杂，这是因为使用了 EUI64 或者隐私扩展，对于EUI64，可以在地址中发现 `ff:fe` 的字段。

我们可以通过 iproute2 或传统套件配置静态后缀，后者的使用方法请谷歌，前者的方法在此给出。

```bash
ip token set ::114:514:1919:810/64 dev wlan0
```

在运行此命令**之前**，我们需要注意，我们需要将网卡的 `forwarding` 关闭（**在配置时**，配置后可以打开转发），并打开 `accept_ra` 与 `autoconf`，并将其他 dhcp 客户端的 v6 功能关闭。

（吐槽：dhcpcd 虽然说是个 dhcp 客户端，它把 SLAAC 的事情也接管了，就很恼。按照传统只需要开了 `accept_ra` 与 `autoconf`，Linux 内核就会自动配置v6地址。如果 `forwarding=1`时，我们需要使 `accept_ra=2`）

```bash
sysctl net/ipv6/conf/wlan0/accept_ra=1
sysctl net/ipv6/conf/wlan0/autoconf=1
sysctl net/ipv6/conf/wlan0/forwarding=0
```

以上命令的一些参数请按需替换。我们可以将以上命令放在启动脚本中，使得自动配置 token。

### 不符合 RFC 的 DHCP

## 清华云盘

建议使用 [seafile.com/download](https://seafile.com/download) 中的 Linux 客户端，而不是 Terminal 客户端，因为 Terminal 客户端需要独立密码，此密码不同于 INFO 密码，不能获得，故不能通过 Terminal 客户端登录。

由于手动安装软件的方式是不为推崇的，请使用包管理器获取相应软件。对 Arch Linux 用户，Linux 客户端就是

```bash
pacman -S seafile-client
```

而非 `pacman -S seafile`，此包为 Terminal 客户端。其余发行版请自行找到对应包。

### 魔改 Terminal 客户端

在[该项目](https://github.com/prnake/Thu-Toolbox)中存在一个文件夹 seafile，其中指出了使用 Token 登录清华云盘的办法，可以避免使用独立密码。

## ISATAP 
  
参考 [ipv6.tsinghua.edu.cn](https://ipv6.tsinghua.edu.cn)

校内外拥有公网IPv4的均可使用该服务。注意 `166.111.21.1` 这个IP是不会回应ping包的。

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
