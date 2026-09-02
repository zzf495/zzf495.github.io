import fs from "node:fs/promises";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const OUT = "E:/OneDrive/codes/ZZF_CV/2025本科入学教育_重新排版.pptx";
const WORK = "E:/OneDrive/codes/ZZF_CV/ppt_relayout_work";
const COVER = `${WORK}/assets/ai-campus-cover.png`;
const W = 1280;
const H = 720;
const M = 64;
const FONT = "Microsoft YaHei";
const C = {
  navy: "#062D58",
  blue: "#0067B1",
  cyan: "#0EA5E9",
  pale: "#EFF7FD",
  pale2: "#E5F2FC",
  ink: "#102A43",
  grey: "#486581",
  line: "#BFD4E6",
  gold: "#E9A93A",
  red: "#B42318",
  white: "#FFFFFF",
};

async function writeBlob(path, blob) {
  await fs.writeFile(path, new Uint8Array(await blob.arrayBuffer()));
}

function rect(slide, x, y, w, h, fill, radius = 0, line = "none", shadow = undefined) {
  const shape = slide.shapes.add({
    geometry: radius ? "roundRect" : "rect",
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: { style: "solid", fill: line, width: line === "none" ? 0 : 1 },
    borderRadius: radius || undefined,
    shadow,
  });
  return shape;
}

function t(slide, value, x, y, w, h, options = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = value;
  shape.text.style = {
    typeface: FONT,
    fontSize: options.size ?? 34,
    bold: options.bold ?? false,
    color: options.color ?? C.ink,
    alignment: options.align ?? "left",
    verticalAlignment: options.valign ?? "top",
    lineSpacing: options.lineSpacing ?? 1.12,
    wrap: "square",
    autoFit: "none",
    insets: options.insets ?? { top: 0, right: 0, bottom: 0, left: 0 },
  };
  return shape;
}

function base(slide, title, section) {
  slide.background.fill = C.white;
  rect(slide, 0, 0, W, 12, C.navy);
  t(slide, section, M, 28, 300, 38, { size: 32, bold: true, color: C.blue });
  t(slide, title, M, 74, 950, 60, { size: 46, bold: true, color: C.navy });
  rect(slide, M, 145, W - M * 2, 3, C.blue);
  rect(slide, W - 94, 30, 30, 30, C.gold, 15);
}

function sectionSlide(presentation, number, title, subtitle, accent = C.blue) {
  const slide = presentation.slides.add();
  slide.background.fill = C.navy;
  rect(slide, 0, 0, W, H, C.navy);
  rect(slide, 0, 0, 20, H, accent);
  t(slide, number, 70, 96, 350, 150, { size: 132, bold: true, color: "#FFFFFF/18" });
  rect(slide, 74, 288, 144, 10, accent, 5);
  t(slide, title, 70, 330, 980, 84, { size: 66, bold: true, color: C.white });
  t(slide, subtitle, 74, 438, 1030, 90, { size: 36, color: "#DCEEFF", lineSpacing: 1.2 });
  return slide;
}

function bulletList(slide, items, x, y, w, lineH = 68, accent = C.blue, size = 34) {
  items.forEach((item, i) => {
    rect(slide, x, y + i * lineH + 12, 14, 14, accent, 7);
    t(slide, item, x + 30, y + i * lineH, w - 30, lineH - 2, { size, color: C.ink, lineSpacing: 1.1 });
  });
}

function metric(slide, x, y, w, h, value, label, accent = C.blue) {
  rect(slide, x, y, w, h, C.pale, 18, C.line);
  t(slide, value, x + 22, y + 16, w - 44, 54, { size: 48, bold: true, color: accent, align: "center" });
  t(slide, label, x + 22, y + 82, w - 44, h - 92, { size: 32, color: C.grey, align: "center", valign: "middle" });
}

function card(slide, x, y, w, h, heading, body, accent = C.blue, options = {}) {
  rect(slide, x, y, w, h, C.white, 18, C.line, options.shadow ? "shadow-sm" : undefined);
  rect(slide, x, y, 12, h, accent, 6);
  if (h <= 120) {
    t(slide, heading, x + 28, y + 18, Math.min(200, w - 80), h - 36, { size: options.headingSize ?? 32, bold: true, color: accent, valign: "middle" });
    t(slide, body, x + 230, y + 18, Math.max(40, w - 258), h - 36, { size: options.bodySize ?? 32, color: C.ink, valign: "middle", lineSpacing: options.lineSpacing ?? 1.1 });
  } else {
    t(slide, heading, x + 28, y + 20, w - 52, 44, { size: options.headingSize ?? 34, bold: true, color: accent });
    t(slide, body, x + 28, y + 76, w - 52, Math.max(30, h - 90), { size: options.bodySize ?? 32, color: C.ink, lineSpacing: options.lineSpacing ?? 1.1 });
  }
}

function roadmap(slide, labels, y = 278, colors = [C.blue, C.cyan, C.gold, C.blue, C.cyan]) {
  const gap = 22;
  const start = 74;
  const total = W - 148;
  const boxW = (total - gap * (labels.length - 1)) / labels.length;
  const nodes = [];
  labels.forEach((label, i) => {
    const x = start + i * (boxW + gap);
    const node = rect(slide, x, y, boxW, 130, C.pale, 18, C.line);
    nodes.push(node);
    t(slide, `${i + 1}`, x + 20, y + 16, 44, 42, { size: 32, bold: true, color: colors[i % colors.length] });
    t(slide, label, x + 22, y + 64, boxW - 44, 48, { size: 32, bold: true, color: C.ink, align: "center", valign: "middle" });
  });
  for (let i = 0; i < nodes.length - 1; i++) {
    slide.shapes.connect(nodes[i], nodes[i + 1], {
      kind: "straight",
      fromSide: "right",
      toSide: "left",
      line: { style: "solid", fill: C.blue, width: 3 },
      head: { type: "triangle", width: "sm", length: "sm" },
    });
  }
}

function creditColumn(slide, x, heading, items, color = C.blue) {
  t(slide, heading, x, 202, 510, 46, { size: 38, bold: true, color });
  items.forEach((item, i) => {
    const y = 260 + i * 58;
    rect(slide, x, y, 520, 48, i % 2 === 0 ? C.pale : C.white, 10, C.line);
    t(slide, item[0], x + 18, y + 6, 340, 36, { size: 32, color: C.ink });
    t(slide, item[1], x + 368, y + 6, 132, 36, { size: 32, bold: true, color, align: "right" });
  });
}

function creditsSlide(presentation, title, section, theory, practice, conclusion) {
  const slide = presentation.slides.add();
  base(slide, title, section);
  creditColumn(slide, 78, "课内理论教学（含课内实践）", theory, C.blue);
  creditColumn(slide, 682, "课内独立实践教学", practice, C.cyan);
  rect(slide, 78, 622, 1124, 52, C.navy, 12);
  t(slide, conclusion, 96, 632, 1088, 34, { size: 32, bold: true, color: C.white, align: "center" });
}

