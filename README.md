# 口袋街机

15 款经典街机游戏的纯前端合集，专为移动端触控打造。一个页面，即开即玩。

## 预览

| 入口 | 地址 |
|------|------|
| 项目介绍页 | [iosGame.ssdwgg.site](https://iosGame.ssdwgg.site) |
| 项目介绍页 | [iosGame.aiwgg.cn](https://iosGame.aiwgg.cn) |
| GitHub Pages | [ssdwgg.github.io/iosGame](https://ssdwgg.github.io/iosGame) |

## 游戏列表

俄罗斯方块、飞机大战、贪吃蛇、打砖块、数字合成、像素飞行、记忆翻牌、方格探雷、弹跳上升、迷宫逃脱、霓虹乒乓、太空入侵、快打地鼠、堆叠高塔、色块扩张

## 本地运行

```bash
cd web
python3 -m http.server 5177
```

打开浏览器访问 `http://localhost:5177/landing.html` 查看介绍页，或 `http://localhost:5177/index.html` 直接开始游戏。

## 技术栈

HTML5 Canvas · CSS Grid · PWA（Service Worker + Manifest）· 原生 JavaScript · 零依赖

## 部署

项目通过 GitHub Actions 自动部署到 GitHub Pages，同时部署到 VPS（Nginx + Let's Encrypt HTTPS）。

## License

MIT
