---
layout: page
permalink: /publications/
title: 论文成果
description: "Publications confirmed from public author, publisher, and institutional records."
nav: true
nav_order: 3
---

完整论文条目由 BibTeX 自动生成。作者身份可交叉查阅 [Google Scholar](https://scholar.google.com/citations?user=dpISYowAAAAJ) 与 [ORCID](https://orcid.org/0000-0003-0748-4346)。

## 第一作者（含导师 1 位、学生 2 位）及通讯作者论文

<div class="publications">

{% bibliography --query @*[classification=first_or_corresponding] %}

</div>

## 合作论文

<div class="publications">

{% bibliography --query @*[classification=collaborative] %}

</div>
