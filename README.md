# 口袋街机

一个面向 iPhone Safari 的纯前端小游戏页面，包含 15 款游戏：俄罗斯方块、飞机大战、贪吃蛇、打砖块、数字合成、像素飞行、记忆翻牌、方格探雷、弹跳上升、迷宫逃脱、霓虹乒乓、太空入侵、快打地鼠、堆叠高塔和色块扩张。

## 本机运行

```bash
python3 -m http.server 5177
```

Mac 和 iPhone 连到同一个 Wi-Fi 后，在 iPhone Safari 打开：

```text
http://<你的 Mac 局域网 IP>:5177
```

Mac 的 Wi-Fi IP 可以用下面命令查看：

```bash
ipconfig getifaddr en0
```

页面也可以直接打开 `index.html` 试玩；通过服务器访问时更接近手机运行环境。
