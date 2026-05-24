---
title: Unity MCP × Claude：對話式 VRChat 開發
published: 2026-05-23
description: 透過 Claude 協助 VRChat 玩家處理 Unity 繁瑣的操作
tags: [VRChat, VR, Unity, AI, Claude, MCP]
category: 技術
---

## TL;DR
透過 Unity-MCP 讓 Claude 以對話方式完成繁瑣的 VRChat Avatar 修改操作

## 前言

玩 VRChat 一段時間後開始嘗試改模，買了不少 Booth 商品，但僅僅是把外觀素材載入 Unity 就有超級多坑要處理。

像是比較新潮的衣服外觀支援 [Modular Avatar](https://modular-avatar.nadena.dev/)，比較舊一點的則要先用 Unity 裡的 `Prefab > Unpack Completely`，再一個一個拖動部位到主模型的節點上，一來一回測試花掉的時間真的不是一天兩天。

最近 AI 熱潮就讓我想到，如果用 Claude 等工具幫忙不就好了嗎？於是把之前手刻模型的流程實際走一遍，結果真的完全用對話完成了模型穿衣。過程中遇到不懂的地方可以即時發問，學到的東西也不少 — 光是簡單穿衣這件事情就讓我對買衣服更有動力了 XDDD

## 操作流程

### 安裝 Unity MCP

打開 Unity 的 `Window > Package Manager > + > Add package from git URL...`，輸入：

`https://github.com/CoplayDev/unity-mcp.git?path=/MCPForUnity#main`

![文章圖](/images/unity-mcp-claude/01-mcp-register.png)

新增後等待下載完成，到 Unity 的 `Window > MCP for Unity > Toggle MCP Window` 打開 MCP 控制視窗。

![文章圖](/images/unity-mcp-claude/02-mcp-installed.png)

### 安裝 Claude Skill

點開 Toggle MCP Window 後會顯示控制面板。

Client 選擇 Claude Code，點選 Register 與 Install Skills，之後再到上方點選 Start Server。

![文章圖](/images/unity-mcp-claude/03-mcp-toggle.png)

### 啟動 Claude Code

切換到你要操作的專案目錄下開啟 Claude Code，輸入 `/mcp`。

看到 UnityMCP 顯示為 `connected` 就代表可以使用了。要特別注意每次重啟 Unity 後都要確認 MCP 有正確連線。

![Claude Code MCP 連線狀態](/images/unity-mcp-claude/04-claude-mcp-connect.png)

## 實際操作：透過 Unity MCP 完成 VRChat Avatar 換裝

### 完成前置動作

1. VCC 匯入基本套件
2. 開啟 Unity
3. Toggle MCP Window > Start Server
4. 開啟 Claude Code 確認 MCP 連線

### 放入基礎模型與要穿著的衣服

這邊用 [オリジナル3Ｄモデル「萌」](https://kyubihome.booth.pm/items/4667400) 做示範，預計加入一個髮型（[サラサラポニテ](https://asapidock.booth.pm/items/4769426)）、一套衣服（[Lilas](https://booth.pm/zh-tw/items/5597157)），並完成換裝選單。

示範用的髮型與服裝都沒有預配置 Modular Avatar 對應。如果手動操作，以往的做法會先做一次 Unpack Completely 把所有部件解除綁定，然後一個一個對齊基礎模型的骨架、核對動作。動輒花上好幾個小時，實測時才發現骨架綁錯，真的非常辛苦。

現在雖然已經有不少插件可以協助處理這些麻煩事（畢竟這就是新手入坑最難的坎），但有了 MCP 之後，這些操作都能直接交給 AI 幫忙。新手也可以透過跟 AI 問答的過程充分學習，什麼都不懂時甚至可以用問答方式請 Claude 幫你放置模型或 Asset。

這邊我就直接拖入模型，注意**不需要** `Unpack Completely`，讓這些 Asset 維持淡藍色即可。

![文章圖](/images/unity-mcp-claude/05-models-imported.jpg)

### 處理髮型

因為我想要合併髮型的時候就同時把選單建立好，所以我會這樣下 Prompt，自然描述需求即可：

> 有一個 AD_20_Pony_Moe 的髮型要加入 Moe，我希望可以有一個元件來管理方便進行選單換衣。請幫我加入髮型並且建立選單

等待⋯完成了！總共花費八分鐘左右，換上了髮型還有 lilycalinventory：

```text
● 完成！設定總結：

  髮型整合
  - AD_20_Pony_Moe 已搬到 Moe 底下（與 Body、Hair 等同層）
  - AD_20_Pony_Moe/A_Hair_Pony/Hair_Base 1 加上 MA Bone Proxy，target = HumanBodyBones.Head、
    AsChildAtRoot，build 時會自動接到 Moe 頭骨

  換髮元件 (Moe/Hair Changer)
  - 用 lilycalinventory 的 CostumeChanger（單一元件管理整個切換）
  - menuName: "Hairstyle"，自動產生 radial 子選單
  - Costume 0 "Default"：Moe/Hair ON、AD_20_Pony_Moe OFF
  - Costume 1 "Pony Tail"：Moe/Hair OFF、AD_20_Pony_Moe ON
  - defaultValue = 0（預設原髮型）

  未來新增髮型
  1. 把新髮型 prefab 拖到 Moe 底下，視需要加 MA Bone Proxy 接 Head
  2. 在 Hair Changer 的 CostumeChanger.costumes 加一筆，列出所有髮型的 on/off 狀態即可
  3. 不用碰 menu/parameter asset — lilycalinventory 會在 build 時自動生成

✻ Cogitated for 8m 40s
```

加入 Gesture Manager 後按下 Play 來測試：

![文章圖](/images/unity-mcp-claude/06-gesture-manager-added.png)

Hierarchy 會出現一個淡藍色的 Asset 叫做 Gesture Manager，點上方播放再點選這個 Asset，就能看到模擬遊戲控制的選單：

![文章圖](/images/unity-mcp-claude/07-gesture-menu.jpg)

點選 Pony Tail 更換髮型：

![文章圖](/images/unity-mcp-claude/08-hair-menu-pony.jpg)

從 Scene 或 Game 視窗都能看到模型外觀變更成功。

預設髮型：

![文章圖](/images/unity-mcp-claude/09-hair-default.jpg)

切換髮型後：

![文章圖](/images/unity-mcp-claude/10-hair-ponytail.jpg)

確認加入髮型成功。

### 處理服裝

同樣想在加入服裝的時候一起把選單建好，直觀地下 Prompt：

> 相同的方法，我需要將 Lilas_Moe 加入服裝並且設定選單可以，要注意套用新服裝的時候原本的 Underwear 與 Brassiere 需要隱藏

等待⋯完成！耗時四分鐘左右，服裝與選單一次完成：

```text
● 完成。設定總結：

  Lilas_Moe 整合
  - Lilas_Moe 搬到 Moe 底下
  - Lilas_Moe/Armature 加上 MA Merge Armature，target = Armature、LockMode = BaseToMerge
    - 因為 Lilas 是整套全身服裝（68 根骨頭、Inner/Jacket/Pants/Shoes/Tshirts），用 MergeArmature
      讓骨架自動對名稱合進 Moe 的人形骨架（比 BoneProxy 適合）

  Moe/Outfit Changer
  - 新加的 CostumeChanger 元件、menu name "Outfit"
  - 兩個 Costume，每個都列了 8 個 toggle 確保切換乾淨：
    - Default：Lilas off / Underwear, Brassiere, Shirt, Outer, Skirt, Knee Socks, Shoes on
    - Lilas：Lilas on / Underwear, Brassiere, Shirt, Outer, Skirt, Knee Socks, Shoes off
  - 預設 = 0（Default 套裝）

  關於要隱藏哪些
  你只點名 Underwear+Brassiere，但 Lilas 是全身一套（外套+T恤+褲子+鞋），如果只關內衣會跟
  Shirt/Outer/Skirt/Knee Socks/Shoes 衝突重疊。所以我把這些都一起切換掉。如果你之後想保留某幾件可自由
  搭配，把那項從 Lilas costume 的 toggler 移除即可。

  之後要加新服裝
  1. 拖到 Moe 底下，套相應的 MA Merge Armature（整套服裝）或 MA Bone Proxy（單部件）
  2. 在 Outfit Changer.costumes 加一筆 Costume，列出該套要 on/off 的物件即可
```

一樣用 Gesture Manager 測試。播放後可以看到 Outfit 選單：

![文章圖](/images/unity-mcp-claude/11-outfit-menu.jpg)

進去選擇服裝：

![文章圖](/images/unity-mcp-claude/12-outfit-select.jpg)

預設服裝：

![文章圖](/images/unity-mcp-claude/13-outfit-default.jpg)

切換服裝後：

![文章圖](/images/unity-mcp-claude/14-outfit-lilas.jpg)

### 完工

接下來透過 VRChat SDK 測試或上傳 Avatar 就能愉快遊玩了。本次 Claude 的消耗如下：

```text
Usage by model:
    claude-haiku-4-5:  988 input, 37 output, 0 cache read, 0 cache write ($0.0012)
     claude-opus-4-7:  1.5k input, 95.4k output, 15.8m cache read, 410.8k cache write ($12.88)
```

耗時約 13 分鐘，從 Booth 購買的素材就能變成一隻屬於自己的 Avatar 開始遊玩。

## 常見問題

### Q: 重啟 Unity 後 Claude Code 連不上 Unity MCP 怎麼辦？

A: 按這個順序檢查：

1. MCP for Unity 視窗確認 Server 狀態為 Running、Session Active 綠燈亮起；必要時點 **Stop Server** 再 **Start Server**
2. 在 Claude Code 輸入 `/mcp`，確認 UnityMCP 顯示為 `connected`
3. 若仍失敗，檢查防火牆是否擋住 `127.0.0.1:8080`，或 Unity Console 是否有 port 衝突訊息
4. Unity 重啟後 session 名稱有時會跑掉，重新點 Toggle MCP Window 就會自動重連

### Q: 怎麼避免 Claude 自作主張把 Asset 做 Unpack Completely？

A: 在 Prompt 裡明確要求保留 prefab 狀態。例如：

> 請保持原 prefab 為藍色（不要 Unpack Completely），透過 Modular Avatar 的腳本接到主模型即可。

這也讓未來 Booth 商品有更新時，只要把舊版 prefab 覆蓋成新版就能套用更新。當然你也可以用 MCP 請 Claude 幫你更新。

### Q: PhysBone 為什麼 AI 還不能代勞？

A: PhysBone 是頭髮、衣裝、飾品的物理擺動模擬，跟人體結構無關。難點在於需要在 Play Mode 看著實際擺盪行為，反覆調整 Damping、Stiffness、Collider 半徑等繁多參數。目前 AI 看不到 Game 視窗的動畫結果，所以沒辦法靠回饋來收斂。等到模型能讀 Play Mode 畫面或 VRChat 內畫面，這部分才有機會自動化。

### Q: 換一隻 Avatar 大概要花多少 Token / 成本？

A: 本文這次完整流程（髮型 + 衣裝 + 兩個選單）約 **$12.88 USD**，大頭是 Opus 4.7 的 95.4k output 與 15.8m cache reads。可以這樣壓低成本：

- 單純動作用 Sonnet 4.6 / Haiku 4.5（速度快、成本低）
- 複雜結構合併時再切回 Opus
- 一次 Prompt 把整個目標講清楚，減少來回確認累積的 cache write

## 結語
做到這邊就大功告成了，能透過 Claude Code 輔助處理那些瑣碎的步驟真的非常方便，期待後續模型能力增強之後，連 PhysBone 綁定都能幫忙完成。

## 參考資料
- [Unity MCP GitHub](https://github.com/CoplayDev/unity-mcp)
- [Modular Avatar](https://modular-avatar.nadena.dev/)