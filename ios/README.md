# 口袋街机 iOS App

这是 `web/` 游戏的 iOS 原生壳工程。App 使用 SwiftUI + WKWebView 加载打包进应用内的本地网页资源，不需要手机联网。

当前游戏合集包含 15 款：俄罗斯方块、飞机大战、贪吃蛇、打砖块、数字合成、像素飞行、记忆翻牌、方格探雷、弹跳上升、迷宫逃脱、霓虹乒乓、太空入侵、快打地鼠、堆叠高塔和色块扩张。

## 在模拟器运行

```bash
open ios/PocketArcade/PocketArcade.xcodeproj
```

在 Xcode 顶部选择 `PocketArcade` scheme 和一个 iPhone 模拟器，然后点击 Run。

也可以用命令行构建：

```bash
xcodebuild \
  -project ios/PocketArcade/PocketArcade.xcodeproj \
  -scheme PocketArcade \
  -destination 'generic/platform=iOS Simulator' \
  CODE_SIGNING_ALLOWED=NO \
  build
```

## 真机运行

1. 用 Xcode 打开 `ios/PocketArcade/PocketArcade.xcodeproj`。
2. 选择你的 iPhone。
3. 在 target 的 Signing & Capabilities 里选择你的 Apple Team。
4. 点击 Run。

修改 `web/` 里的游戏代码后，重新 Run 即可把最新资源打进 App。

## 上架 App Store

官方入口：

- Apple Developer Program: https://developer.apple.com/programs/
- App Store Connect: https://appstoreconnect.apple.com/
- App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- App Privacy Details: https://developer.apple.com/app-store/app-privacy-details/
- Screenshot specifications: https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications

基本流程：

1. 加入 Apple Developer Program。
2. 在 Xcode 里确认 `Bundle Identifier` 唯一，并把 Signing Team 设为你的付费开发者账号团队。
3. 在 App Store Connect 创建新 App，平台选 iOS，Bundle ID 选当前工程的 Bundle ID。
4. 准备 App 名称、副标题、描述、关键词、支持网址、隐私政策 URL、分类、年龄分级和截图。
5. 在 App Store Connect 填写 App Privacy。当前游戏如果不联网、不登录、不接广告/统计 SDK，通常可以按不收集数据申报；如果以后加统计、广告、账号、排行榜或云存档，需要按实际数据重新申报。
6. Xcode 选择 `Any iOS Device` 或真机，执行 `Product > Archive`。
7. Archive 完成后在 Organizer 里点 `Distribute App`，选择 App Store Connect 上传。
8. 等 build 在 App Store Connect 处理完成，选择该 build，补齐版本信息后提交审核。

上架前建议：

- 不要使用“俄罗斯方块 / Tetris”等可能涉及商标的名称、关键词、图标文案或宣传语。
- 确保所有游戏都能离线启动，不崩溃，暂停、重开、切换游戏都正常。
- 截图要直接展示真实玩法，不要只放封面。
- 如果只是自己和朋友玩，用 Xcode 真机安装或 TestFlight 更合适；公开上架需要接受完整审核。
