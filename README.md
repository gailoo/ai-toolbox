# AI Toolbox — 全栈链路 AI 产品导航站

一个聚焦互联网全栈开发链路的 AI 产品导航站。当前收录 40 款 AI 产品、80 条全球 AI 行业资讯、8 篇 AI 入门知识文档，覆盖产品导航、行业动态和学习资料三大板块。

## 当前能力

- 首页：搜索框、分类筛选、产品卡片网格、统计信息
- 分类页：按 8 大链路分类浏览
- 产品详情页：擅长 / 不擅长、标签、官网链接、同分类推荐
- AI资讯页：聚合全球公开 RSS AI 新闻源，支持搜索、来源筛选、地区筛选和标签筛选
- AI知识页：AI 入门知识学习路径，覆盖 AI 基础、LLM、Prompt、RAG、Agent、多模态、工具选型和安全评估
- 内容管理：产品与知识文档都使用 MDX 文件管理，方便持续更新
- 本地构建：静态站点，可直接部署到 Vercel / GitHub Pages / 任意静态托管

## 项目结构

```text
ai-toolbox/
├── scripts/
│   └── fetch-ai-news.mjs        # AI资讯 RSS 抓取脚本
├── src/
│   ├── data/news.json           # 抓取后的 AI资讯数据
│   ├── content/products/        # 产品内容库，每个产品一个 .mdx
│   ├── content/learn/           # AI知识文档，每篇文章一个 .mdx
│   ├── pages/
│   │   ├── index.astro          # 首页
│   │   ├── categories.astro     # 分类页
│   │   ├── news.astro           # AI资讯页
│   │   ├── learn.astro          # AI知识列表页
│   │   ├── learn/[slug].astro   # AI知识详情页
│   │   ├── about.astro          # 关于页
│   │   └── products/[slug].astro# 产品详情页
│   ├── components/              # ProductCard / FilterTag 等组件
│   ├── layouts/                 # 全局布局
│   └── styles/                  # 全局样式
├── public/                      # favicon 等静态资源
└── dist/                        # 构建产物
```

## 本地运行

> 当前项目要求 Node.js >= 22.12.0。

```bash
cd /Users/jiaalezhang/WorkBuddy/2026-05-25-19-37-33/ai-toolbox
PATH="/Users/jiaalezhang/.workbuddy/binaries/node/versions/22.12.0/bin:$PATH" npm run dev -- --host 127.0.0.1 --port 4321
```

打开：<http://127.0.0.1:4321>

## 刷新 AI 资讯

AI 资讯来自公开 RSS 源，包括 TechCrunch AI、MIT Technology Review AI、The Decoder、VentureBeat AI、Google AI Blog、Hugging Face Blog 等。

```bash
cd /Users/jiaalezhang/WorkBuddy/2026-05-25-19-37-33/ai-toolbox
PATH="/Users/jiaalezhang/.workbuddy/binaries/node/versions/22.12.0/bin:$PATH" npm run fetch:news
```

生成文件：

```text
src/data/news.json
```

## 构建静态站点

```bash
cd /Users/jiaalezhang/WorkBuddy/2026-05-25-19-37-33/ai-toolbox
PATH="/Users/jiaalezhang/.workbuddy/binaries/node/versions/22.12.0/bin:$PATH" npm run build
```

构建成功后，静态文件会输出到：

```text
/Users/jiaalezhang/WorkBuddy/2026-05-25-19-37-33/ai-toolbox/dist
```

## 如何新增产品

在 `src/content/products/` 下新增一个 `.mdx` 文件，例如 `new-product.mdx`：

```mdx
---
name: 产品名
vendor: 厂商名
category: chat
# 可选值：chat / ide / ui / agent / media / search / data / audio
tags: ["标签1", "标签2"]
pros:
  - 擅长点 1
  - 擅长点 2
cons:
  - 不擅长点 1
  - 不擅长点 2
pricing: freemium
# 可选值：free / freemium / paid / open-source
website: https://example.com
order: 80
updatedAt: "2026-05-25"
---

这里写 1-2 段产品简介。
```

保存后重新运行 `npm run dev` 或 `npm run build` 即可。

## 如何新增 AI 知识文章

在 `src/content/learn/` 下新增一个 `.mdx` 文件，例如 `new-guide.mdx`：

```mdx
---
title: 文章标题
description: 文章摘要
level: beginner
# 可选值：beginner / intermediate / advanced
category: foundation
# 可选值：foundation / prompt / rag / agent / multimodal / tools / safety
tags: ["标签1", "标签2"]
readingTime: 6 分钟
order: 9
updatedAt: "2026-05-25"
---

正文内容...
```

## 产品分类说明

| category | 页面显示 | 说明 |
|---|---|---|
| `chat` | 对话大模型 | ChatGPT / Claude / Gemini / Kimi 等 |
| `ide` | 代码 IDE | Cursor / CodeBuddy / Copilot 等 |
| `ui` | UI 前端 | v0 / Bolt.new / Figma AI 等 |
| `agent` | Agent 编排 | WorkBuddy / Coze / Dify / n8n 等 |
| `media` | 图片视频 | Midjourney / Sora / Runway 等 |
| `search` | 搜索知识 | Perplexity / 秘塔 / NotebookLM 等 |
| `data` | 数据分析 | Julius AI / Rows / Copilot 等 |
| `audio` | 音频音乐 | ElevenLabs / Suno / Udio 等 |

## 后续可扩展方向

- 增加「收藏 / 推荐指数 / 适用人群」字段
- 增加产品对比页，例如 Cursor vs CodeBuddy vs Copilot
- 增加 AI 资讯定时刷新任务
- 增加 AI 知识学习进度和章节导航
- 增加月度更新日志
- 增加站内标签页
- 绑定 `.dev` 域名并部署到 Vercel