function teamSlide(presentation, title, section, rows, pageLabel) {
  const slide = presentation.slides.add();
  base(slide, title, section);
  t(slide, pageLabel, 954, 83, 250, 38, { size: 32, bold: true, color: C.grey, align: "right" });
  const rowH = rows.length === 3 ? 154 : rows.length === 4 ? 116 : 100;
  rows.forEach((r, i) => {
    const y = 182 + i * (rowH + 13);
    rect(slide, 78, y, 1124, rowH, i % 2 === 0 ? C.pale : C.white, 14, C.line);
    t(slide, r.course, 102, y + 20, 304, rowH - 40, { size: 32, bold: true, color: C.navy, valign: "middle" });
    t(slide, r.lead, 424, y + 20, 224, rowH - 40, { size: 32, bold: true, color: C.blue, valign: "middle" });
    t(slide, r.members || "课程组成员见培养安排", 672, y + 18, 500, rowH - 36, { size: 32, color: C.ink, valign: "middle", lineSpacing: 1.1 });
  });
  t(slide, "课程名称", 102, 150, 304, 30, { size: 32, bold: true, color: C.grey });
  t(slide, "课程组组长", 424, 150, 224, 30, { size: 32, bold: true, color: C.grey });
  t(slide, "课程组成员", 672, 150, 500, 30, { size: 32, bold: true, color: C.grey });
}

function coreOverview(presentation, title, section, entries) {
  const slide = presentation.slides.add();
  base(slide, title, section);
  const colW = 535;
  entries.forEach((e, i) => {
    const col = i < Math.ceil(entries.length / 2) ? 0 : 1;
    const j = col === 0 ? i : i - Math.ceil(entries.length / 2);
    const x = 78 + col * 590;
    const y = 180 + j * 72;
    rect(slide, x, y, colW, 58, j % 2 === 0 ? C.pale : C.white, 12, C.line);
    t(slide, e[0], x + 14, y + 10, 300, 38, { size: 32, bold: true, color: C.navy });
    t(slide, e[1], x + 326, y + 10, 195, 38, { size: 32, color: C.blue, align: "right" });
  });
  rect(slide, 78, 616, 1124, 56, C.navy, 12);
  t(slide, "课程组围绕基础能力、系统能力与工程实践协同建设。", 96, 628, 1088, 36, { size: 32, bold: true, color: C.white, align: "center" });
}

function developmentSlide(presentation, title, events, pageLabel) {
  const slide = presentation.slides.add();
  base(slide, title, "专业介绍");
  t(slide, pageLabel, 986, 83, 218, 38, { size: 32, bold: true, color: C.grey, align: "right" });
  events.forEach((e, i) => {
    const x = 80 + (i % 2) * 580;
    const y = 202 + Math.floor(i / 2) * 212;
    rect(slide, x, y, 540, 176, C.white, 18, C.line);
    rect(slide, x, y, 540, 16, i % 2 === 0 ? C.blue : C.cyan, 8);
    t(slide, e[0], x + 24, y + 38, 156, 46, { size: 40, bold: true, color: C.blue });
    t(slide, e[1], x + 24, y + 98, 480, 60, { size: 34, color: C.ink, lineSpacing: 1.08 });
  });
  return slide;
}

function simpleConclusion(slide, textValue, accent = C.gold) {
  rect(slide, 78, 600, 1124, 68, C.pale2, 14, C.line);
  rect(slide, 78, 600, 14, 68, accent, 7);
  t(slide, textValue, 112, 616, 1054, 38, { size: 32, bold: true, color: C.navy, align: "center" });
}

