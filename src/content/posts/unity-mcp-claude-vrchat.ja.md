---
title: "Unity MCP × Claude：会話で進める VRChat 開発"
published: 2026-05-23
description: Claude にお願いするだけで、VRChat アバター改変の面倒な Unity 作業をこなしてもらう方法
tags: [VRChat, VR, Unity, AI, Claude, MCP]
category: テック
---

## TL;DR
Unity-MCP を使えば、VRChat アバター改変の面倒な作業を Claude との会話だけで完了させられます。

## はじめに

VRChat をしばらく遊んでいるうちに、アバター改変にも手を出すようになりました。Booth で衣装をいろいろ買ってきましたが、Unity に素材を読み込ませるだけでも沼が深く、扱いに困る場面が山ほどあります。

新しめの衣装は [Modular Avatar](https://modular-avatar.nadena.dev/) に対応していて比較的楽ですが、少し古いものになると Unity の `Prefab > Unpack Completely` でばらしてから、パーツを一つずつアバターのボーンへドラッグしていく必要があります。試行錯誤に費やす時間は、本当に一日や二日では済みません。

最近の AI ブームを見ていて、Claude のようなツールに任せられたら最高じゃないか、と思いついたのが今回のきっかけです。これまで手作業で組んでいた手順をひと通り Claude にやらせてみたところ、本当に会話だけで着せ替えを最後まで終えてくれました。途中で分からないことがあればその場で聞けるので学びにもなりますし、こんなに楽になるなら衣装を買うモチベーションもぐっと上がります www

## 手順

### Unity MCP のインストール

Unity の `Window > Package Manager > + > Add package from git URL...` を開き、以下を入力します：

`https://github.com/CoplayDev/unity-mcp.git?path=/MCPForUnity#main`

![記事画像](/images/unity-mcp-claude/01-mcp-register.png)

ダウンロードが終わったら、Unity の `Window > MCP for Unity > Toggle MCP Window` から MCP コントロールウィンドウを開きます。

![記事画像](/images/unity-mcp-claude/02-mcp-installed.png)

### Claude Skill のインストール

Toggle MCP Window を押すとコントロールパネルが表示されます。

Client は Claude Code を選び、Register と Install Skills をクリックしたあと、上部の Start Server を押します。

![記事画像](/images/unity-mcp-claude/03-mcp-toggle.png)

### Claude Code の起動

作業したいプロジェクトディレクトリに移動して Claude Code を起動し、`/mcp` を入力します。

UnityMCP が `connected` と表示されれば準備完了です。Unity を再起動するたびに MCP がきちんと接続できているか確認するのを忘れないようにしましょう。

![Claude Code MCP 接続状態](/images/unity-mcp-claude/04-claude-mcp-connect.png)

## 実践：Unity MCP で VRChat アバターを仕上げる

### 事前準備

1. VCC から基本パッケージをインポート
2. Unity を起動
3. Toggle MCP Window > Start Server
4. Claude Code を立ち上げて MCP の接続を確認

### ベースアバターと衣装アセットを置く

今回は [オリジナル3Ｄモデル「萌」](https://kyubihome.booth.pm/items/4667400) をベースに、ヘアスタイル（[サラサラポニテ](https://asapidock.booth.pm/items/4769426)）と衣装（[Lilas](https://booth.pm/zh-tw/items/5597157)）を加え、衣装切り替え用のメニューまで作るところまでやります。

今回使うヘアと衣装はいずれも Modular Avatar 対応版があらかじめ用意されていません。手動でやる場合の従来のやり方は、まず `Unpack Completely` でパーツのバインドをすべて解除し、各パーツをベースアバターのボーンに合わせながら一つずつ動作を確認していくというもの。何時間もかけた挙句、実際に動かしてみてからボーンが間違って繋がっていたことに気付く⋯本当に辛い作業です。

最近はこの面倒を肩代わりしてくれるプラグインも増えていますが（アバター改変の初心者がいちばん躓きやすいハードルなので当然ともいえます）、MCP のおかげでこういった操作を全部 AI に任せられるようになりました。初心者の方も AI とのやり取りを通じて十分に学んでいけますし、何も分からない状態のときはモデルやアセットの配置まで Claude にお願いしても大丈夫です。

今回は私が直接ドラッグして放り込みます。注意点として、**`Unpack Completely` は実行しない**でください。アセットはプレハブ（薄い水色）のままにしておきます。

![記事画像](/images/unity-mcp-claude/05-models-imported.jpg)

### ヘアスタイルを組み込む

ヘアをマージするタイミングでメニューも同時に整えたいので、こんな感じで一文のプロンプトとして自然に投げます：

> `AD_20_Pony_Moe` というヘアスタイルを Moe に組み込みたいです。メニューでの衣装切り替えを管理する単一コンポーネントもほしいので、ヘアの追加とメニューの作成までお願いします。

待つこと約 8 分⋯完成です！ヘアスタイルが入って、`lilycalinventory` のセットアップまで一気に終わりました：

```text
● 完了しました！設定サマリー：

  ヘアスタイル統合
  - AD_20_Pony_Moe を Moe 配下（Body、Hair などと同じ階層）に移動
  - AD_20_Pony_Moe/A_Hair_Pony/Hair_Base 1 に MA Bone Proxy を追加し、
    target = HumanBodyBones.Head、AsChildAtRoot に設定 — build 時に Moe の頭ボーンへ自動アタッチ

  ヘア切替コンポーネント (Moe/Hair Changer)
  - lilycalinventory の CostumeChanger を使用（単一コンポーネントで切替全体を管理）
  - menuName: "Hairstyle"、ラジアルサブメニューを自動生成
  - Costume 0 "Default"：Moe/Hair ON、AD_20_Pony_Moe OFF
  - Costume 1 "Pony Tail"：Moe/Hair OFF、AD_20_Pony_Moe ON
  - defaultValue = 0（デフォルトはオリジナルヘア）

  今後ヘアスタイルを追加したい場合
  1. 新しいヘアの prefab を Moe 配下にドラッグ。必要に応じて MA Bone Proxy で Head に接続
  2. Hair Changer の CostumeChanger.costumes に 1 行追加し、各ヘアの on/off を列挙するだけ
  3. menu/parameter アセットは触らなくて OK — lilycalinventory が build 時に自動生成

✻ Cogitated for 8m 40s
```

> 補足：Claude の実際の応答は繁体字中国語でした。上記ブロックは読みやすさのために日本語へ翻訳しています。

シーンに Gesture Manager を追加して Play を押してテストします：

![記事画像](/images/unity-mcp-claude/06-gesture-manager-added.png)

Hierarchy に薄い水色の Gesture Manager アセットが現れます。再生ボタンを押して Gesture Manager を選択すると、ゲーム内コントローラーのメニューをシミュレーションする画面が表示されます：

![記事画像](/images/unity-mcp-claude/07-gesture-menu.jpg)

Pony Tail を選んでヘアスタイルを切り替えます：

![記事画像](/images/unity-mcp-claude/08-hair-menu-pony.jpg)

Scene または Game ビューで外観が変わったことを確認できます。

デフォルトのヘアスタイル：

![記事画像](/images/unity-mcp-claude/09-hair-default.jpg)

切り替え後：

![記事画像](/images/unity-mcp-claude/10-hair-ponytail.jpg)

ヘアスタイルの統合が確認できました。

### 衣装を組み込む

衣装も同じく、追加と同時にメニューも整えてしまいたいので、似たようなノリでプロンプトを投げます：

> 同じやり方で、`Lilas_Moe` を衣装として追加してメニューも設定したいです。新しい衣装を着るときは、元の Underwear と Brassiere を隠す必要があります。

待つこと約 4 分⋯完成！衣装とメニューを一度に仕上げてくれました：

```text
● 完了。設定サマリー：

  Lilas_Moe 統合
  - Lilas_Moe を Moe 配下に移動
  - Lilas_Moe/Armature に MA Merge Armature を追加し、target = Armature、LockMode = BaseToMerge に設定
    - Lilas は全身一式の衣装（68 ボーン、Inner/Jacket/Pants/Shoes/Tshirts）なので、
      BoneProxy より MergeArmature の方が適切 — ボーン名で Moe のヒューマノイド骨格へ自動マージ

  Moe/Outfit Changer
  - 新規 CostumeChanger コンポーネント、menu name "Outfit"
  - 2 つの Costume、それぞれ 8 つの toggle を列挙して切替が干渉しないように：
    - Default：Lilas off / Underwear, Brassiere, Shirt, Outer, Skirt, Knee Socks, Shoes on
    - Lilas：Lilas on / Underwear, Brassiere, Shirt, Outer, Skirt, Knee Socks, Shoes off
  - Default = 0（Default の衣装）

  どこを隠すかについて
  指定されたのは Underwear + Brassiere だけでしたが、Lilas は全身一式（ジャケット + Tシャツ + パンツ + 靴）
  です。下着だけ消すと Shirt / Outer / Skirt / Knee Socks / Shoes と干渉して重なってしまうため、
  これらもまとめて切り替え対象にしました。後から組み合わせを残したい場合は、Lilas costume の toggler
  から該当項目を外せば OK です。

  今後新しい衣装を追加したい場合
  1. Moe 配下にドラッグして、全身衣装なら MA Merge Armature、単パーツなら MA Bone Proxy を適用
  2. Outfit Changer.costumes に Costume を 1 つ追加し、その衣装で on/off にしたいオブジェクトを列挙するだけ
```

> 補足：Claude の実際の応答は繁体字中国語でした。上記ブロックは読みやすさのために日本語へ翻訳しています。

衣装も同じく Gesture Manager で動作確認します。再生すると Outfit メニューが見えます：

![記事画像](/images/unity-mcp-claude/11-outfit-menu.jpg)

メニューに入って衣装を選びます：

![記事画像](/images/unity-mcp-claude/12-outfit-select.jpg)

デフォルトの衣装：

![記事画像](/images/unity-mcp-claude/13-outfit-default.jpg)

切り替え後：

![記事画像](/images/unity-mcp-claude/14-outfit-lilas.jpg)

### 完成

ここまでくれば、あとは VRChat SDK でテストするなり、アバターをアップロードして遊ぶなりお好みで。今回の Claude 使用量はこちら：

```text
Usage by model:
    claude-haiku-4-5:  988 input, 37 output, 0 cache read, 0 cache write ($0.0012)
     claude-opus-4-7:  1.5k input, 95.4k output, 15.8m cache read, 410.8k cache write ($12.88)
```

Booth で買ったアセットから自分用のアバターが遊べる状態になるまで、トータルで約 13 分でした。

## よくある質問

### Q: Unity を再起動したあと、Claude Code が Unity MCP に接続できません。どうすればいいですか？

A: 以下の順番で確認してください：

1. MCP for Unity ウィンドウで Server が Running、Session Active のグリーンが点灯しているか確認。必要なら **Stop Server** → **Start Server** で再起動
2. Claude Code で `/mcp` を実行し、UnityMCP が `connected` になっているか確認
3. それでもダメなら、ファイアウォールが `127.0.0.1:8080` を遮断していないか、Unity Console にポート競合のエラーが出ていないか確認
4. Unity 再起動後にセッション名がずれることがあるので、Toggle MCP Window をもう一度開くと自動で再接続します

### Q: Claude が勝手に `Unpack Completely` を実行しないようにするには？

A: プロンプトで明示的にお願いします。例えば：

> prefab は青いままに保ってください（`Unpack Completely` は実行しないでください）。Modular Avatar のスクリプトでアバターに繋いでもらえれば OK です。

こうすると Booth の素材がアップデートされたときも、古い prefab を新しいものに上書きするだけで更新を反映できます。もちろん MCP 経由で Claude に更新をお願いしてもよいです。

### Q: PhysBone はなぜまだ AI に任せられないの？

A: PhysBone は髪・衣装・アクセサリの揺れ物理シミュレーションで、人体構造とは関係ありません。難しいのは「Play Mode で実際の揺れを見ながら、Damping、Stiffness、Collider 半径など多数のパラメータを反復的に調整する」作業の部分です。今の AI は Game ビューの再生結果を見られないので、フィードバックを受けながら追い込むことができません。モデルが Play Mode の映像や VRChat 内の挙動を読めるようになれば、自動化の道が開けると思います。

### Q: アバター 1 体を着せ替えるのに、トークンはどれくらいかかる？

A: 記事の今回のフロー（ヘア + 衣装 + メニュー 2 つ）で約 **$12.88 USD** でした。内訳は Opus 4.7 の 95.4k output と 15.8m cache reads がメインです。コストを抑えるコツ：

- 単純な作業は Sonnet 4.6 / Haiku 4.5 に切り替え（速くて安い）
- 複雑な構造マージのときだけ Opus に戻す
- 一度のプロンプトで目的を全部伝え、行き来による cache write の積み上げを避ける

## おわりに

ここまでくれば一通り使える状態です。Claude Code に細かい Unity 作業を任せられるのは本当に便利で、今後モデルがさらに強くなれば PhysBone のセットアップまで頼める日が来るかもしれません。

## 参考資料
- [Unity MCP GitHub](https://github.com/CoplayDev/unity-mcp)
- [Modular Avatar](https://modular-avatar.nadena.dev/)
