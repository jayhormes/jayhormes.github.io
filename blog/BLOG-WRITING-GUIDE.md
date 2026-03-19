# Astro Fuwari 寫作格式指南

> 主人專屬的 Blog 寫作格式手冊，整理自 fuwari 主題官方範例。

---

## 📋 Frontmatter 格式

```yaml
---
title: 文章標題
published: 2026-03-19
description: 文章描述摘要（SEO 重要）
image: /cover.jpg  # 封面圖（可留空）
tags: [測試, 程式]
category: 技術
draft: false  # true = 不發布
---
```

| 屬性 | 必填 | 說明 |
|------|------|------|
| `title` | ✅ | 文章標題 |
| `published` | ✅ | 發布日期 |
| `description` | ⚠️ | SEO 摘要，會出現在列表頁 |
| `image` | | 封面圖： `/public/圖片` 或 `https://...` |
| `tags` | | 標籤陣列 |
| `category` | | 分類 |
| `draft` | | `true` = 草稿不發布 |

---

## 🎨 程式碼區塊（Expressive Code）

### 基本語法 highlight
````markdown
```python
print("Hello World")
```
````

### 附檔名標題
````markdown
```js title="my-file.js"
console.log('test')
```
````

### Terminal 終端機框
````markdown
```bash
echo "Hello"
```
````

### 重點行標記（行號 / 範圍）
````markdown
```js {1, 3-5}
console.log('第一行')
console.log('第三到五行')
```
````

### 單字正則標記
````markdown
```ts /ye[sp]/
console.log('yes and yep 會被標記')
```
````

### 插入 / 刪除 標記
````markdown
```js "return true;" ins="插入" del="刪除"
```
````

### 折疊區塊（超長程式碼適用）
````markdown
```js collapse={1-5, 12-14}
# 這段會被折疊
engine.doSomething()
```
````

### 行號顯示
````markdown
```js showLineNumbers
console.log('有行號')
```
````

### 自動換行
````markdown
```js wrap
# 很長的程式碼會自動換行
```
````

---

## 📺 嵌入影片（YouTube / Bilibili）

### YouTube
```html
<iframe
  width="100%"
  height="468"
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="YouTube video player"
  frameborder="0"
  allowfullscreen>
</iframe>
```

### Bilibili
```html
<iframe
  width="100%"
  height="468"
  src="//player.bilibili.com/player.html?bvid=BV1fK4y1s7Qf"
  scrolling="no"
  frameborder="no"
  framespacing="0"
  allowfullscreen>
</iframe>
```

---

## 📦 GitHub Repository Card

```markdown
::github{repo="saicaca/fuwari"}
```

> 在文章中加入動態的 GitHub 卡片，資訊從 GitHub API 即時抓取。

---

## 📌 Admonitions（提示框）

### 基本語法
```markdown
:::note
內容
:::

:::tip
Optional information
:::

:::important
Crucial information
:::

:::warning
Critical warning
:::

:::caution
Negative consequences
:::
```

### 自訂標題
```markdown
:::note[我的自訂標題]
自訂內容
:::
```

### GitHub 語法（也是支援的）
```markdown
> [!TIP]
> GitHub 語法也適用
>
> [!NOTE]
> 多行也可以
```

---

## 📊 表格

frontmatter 的屬性格式（直接寫在 markdown 裡）：

```markdown
| Attribute     | Description                    |
|---------------|--------------------------------|
| `title`       | 文章標題                        |
| `published`   | 發布日期                        |
| `description` | 文章摘要，會出現在列表頁         |
| `image`       | 封面圖路徑                      |
| `tags`        | 標籤陣列                        |
| `category`    | 分類                            |
| `draft`        | 草稿旗標                        |
```

---

## 🖼️ 圖片

```markdown
![替代文字](./圖片路徑 "標題")
```

### 三種圖片路徑格式（frontmatter image 欄位）：
- `https://...` → 直接用網址
- `/cover.jpg` → 放在 `public/` 目錄
- `cover.png` → ，相對於 md 檔案位置

---

## 🔗 外部連結

外部連結會自動在新分頁開啟（`target="_blank"`），內部連結維持原分頁。

---

## 📝 文章命名規則（Slug）

**用英文 kebab-case**，不要用中文或中文拼音。

✅ `article-test`
❌ `文章測試`、`文章测试`

原因：中文 URL 分享後會變成一串 percent-encode，國際讀者體驗差。

---

## 🏷️ Trilium 寫作時的 Frontmatter

在 Trilium 文章最開頭用 HTML 註解寫 frontmatter：

```html
<!--
title: 文章標題
published: 2026-03-19
description: 文章描述摘要
tags: [測試, 程式]
category: 技術
-->

## 內文從這裡開始
...
```

莉莉會自動抓取這個格式轉換成 Astro md 檔。

---

## 🌐 多語系文章

- **預設語系**：繁體中文（`zh-tw`）→ URL 無前綴，如 `/posts/article-test/`
- **英文版**：`article-test.en.md` → URL 是 `/en/posts/article-test/`
- **日文版**：`article-test.ja.md` → URL 是 `/ja/posts/article-test/`
- **`lang` 欄位**：一般不用寫（預設就是 `zh-tw`）

---

*最後更新：2026-03-19*