async function main() {
  const presentation = Presentation.create({ slideSize: { width: W, height: H } });

  // 1. Cover
  {
    const slide = presentation.slides.add();
    slide.background.fill = C.navy;
    const coverBytes = await fs.readFile(COVER);
    slide.images.add({
      blob: coverBytes.buffer.slice(coverBytes.byteOffset, coverBytes.byteOffset + coverBytes.byteLength),
      contentType: "image/png",
      alt: "Abstract academic artificial intelligence and campus background",
      fit: "cover",
      position: { left: 0, top: 0, width: W, height: H },
    });
    rect(slide, 0, 0, 590, H, "#062D58/76");
    rect(slide, 70, 142, 150, 10, C.gold, 5);
    t(slide, "2025 本科入学教育", 70, 194, 460, 55, { size: 42, bold: true, color: "#DDEEFF" });
    t(slide, "专业介绍、学习与建议", 70, 274, 490, 132, { size: 66, bold: true, color: C.white, lineSpacing: 1.02 });
    t(slide, "先进制造学院 · 人工智能与信息工程系", 70, 454, 470, 48, { size: 34, color: "#DDEEFF" });
    t(slide, "滕少华 教授 · 博士生 / 硕士生导师", 70, 534, 470, 44, { size: 32, color: "#DDEEFF" });
  }

  // 2. Agenda
  {
    const slide = presentation.slides.add();
    base(slide, "从适应大学到规划专业成长", "入学教育");
    const items = [
      ["01", "大学之学", "从监督式学习走向自主学习"],
      ["02", "专业介绍", "认识三个专业的培养方向与出口"],
      ["03", "专业学习", "建立课程主线、实践习惯与资源意识"],
      ["04", "几点建议", "让学习、生活与纪律共同支撑成长"],
    ];
    items.forEach((item, i) => {
      const x = 78 + (i % 2) * 566;
      const y = 204 + Math.floor(i / 2) * 184;
      rect(slide, x, y, 536, 150, C.pale, 18, C.line);
      t(slide, item[0], x + 24, y + 26, 78, 54, { size: 42, bold: true, color: C.cyan });
      t(slide, item[1], x + 120, y + 24, 360, 45, { size: 38, bold: true, color: C.navy });
      t(slide, item[2], x + 120, y + 86, 370, 42, { size: 32, color: C.grey });
    });
    simpleConclusion(slide, "入学不是被动适应，而是主动建立自己的学习系统。", C.gold);
  }

  // 3. Welcome snapshot
  {
    const slide = presentation.slides.add();
    base(slide, "欢迎新同学：三个专业共同启航", "大学之学");
    const rows = [
      ["计算机科学与技术", "4 个班 · 158 人", "省内排位：31427–46713"],
      ["人工智能", "4 个班 · 158 人", "省内排位：38002–49368"],
      ["电子信息工程", "2 个班 · 81 人", "省内排位：35975–46145"],
    ];
    rows.forEach((r, i) => {
      const y = 202 + i * 120;
      rect(slide, 80, y, 1120, 92, i === 1 ? C.pale2 : C.white, 15, C.line);
      rect(slide, 80, y, 20, 92, [C.blue, C.cyan, C.gold][i], 10);
      t(slide, r[0], 124, y + 24, 380, 44, { size: 36, bold: true, color: C.navy });
      t(slide, r[1].replace(" 个班 · ", "班 / "), 510, y + 27, 296, 40, { size: 32, bold: true, color: C.blue, align: "center" });
      t(slide, "省内排位", 842, y + 11, 322, 32, { size: 32, color: C.grey, align: "right" });
      t(slide, r[2].replace("省内排位：", ""), 842, y + 49, 322, 32, { size: 32, color: C.grey, align: "right" });
    });
    t(slide, "揭阳校区：文昌村旁、神龙镇内、鳌头山下，知识聚宝盆内。", 82, 580, 1114, 44, { size: 34, color: C.ink, align: "center" });
  }

  // 4. Graduate outcomes
  {
    const slide = presentation.slides.add();
    base(slide, "2021 级毕业生：升学与就业并行", "大学之学");
    card(slide, 78, 194, 536, 320, "计算机科学与技术", "保研 6 人 · 考本校 13 人 · 考外校 4 人\n调剂 2 人 · 出国升学 9 人\n考公务员 1 人 · 签约 7 人", C.blue, { bodySize: 34, lineSpacing: 1.25 });
    card(slide, 666, 194, 536, 320, "电子信息工程", "保研 3 人 · 考本校 4 人 · 考外校 4 人\n调剂 3 人 · 出国升学 2 人", C.cyan, { bodySize: 34, lineSpacing: 1.3 });
    simpleConclusion(slide, "大学四年可以通向深造、就业、创业与国际化发展；方向由能力积累决定。", C.gold);
  }

  // 5. Difference
  {
    const slide = presentation.slides.add();
    base(slide, "大学学习的关键变化：从“被安排”到“自我管理”", "大学之学");
    const data = [
      ["教学内容", "基础型 → 专业型", "中小学以统一大纲、统一知识点为主；大学进入专业教育。"],
      ["学习方法", "监督型 → 自主型", "内容更多，教师讲重点难点；课外时间需要自己规划。"],
      ["学习目标", "升学 → 专业能力", "不仅是继续升学，更要形成专业知识、技能与责任感。"],
    ];
    data.forEach((r, i) => card(slide, 80 + i * 374, 210, 346, 310, r[0], `${r[1]}\n\n${r[2]}`, [C.blue, C.cyan, C.gold][i], { bodySize: 32, headingSize: 36, lineSpacing: 1.18 }));
    simpleConclusion(slide, "主动学习不是“独自学习”，而是会规划、会求助、会复盘。", C.gold);
  }

  // 6. Learning evolution
  {
    const slide = presentation.slides.add();
    base(slide, "学习方式会随着成长不断升级", "大学之学");
    roadmap(slide, ["幼儿园\n玩中学", "小学\n标准化", "中学\n灌输式", "大学\n引导式", "硕士\n讨论式", "博士\n探索式"], 270, [C.cyan, C.blue, C.blue, C.gold, C.cyan, C.navy]);
    t(slide, "大学阶段的核心任务：在引导中学会举一反三。", 80, 500, 1120, 52, { size: 38, bold: true, color: C.navy, align: "center" });
  }

  // 7. University meaning
  {
    const slide = presentation.slides.add();
    base(slide, "大学者，大人之学也", "大学之学");
    const items = [
      ["明白大", "理解更大的世界与责任"],
      ["发现大", "发现问题、发现潜力、发现方向"],
      ["成为大", "成为有判断力、有担当的人"],
      ["应用大", "把所学用于解决真实问题"],
    ];
    items.forEach((r, i) => {
      const x = 78 + (i % 2) * 580;
      const y = 198 + Math.floor(i / 2) * 148;
      card(slide, x, y, 540, 116, r[0], r[1], i < 2 ? C.blue : C.cyan, { bodySize: 32, headingSize: 36 });
    });
    simpleConclusion(slide, "心大了，事就小了；持续向“止于至善”靠近。", C.gold);
  }

  // 8
  sectionSlide(presentation, "02", "专业介绍", "认识专业历史、培养目标、课程体系与未来出口", C.cyan);

  // 9 History
  {
    const slide = presentation.slides.add();
    base(slide, "从电子信息到人工智能：四十余年积淀", "专业介绍");
    const events = [
      ["1981", "创办电子信息本科专业"],
      ["1984", "创办计算机应用专业"],
      ["2000", "成立计算机学院和信息工程学院"],
      ["2021", "先进制造学院 · 人工智能与信息工程系"],
      ["2022", "计算机科学与技术 / 人工智能进入揭阳校区"],
      ["2024", "成立人工智能学院"],
    ];
    events.forEach((e, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 80 + col * 574;
      const y = 196 + row * 122;
      rect(slide, x, y, 540, 90, C.pale, 16, C.line);
      t(slide, e[0], x + 24, y + 20, 120, 46, { size: 40, bold: true, color: C.blue });
      t(slide, e[1], x + 166, y + 22, 344, 42, { size: 32, color: C.ink, valign: "middle" });
    });
    simpleConclusion(slide, "专业建设持续围绕信息技术前沿与区域产业需求迭代。", C.gold);
  }

  // 10–11 Development path
  developmentSlide(presentation, "专业发展历程：每一步都留下了扎实脚印", [
    ["1984", "计算机应用专业\n全国最早 56 所院校之一"],
    ["1993", "计算机科学与技术\n省重点扶持学科"],
    ["2003", "计算机科学与技术\n省名牌专业"],
    ["2011", "计算机应用工程\n二级学科博士点"],
  ], "1 / 2");
  developmentSlide(presentation, "专业发展历程：每一步都留下了扎实脚印", [
    ["2018", "信息与通信工程\n一级学科博士点"],
    ["2019", "计算机科学与技术\n国家级一流本科专业"],
    ["2022", "计算机科学与技术\n一级学科博士点"],
    ["2024", "人工智能学院"],
  ], "2 / 2");

  // 11 Milestones
  {
    const slide = presentation.slides.add();
    base(slide, "学以致用，创新为魂：学生的真实脚印", "专业介绍");
    card(slide, 78, 202, 530, 294, "师长领航 · 挑战杯", "2015 年获第十四届“挑战杯”全国大学生课外学术科技作品竞赛特等奖，是学校首次。", C.blue, { bodySize: 34, lineSpacing: 1.25 });
    card(slide, 672, 202, 530, 294, "世界舞台 · ACM ICPC", "三次进入全球总决赛（2010 / 2018 / 2019）；2018 年全球第 31 名；2019 年成为唯一“四非”队。", C.cyan, { bodySize: 34, lineSpacing: 1.25 });
    simpleConclusion(slide, "竞赛是能力的检验场，更是团队协作、持续投入与专业自信的训练场。", C.gold);
  }

  // 12 Competition
  {
    const slide = presentation.slides.add();
    base(slide, "竞赛成绩：积累、突破与持续进步", "专业介绍");
    const years = [["2022", "铜奖", "1", "2", "2", "5", "6", "14"], ["2023", "", "5", "4", "14", "15", "34", "39"]];
    const headers = ["年份", "奖项", "国家级", "省级", "校级", "洲级", "参与", "获奖"];
    headers.forEach((h, i) => {
      const x = 76 + i * 140;
      rect(slide, x, 204, 132, 58, C.navy, 8);
      t(slide, h, x + 6, 218, 120, 30, { size: 32, bold: true, color: C.white, align: "center" });
    });
    years.forEach((r, ri) => r.forEach((v, i) => {
      const x = 76 + i * 140;
      const y = 274 + ri * 74;
      rect(slide, x, y, 132, 58, ri === 0 ? C.pale : C.white, 8, C.line);
      t(slide, v || "—", x + 6, y + 14, 120, 30, { size: 32, color: i === 0 ? C.blue : C.ink, bold: i === 0, align: "center" });
    }));
    card(slide, 76, 462, 1124, 108, "2024 年亮点", "第 15 届全国大学生数学竞赛一等奖（广东省仅 2 项）。", C.gold, { bodySize: 36, headingSize: 36 });
  }

  // 13 CS Objective
  {
    const slide = presentation.slides.add();
    base(slide, "计算机科学与技术：培养目标", "专业介绍");
    t(slide, "立德树人，面向国家与广东发展需要，培养具有扎实理论基础、工程实践能力、外语应用能力与创新精神的高素质计算机人才。", 80, 192, 1120, 104, { size: 38, bold: true, color: C.navy, align: "center", valign: "middle", lineSpacing: 1.18 });
    roadmap(slide, ["理论基础", "学科素养", "工程实践", "外语应用", "创新精神"], 360, [C.blue, C.cyan, C.gold, C.cyan, C.blue]);
    simpleConclusion(slide, "可在政府机关、科研教育部门和企事业单位从事科研、开发、应用、教学与管理。", C.gold);
  }

  // 14 CS goals
  {
    const slide = presentation.slides.add();
    base(slide, "计算机科学与技术：四个毕业能力目标", "专业介绍");
    const goals = [
      ["目标 1｜思想品质", "健全人格、正确价值观、职业素养与社会责任感。"],
      ["目标 2｜专业素养", "分析、设计、开发计算机复杂工程问题的能力。"],
      ["目标 3｜工程管理", "组织实施项目，开展团队合作与工程管理。"],
      ["目标 4｜持续发展", "自主学习、终身学习与适应技术社会变化。"],
    ];
    goals.forEach((g, i) => card(slide, 78 + (i % 2) * 580, 192 + Math.floor(i / 2) * 178, 540, 144, g[0], g[1], [C.blue, C.cyan, C.gold, C.blue][i], { bodySize: 32, headingSize: 34 }));
  }

  // 15 CS credits
  creditsSlide(presentation, "计算机科学与技术：课程体系与设置", "专业介绍", [
    ["公共基础必修课", "54 学分"], ["专业基础必修课", "37 学分"], ["专业基础选修课", "至少 6"], ["专业必修课", "8 学分"], ["专业选修课", "至少 6"], ["公共选修课", "12 学分"],
  ], [
    ["实验实习实训（必修）", "14.5"], ["设计或论文（必修）", "20"], ["实验实习实训（选修）", "3"], ["设计或论文（选修）", "3"],
  ], "理论学习与实践训练并重，形成完整的能力培养闭环。");

  // 16 CS graduation
  {
    const slide = presentation.slides.add();
    base(slide, "计算机科学与技术：毕业要求与发展出口", "专业介绍");
    metric(slide, 100, 218, 300, 188, "≥163.5", "课内总学分", C.blue);
    metric(slide, 490, 218, 300, 188, "≥40.5", "实践教学环节学分", C.cyan);
    metric(slide, 880, 218, 300, 188, "多路径", "读研 · 就业 · 创业 · 出国深造", C.gold);
    simpleConclusion(slide, "学分是底线，能力与作品才是面向未来的通行证。", C.gold);
  }

  // 17 AI Objective
  {
    const slide = presentation.slides.add();
    base(slide, "人工智能：培养目标", "专业介绍");
    t(slide, "系统掌握人工智能的基本理论、知识、技能与方法，具备承担研发任务和解决实际问题的能力。", 80, 190, 1120, 80, { size: 40, bold: true, color: C.navy, align: "center", valign: "middle" });
    const areas = ["自主无人智能控制", "大数据与知识自动化", "计算机视觉与图形图像", "人工智能前沿技术"];
    areas.forEach((v, i) => card(slide, 80 + (i % 2) * 580, 330 + Math.floor(i / 2) * 132, 540, 104, v, "", i % 2 ? C.cyan : C.blue, { bodySize: 32, headingSize: 34 }));
  }

  // 18 AI fields
  {
    const slide = presentation.slides.add();
    base(slide, "人工智能：面向“感知—理解—决策—执行”", "专业介绍");
    roadmap(slide, ["机器感知\n模式识别", "自然语言\n处理与理解", "知识工程\n知识图谱", "机器人\n智能系统"], 278, [C.cyan, C.blue, C.gold, C.navy]);
    t(slide, "在企事业单位及其管理部门，从事技术设计、开发与工程管理，并在关键岗位发挥主导作用。", 80, 500, 1120, 74, { size: 36, color: C.ink, align: "center", valign: "middle", lineSpacing: 1.18 });
  }

  // 19 AI goals
  {
    const slide = presentation.slides.add();
    base(slide, "人工智能：能力成长的四个维度", "专业介绍");
    const goals = [
      ["知识", "掌握智能科学与计算、系统与工程、多媒体与模式识别等理论方法。"],
      ["能力", "开展跨媒体智能、大数据智能、机器人与混合增强智能的研发。"],
      ["责任", "具备人文素养、职业道德与社会责任，胜任算法、数据和系统岗位。"],
      ["发展", "具备学习、沟通、表达、跨文化协作与承担领导角色的能力。"],
    ];
    goals.forEach((g, i) => card(slide, 78 + (i % 2) * 580, 192 + Math.floor(i / 2) * 182, 540, 150, `目标 ${i + 1}｜${g[0]}`, g[1], [C.blue, C.cyan, C.gold, C.blue][i], { bodySize: 32, headingSize: 34 }));
  }

  // 20 AI credits
  creditsSlide(presentation, "人工智能：课程体系与设置", "专业介绍", [
    ["公共基础必修课", "55.5 学分"], ["专业基础必修课", "37 学分"], ["专业基础选修课", "至少 6"], ["专业必修课", "8 学分"], ["专业选修课", "至少 6"], ["公共选修课", "12 学分"],
  ], [
    ["实验实习实训（必修）", "14.5"], ["设计或论文（必修）", "20"], ["实验实习实训（选修）", "3"], ["设计或论文（选修）", "3"],
  ], "强调智能理论、算法模型、系统实现和场景应用的贯通。");

  // 21 AI graduation
  {
    const slide = presentation.slides.add();
    base(slide, "人工智能：毕业要求与发展出口", "专业介绍");
    metric(slide, 100, 218, 300, 188, "≥165", "课内总学分", C.blue);
    metric(slide, 490, 218, 300, 188, "≥40.5", "实践教学环节学分", C.cyan);
    metric(slide, 880, 218, 300, 188, "多路径", "读研 · 就业 · 创业 · 出国深造", C.gold);
    simpleConclusion(slide, "把理论转为算法、系统与可验证的解决方案。", C.gold);
  }

  // 22 CS & AI paths
  {
    const slide = presentation.slides.add();
    base(slide, "计算机科学与技术 & 人工智能：能力通向职业", "专业介绍");
    card(slide, 78, 202, 530, 298, "你将获得", "扎实的计算机 / 人工智能理论基础与学科素养\n计算机工程师的基本训练\n工程实践、外语应用与创新能力", C.blue, { bodySize: 34, lineSpacing: 1.2 });
    card(slide, 672, 202, 530, 298, "你可以走向", "政府机关、科研教育部门和企事业单位\n华为、百度、阿里巴巴、腾讯等企业，或自主创业\n科研、开发、应用、教学与管理岗位", C.cyan, { bodySize: 34, lineSpacing: 1.18 });
    simpleConclusion(slide, "专业名称提供起点；持续学习与实践作品决定你能走多远。", C.gold);
  }

  // 23 EIE objective
  {
    const slide = presentation.slides.add();
    base(slide, "电子信息工程：培养目标", "专业介绍");
    t(slide, "面向电子信息产业与广东经济社会发展需求，培养能够从事产品研发、工程应用与技术管理的“高素质、强能力、应用型”工程技术骨干。", 80, 190, 1120, 104, { size: 38, bold: true, color: C.navy, align: "center", valign: "middle", lineSpacing: 1.2 });
    roadmap(slide, ["人文素养", "工程知识", "产品研发", "工程应用", "技术管理"], 372, [C.blue, C.cyan, C.gold, C.cyan, C.blue]);
  }

  // 24 EIE goal1
  {
    const slide = presentation.slides.add();
    base(slide, "电子信息工程：目标 1｜责任与价值", "专业介绍");
    card(slide, 80, 188, 1120, 150, "总体要求", "具备良好人文素养、职业道德与社会责任感，遵纪守法，积极践行社会主义核心价值观。", C.blue, { bodySize: 36, headingSize: 38 });
    const specifics = ["熟悉并遵守相关法律、法规、标准与规范。", "工程实践中坚持客观、公正、诚信，公众利益优先与可持续发展。", "具有系统思维与多领域、多学科知识交叉融合应用能力。"];
    specifics.forEach((s, i) => card(slide, 80, 372 + i * 78, 1120, 70, `1.${i + 1}`, s, C.cyan, { bodySize: 32, headingSize: 32 }));
  }

  // 25 EIE goal2
  {
    const slide = presentation.slides.add();
    base(slide, "电子信息工程：目标 2｜工程能力与创新方案", "专业介绍");
    t(slide, "掌握行业标准、规范与流程，能够分析、设计、实现、测试软硬件系统，解决实际工程问题。", 80, 188, 1120, 72, { size: 38, bold: true, color: C.navy, align: "center" });
    const subs = [
      ["2.1", "精通所在领域工程知识与技能，能综合利用多种资源。"],
      ["2.2", "跟踪前沿技术，具备工程创新能力，处理复杂、冲突性问题。"],
      ["2.3", "在不确定环境中兼顾社会、经济、安全与伦理，形成创新性方案。"],
    ];
    subs.forEach((s, i) => card(slide, 80, 306 + i * 106, 1120, 100, s[0], s[1], [C.blue, C.cyan, C.gold][i], { bodySize: 32, headingSize: 34 }));
  }

  // 26 EIE goal3
  {
    const slide = presentation.slides.add();
    base(slide, "电子信息工程：目标 3｜沟通、协作与管理", "专业介绍");
    card(slide, 80, 182, 1120, 160, "总体要求", "具有良好的交流、沟通、团队协作与项目管理能力，能在电子信息技术应用项目中承担重要角色。", C.blue, { bodySize: 36, headingSize: 38 });
    card(slide, 80, 360, 540, 238, "3.1 协作", "尊重他人，能与同事、客户和公众有效合作，主动获取资源与支持。", C.cyan, { bodySize: 34, headingSize: 36 });
    card(slide, 660, 360, 540, 238, "3.2 管理", "熟悉工程经济与管理知识，具备融入、领导及带动团队发展的能力。", C.gold, { bodySize: 34, headingSize: 36 });
  }

  // 27 EIE goal4
  {
    const slide = presentation.slides.add();
    base(slide, "电子信息工程：目标 4｜持续学习与国际视野", "专业介绍");
    card(slide, 80, 182, 1120, 160, "总体要求", "持续跟踪国内外电子信息技术发展趋势和行业动态，具有自主学习、终身学习与创新意识。", C.blue, { bodySize: 36, headingSize: 38 });
    card(slide, 80, 360, 540, 238, "4.1 自我更新", "主动积极地持续钻研，提高专业素养，形成终身学习意识。", C.cyan, { bodySize: 34, headingSize: 36 });
    card(slide, 660, 360, 540, 238, "4.2 面向世界", "具备国际视野，主动适应变化，制定个人发展规划。", C.gold, { bodySize: 34, headingSize: 36 });
  }

  // 28 EIE credits
  creditsSlide(presentation, "电子信息工程：课程体系与设置", "专业介绍", [
    ["公共基础必修课", "55 学分"], ["专业基础必修课", "39.5 学分"], ["专业基础选修课", "按培养方案"], ["专业必修课", "11.5 学分"], ["专业选修课", "至少 7.5"], ["公共选修课", "12 学分"],
  ], [
    ["实验实习实训（必修）", "12.5"], ["设计或论文（必修）", "25"], ["实验实习实训（选修）", "按培养方案"], ["设计或论文（选修）", "按培养方案"],
  ], "突出软硬件一体化、工程实践与系统设计能力。");

  // 29 EIE grad
  {
    const slide = presentation.slides.add();
    base(slide, "电子信息工程：毕业要求与发展出口", "专业介绍");
    metric(slide, 100, 218, 300, 188, "≥163", "课内总学分", C.blue);
    metric(slide, 490, 218, 300, 188, "≥37", "实践教学环节学分", C.cyan);
    metric(slide, 880, 218, 300, 188, "多路径", "读研 · 就业 · 创业 · 出国深造", C.gold);
    simpleConclusion(slide, "夯实基础、动手实践、解决真实工程问题。", C.gold);
  }

  // 30 EIE paths
  {
    const slide = presentation.slides.add();
    base(slide, "电子信息工程：从工程训练走向行业应用", "专业介绍");
    card(slide, 78, 204, 530, 296, "你将获得", "扎实的电子信息工程理论基础与学科素养\n电子信息工程师的基本训练\n工程实践、外语应用与创新能力", C.blue, { bodySize: 34, lineSpacing: 1.2 });
    card(slide, 672, 204, 530, 296, "你可以走向", "政府机关、科研教育部门和企事业单位\n大型科技企业、产业单位或自主创业\n科研、开发、应用、教学与管理岗位", C.cyan, { bodySize: 34, lineSpacing: 1.2 });
    simpleConclusion(slide, "技术要落在产品与系统上，能力要体现在工程结果里。", C.gold);
  }

  // 31
  sectionSlide(presentation, "03", "专业学习", "建立课程主线、实践习惯与资源意识，让四年学习可规划、可执行、可复盘", C.gold);

  const csEntries = [
    ["导论", "滕少华教授"], ["程序设计", "李剑锋高工"], ["数据结构", "苏畅副教授"], ["操作系统", "李剑锋高工"], ["数据库系统", "邓立国副教授"], ["计算机网络 A", "梁路副教授"], ["离散数学", "陈子尧教师"], ["编译原理", "张巍教授"], ["计算机组成原理", "肖红副教授"], ["数字逻辑与系统设计", "张海笑讲师"], ["软件工程", "张凡龙讲师"],
  ];
  coreOverview(presentation, "计科 & 人工智能：主干课程与师资", "专业学习", csEntries);
  const csTeams = [
    { course: "导论", lead: "滕少华教授", members: "黎坚、陈通宝、朱清华、曾安、康培培" },
    { course: "程序设计", lead: "李剑锋高工", members: "李泓澍、曾莹、黄林青、谢光强、郭雅秋" },
    { course: "数据结构", lead: "苏畅副教授", members: "苏畅、张巍、陈子尧、苏庆、刘添添、李小妹" },
    { course: "操作系统", lead: "李剑锋高工", members: "苏畅、陈子尧、李泓澍、林穗、刘冬宁" },
    { course: "数据库系统", lead: "邓立国副教授", members: "邓立国、凌捷、林庆发、左亚尧、欧毓毅" },
    { course: "计算机网络 A", lead: "梁路副教授", members: "梁路、林庆发、彭重嘉、王文彦、黄益民" },
    { course: "离散数学", lead: "陈子尧教师", members: "陈子尧、蔡瑞初、方子森、孙宣东" },
    { course: "编译原理", lead: "张巍教授", members: "张巍、康培培、李扬、林志毅、李小妹" },
    { course: "计算机组成原理", lead: "肖红副教授", members: "肖红、邓立国、陈平华、孙盛、王帮海、韦玉科" },
    { course: "数字逻辑与系统设计", lead: "张海笑讲师", members: "张海笑、龙晓琼、邓杰航、冯永晋、张静" },
    { course: "软件工程", lead: "张凡龙讲师", members: "张凡龙、彭重嘉、顾国生、柳毅" },
  ];
  teamSlide(presentation, "计科 & 人工智能：课程组成员", "专业学习", csTeams.slice(0, 4), "1 / 3");
  teamSlide(presentation, "计科 & 人工智能：课程组成员", "专业学习", csTeams.slice(4, 8), "2 / 3");
  teamSlide(presentation, "计科 & 人工智能：课程组成员", "专业学习", csTeams.slice(8), "3 / 3");

  // 36 CS roadmap
  {
    const slide = presentation.slides.add();
    base(slide, "计算机科学与技术：课程体系一览", "专业学习");
    roadmap(slide, ["公共基础", "数学与科学", "专业基础", "专业核心", "方向选修", "综合实践"], 238, [C.blue, C.cyan, C.blue, C.gold, C.cyan, C.navy]);
    bulletList(slide, ["前两年夯实数学、程序设计、数据结构与系统基础。", "中后期通过算法、网络、数据库、软件工程形成系统能力。", "以课程设计、实习、论文和竞赛把知识转化为作品。"], 100, 456, 1080, 62, C.cyan, 34);
  }

  // 37 AI roadmap
  {
    const slide = presentation.slides.add();
    base(slide, "人工智能：课程体系一览", "专业学习");
    roadmap(slide, ["数学基础", "编程基础", "数据结构\n算法", "机器学习", "深度学习", "方向选修"], 238, [C.blue, C.cyan, C.blue, C.gold, C.cyan, C.navy]);
    bulletList(slide, ["先掌握数学、程序设计与算法，再进入智能模型。", "机器学习与深度学习构成从数据到智能的核心支点。", "在视觉、语言、机器人等方向完成应用延伸。"], 100, 456, 1080, 62, C.cyan, 34);
  }

  // 38 common foundation
  {
    const slide = presentation.slides.add();
    base(slide, "计算机类基础课程：一条贯穿四年的能力线", "专业学习");
    roadmap(slide, ["离散数学", "程序设计", "数据结构", "操作系统", "网络 / 数据库", "工程实践"], 246, [C.blue, C.cyan, C.blue, C.gold, C.cyan, C.navy]);
    simpleConclusion(slide, "数学、自然科学与英语是工具；程序、算法与系统是专业线条。", C.gold);
  }

  const eieEntries = [
    ["高级语言程序设计", "李剑锋高工"], ["嵌入式系统开发", "李剑锋高工"], ["信息论基础", "龙晓琼"], ["数据库技术与应用", "林庆发副教授"], ["计算机网络 A", "滕少华教授"], ["信号与系统", "曾莹"], ["通信原理", "黄益民讲师"], ["数字信号处理", "黄林青"], ["传感器技术及应用", "曾莹"], ["专业导论", "林庆发高工"],
  ];
  coreOverview(presentation, "电子信息工程：主干课程与师资", "专业学习", eieEntries);
  const eieTeams = [
    { course: "高级语言程序设计", lead: "李剑锋高工", members: "黎坚、谢光强、朱清华、曾安、谢国波、郭雅秋" },
    { course: "嵌入式系统设计与开发", lead: "李剑锋高工", members: "叶林锋、林伟、何元烈" },
    { course: "信息论基础", lead: "龙晓琼", members: "课程组成员按教学安排协同建设" },
    { course: "数据库技术与应用", lead: "林庆发副教授", members: "林庆发、邓立国、明俊峰、左亚尧、欧毓毅" },
    { course: "计算机网络 A", lead: "滕少华教授", members: "林庆发、梁路、彭重嘉、王文彦、黄益民" },
    { course: "信号与系统", lead: "曾莹", members: "龙晓琼、李铮、邓杰航" },
    { course: "通信原理", lead: "黄益民讲师", members: "李敏" },
    { course: "数字信号处理", lead: "黄林青", members: "课程组成员按教学安排协同建设" },
    { course: "传感器技术及应用", lead: "曾莹", members: "课程组成员按教学安排协同建设" },
    { course: "专业导论", lead: "林庆发高工", members: "李剑锋、龙晓琼" },
  ];
  teamSlide(presentation, "电子信息工程：课程组成员", "专业学习", eieTeams.slice(0, 4), "1 / 3");
  teamSlide(presentation, "电子信息工程：课程组成员", "专业学习", eieTeams.slice(4, 7), "2 / 3");
  teamSlide(presentation, "电子信息工程：课程组成员", "专业学习", eieTeams.slice(7), "3 / 3");

  // 43 learning mainline CS
  {
    const slide = presentation.slides.add();
    base(slide, "专业学习要有“主线意识”", "专业学习");
    t(slide, "计算机 / 人工智能专业课程并非散点；每门课、每学期都应接在一条能力链上。", 80, 188, 1120, 76, { size: 38, bold: true, color: C.navy, align: "center" });
    roadmap(slide, ["程序设计", "数据结构", "算法", "机器学习", "方向选修"], 330, [C.blue, C.cyan, C.gold, C.cyan, C.navy]);
    simpleConclusion(slide, "专业基础必修 + 专业基础选修 → 专业必修 + 专业选修。", C.gold);
  }

  // 44 time
  {
    const slide = presentation.slides.add();
    base(slide, "把课堂前、中、后连成闭环；用实践巩固所学", "专业学习");
    const phases = [
      ["课前", "对照进度，浏览内容，带着问题进入课堂。"],
      ["课堂", "抓住教学进度标明的重点难点，及时记录疑问。"],
      ["课后", "尽快复习、完成作业，用练习把知识落到手上。"],
      ["实践", "多编程、多上机验证，用作业和项目巩固知识。"],
    ];
    phases.forEach((r, i) => card(slide, 78 + (i % 2) * 580, 194 + Math.floor(i / 2) * 178, 540, 150, r[0], r[1], [C.blue, C.cyan, C.gold, C.blue][i], { bodySize: 32, headingSize: 38 }));
  }

  // 45 resources
  {
    const slide = presentation.slides.add();
    base(slide, "善用资源：把“可获得”变成“会应用”", "专业学习");
    const resources = [
      ["网络资源", "中外高校精品课程、B 站、在线交流与 AI 工具。"],
      ["校园资源", "图书馆、教室、实验室与学习空间。"],
      ["人际资源", "教师、同学间交流，也向网络大能学习。"],
      ["使用原则", "带着具体问题使用资源，核验信息并转化为自己的理解。"],
    ];
    resources.forEach((r, i) => card(slide, 78 + (i % 2) * 580, 188 + Math.floor(i / 2) * 186, 540, 168, r[0], r[1], [C.blue, C.cyan, C.gold, C.blue][i], { bodySize: 32, headingSize: 38 }));
  }

  // 46 AI line
  {
    const slide = presentation.slides.add();
    base(slide, "人工智能的课程主线：从程序与算法到智能系统", "专业学习");
    roadmap(slide, ["程序设计", "数据结构", "算法设计", "机器学习", "深度学习", "方向选修"], 276, [C.blue, C.cyan, C.blue, C.gold, C.cyan, C.navy]);
    simpleConclusion(slide, "每一门后续课程都依赖前序基础；“跳过基础”会在项目中暴露。", C.gold);
  }

  // 47 EIE line
  {
    const slide = presentation.slides.add();
    base(slide, "电子信息工程的课程主线：软硬件一体化", "专业学习");
    roadmap(slide, ["数学基础", "电路 / 信号", "编程基础", "嵌入式系统", "通信与网络", "系统应用"], 276, [C.blue, C.cyan, C.blue, C.gold, C.cyan, C.navy]);
    t(slide, "数学课较多，动手能力培养同样重要。要用实验、调试与项目把抽象知识变成系统直觉。", 80, 510, 1120, 62, { size: 36, color: C.ink, align: "center", valign: "middle" });
  }

  // 48 system
  {
    const slide = presentation.slides.add();
    base(slide, "课程体系：纵向递进与横向叠加", "专业学习");
    const tiers = [
      ["专业类课程", "系统设计与实践能力"],
      ["专业基础 / 工程基础", "在专业中运用数学与自然科学"],
      ["数学与自然科学", "基本科学能力"],
    ];
    tiers.forEach((r, i) => {
      const y = 206 + i * 120;
      rect(slide, 120 + i * 70, y, 940 - i * 140, 86, [C.blue, C.cyan, C.gold][i], 16);
      t(slide, r[0], 150 + i * 70, y + 22, 320, 42, { size: 36, bold: true, color: C.white });
      t(slide, r[1], 500, y + 24, 500, 38, { size: 32, color: C.white, align: "right" });
    });
    simpleConclusion(slide, "以学生为中心、以成果为导向、持续改进；教学计划不是“已挖好的坑”。", C.gold);
  }

  // 49 program design
  {
    const slide = presentation.slides.add();
    base(slide, "课程主线示例：程序设计要建立知识图谱", "专业学习");
    roadmap(slide, ["符号", "单词", "语句", "段落", "文章"], 226, [C.cyan, C.blue, C.gold, C.blue, C.cyan]);
    roadmap(slide, ["顺序", "分支", "重复", "数据类型", "数组", "函数 / 指针"], 410, [C.blue, C.cyan, C.gold, C.blue, C.cyan, C.navy]);
    simpleConclusion(slide, "自然语言有组织方式，程序也有组织方式：控制流与数据结构共同构成代码。", C.gold);
  }

  // 50 data structure
  {
    const slide = presentation.slides.add();
    base(slide, "课程主线示例：数据结构的逻辑脉络", "专业学习");
    const left = rect(slide, 78, 220, 288, 290, C.pale, 18, C.line);
    const middle = rect(slide, 496, 220, 288, 290, C.pale, 18, C.line);
    const right = rect(slide, 914, 220, 288, 290, C.pale, 18, C.line);
    slide.shapes.connect(left, middle, { kind: "straight", fromSide: "right", toSide: "left", line: { style: "solid", fill: C.blue, width: 3 }, head: { type: "triangle", width: "sm", length: "sm" } });
    slide.shapes.connect(middle, right, { kind: "straight", fromSide: "right", toSide: "left", line: { style: "solid", fill: C.blue, width: 3 }, head: { type: "triangle", width: "sm", length: "sm" } });
    t(slide, "逻辑结构", 104, 250, 236, 44, { size: 38, bold: true, color: C.blue, align: "center" });
    t(slide, "线性 · 树 · 图", 102, 348, 240, 62, { size: 34, color: C.ink, align: "center" });
    t(slide, "存储结构", 522, 250, 236, 44, { size: 38, bold: true, color: C.cyan, align: "center" });
    t(slide, "顺序 · 栈 · 队列\n链式 · 索引 · 指针", 522, 334, 236, 100, { size: 32, color: C.ink, align: "center", lineSpacing: 1.1 });
    t(slide, "基本操作", 940, 250, 236, 44, { size: 38, bold: true, color: C.gold, align: "center" });
    t(slide, "查找 · 插入 · 删除\n遍历 · 排序", 940, 344, 236, 82, { size: 32, color: C.ink, align: "center", lineSpacing: 1.1 });
    simpleConclusion(slide, "学习数据结构，不是记容器，而是理解“结构—存储—操作—算法”的关系。", C.gold);
  }

  // 51 knowledge graph
  {
    const slide = presentation.slides.add();
    base(slide, "数据结构知识图谱：让知识彼此连接", "专业学习");
    const center = rect(slide, 485, 295, 310, 108, C.navy, 20);
    t(slide, "数据结构", 505, 328, 270, 44, { size: 42, bold: true, color: C.white, align: "center" });
    const nodes = [
      ["线性结构", 105, 220, C.blue], ["树结构", 105, 430, C.cyan], ["图结构", 930, 220, C.gold], ["基本算法", 930, 430, C.blue],
    ];
    nodes.forEach(([label, x, y, color]) => {
      const node = rect(slide, x, y, 250, 84, C.pale, 16, C.line);
      t(slide, label, x + 18, y + 24, 214, 36, { size: 34, bold: true, color, align: "center" });
      slide.shapes.connect(center, node, { kind: "straight", fromSide: Number(x) < 400 ? "left" : "right", toSide: Number(x) < 400 ? "right" : "left", line: { style: "solid", fill: C.line, width: 3 }, head: { type: "none" } });
    });
    simpleConclusion(slide, "用知识图谱替代零散记忆：遇到新题时，先定位结构，再选择操作和算法。", C.gold);
  }

  // 52 network
  {
    const slide = presentation.slides.add();
    base(slide, "课程主线示例：用“快递”理解计算机网络", "专业学习");
    const layers = [
      ["应用层", "内容与应用服务"], ["传输层", "收件人：端到端传输"], ["网络层", "地址：选择路径"], ["数据链路层", "帧传输：可验错"], ["物理层", "按位传输：物理通道"],
    ];
    layers.forEach((r, i) => {
      const y = 180 + i * 78;
      rect(slide, 192 + i * 42, y, 690 - i * 84, 58, [C.blue, C.cyan, C.gold, C.cyan, C.blue][i], 12);
      t(slide, r[0], 218 + i * 42, y + 14, 170, 30, { size: 32, bold: true, color: C.white });
      t(slide, r[1], 420, y + 14, 390, 30, { size: 32, color: C.white, align: "right" });
    });
    simpleConclusion(slide, "邮件地址、收件人、内容、帧与物理通道，分别帮助理解网络的分层职责。", C.gold);
  }

  // 53
  sectionSlide(presentation, "04", "几点建议", "学习、生活、纪律与沟通：让专业成长建立在稳定而自律的日常上", C.gold);

  // 54 advice study
  {
    const slide = presentation.slides.add();
    base(slide, "回归常识：学习上要完成三次转变", "几点建议");
    const items = [
      ["从被动到主动", "制定计划，及时预习、复习和完成作业。"],
      ["从听懂到会做", "课堂内容更多，要把理解落实到练习、编程和验证。"],
      ["从分心到自律", "管理网络、手机与游戏，让注意力回到长期目标。"],
    ];
    items.forEach((r, i) => card(slide, 80, 188 + i * 126, 1120, 112, r[0], r[1], [C.blue, C.cyan, C.gold][i], { bodySize: 34, headingSize: 36 }));
    simpleConclusion(slide, "认真学习，是给未来的自己最可靠的底气。", C.gold);
  }

  // 55 life
  {
    const slide = presentation.slides.add();
    base(slide, "回归常识：生活上要学会独立与相处", "几点建议");
    card(slide, 80, 198, 540, 250, "离开家，更要照顾好自己", "生活需自理：安排作息、管理物品、照顾身体，也对自己的选择负责。", C.blue, { bodySize: 36, headingSize: 38, lineSpacing: 1.22 });
    card(slide, 660, 198, 540, 250, "进入集体，更要学会相处", "与同学沟通、互相尊重、懂得感恩；在需要时主动表达和寻求帮助。", C.cyan, { bodySize: 36, headingSize: 38, lineSpacing: 1.22 });
    simpleConclusion(slide, "独立不是孤立；成熟是在关系中保持责任与善意。", C.gold);
  }

  // 56 discipline
  {
    const slide = presentation.slides.add();
    base(slide, "回归常识：纪律与沟通是成长的护栏", "几点建议");
    const rules = [
      ["认真学习学生手册", "了解权利、责任、程序与支持渠道。"],
      ["遵守校规校纪", "把规则内化为对自己和他人的尊重。"],
      ["遇到问题及时沟通", "与老师、同学交流；把困难变成可以被解决的问题。"],
    ];
    rules.forEach((r, i) => card(slide, 80, 184 + i * 128, 1120, 112, r[0], r[1], [C.blue, C.cyan, C.gold][i], { bodySize: 34, headingSize: 36 }));
    simpleConclusion(slide, "好好学习，天天向上；成长为明天更自信的你。", C.gold);
  }

  // 57 close
  {
    const slide = presentation.slides.add();
    slide.background.fill = C.navy;
    rect(slide, 0, 0, W, H, C.navy);
    rect(slide, 74, 242, 144, 10, C.gold, 5);
    t(slide, "谢谢！", 74, 290, 610, 86, { size: 74, bold: true, color: C.white });
    t(slide, "广工校园群英汇，鳌头山上祥云飞！", 76, 420, 880, 54, { size: 40, color: "#DDEEFF" });
    t(slide, "愿你以好奇心学习，以行动力成长。", 76, 510, 820, 46, { size: 34, color: C.gold });
    rect(slide, 1010, 118, 124, 124, C.blue, 62);
    t(slide, "AI", 1028, 154, 88, 46, { size: 42, bold: true, color: C.white, align: "center" });
  }

  const expected = 58;
  if (presentation.slides.items.length !== expected) {
    throw new Error(`Expected ${expected} slides, got ${presentation.slides.items.length}`);
  }
  await fs.mkdir(`${WORK}/final_render`, { recursive: true });
  for (const [index, slide] of presentation.slides.items.entries()) {
    const png = await presentation.export({ slide, format: "png", scale: 1 });
    await writeBlob(`${WORK}/final_render/slide-${index + 1}.png`, png);
  }
  const montage = await presentation.export({ format: "webp", montage: true, scale: 1 });
  await writeBlob(`${WORK}/final_montage.webp`, montage);
  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(OUT);
  console.log(JSON.stringify({ output: OUT, slides: presentation.slides.items.length }));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
