---
title: ""
date: YYYY-MM-DD
summary: ""
permalink: /briefs/YYYY-MM-DD/
tags: brief
layout: brief.njk
judgments:
  - group: systemic
    heading: 系统性
    label: ""
    tone: warning
    detail: ""
  - group: local
    heading: ""
    label: ""
    tone: danger
    detail: ""
alerts: []
---

复制本文件为 `src/briefs/YYYY-MM-DD.md` 后再填。正文只写这一期简报里已经有的事实和链接，不要另补数字。

`judgments` 里第一条 `group: systemic` 是系统性总评，第一条 `group: local` 是首页上的局部总评。其余判断继续往下加，`group` 用 `local` 或 `other`。`tone` 只用 `danger` 或 `warning`。

`alerts` 每条有 `title`、`text`、`tone`、`sources`。`sources` 里的链接必须和正文里的完全一致。

<nav class="toc" aria-label="本篇目录">
  <ol>
    <li><a href="#section-1">第一节标题</a></li>
  </ol>
</nav>

<h2 id="section-1">第一节标题</h2>

段落。链接写成 `<a href="https://...">https://...</a>`，地址原样粘贴。
