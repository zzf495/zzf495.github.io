---
layout: page
permalink: /publications/
title: Publications
description: "Rank labels refer to the venue rather than the individual paper. CCF categories follow the China Computer Federation (CCF) recommended list, while Journal Citation Reports (JCR) quartiles are based on the latest publicly available data. Categories and quartiles may vary by year and subject category."
nav: true
nav_order: 3
---

<style>
  .publications .cv-rank-badge {
    display: inline-block;
    margin-left: 0.35rem;
    margin-top: 0.15rem;
    margin-bottom: 0.15rem;
    padding: 0.2rem 0.55rem;
    border: 1px solid;
    border-radius: 0.35rem;
    font-size: 0.78rem;
    font-weight: 600;
    line-height: 1.2;
    white-space: nowrap;
  }

  .publications .rank-ccf-a {
    background-color: #fee2e2;
    border-color: #b91c1c;
    color: #7f1d1d;
  }

  .publications .rank-ccf-b {
    background-color: #fef3c7;
    border-color: #d97706;
    color: #78350f;
  }

  .publications .rank-ccf-c {
    background-color: #dcfce7;
    border-color: #16a34a;
    color: #14532d;
  }

  .publications .rank-jcr-q1 {
    background-color: #4c1d95;
    border-color: #4c1d95;
    color: #ffffff;
  }

  .publications .rank-jcr-q2 {
    background-color: #7e22ce;
    border-color: #7e22ce;
    color: #ffffff;
  }

  .publications .rank-jcr-q3 {
    background-color: #c084fc;
    border-color: #a855f7;
    color: #3b0764;
  }

  .publications .rank-jcr-q4 {
    background-color: #e9d5ff;
    border-color: #c084fc;
    color: #581c87;
  }

  .publication-filter-controls {
    margin-bottom: 1.25rem;
  }

  .publication-filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem;
    margin-bottom: 0.8rem;
  }

  .publication-filter-label,
  .publication-topic-filters legend {
    margin-right: 0.35rem;
    font-weight: 600;
  }

  .publication-topic-filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.45rem 1rem;
    margin: 0 0 0.45rem;
    padding: 0;
    border: 0;
  }

  .publication-topic-filters legend {
    float: left;
    width: auto;
    padding: 0;
  }

  .publication-topic-option {
    display: inline-flex;
    align-items: center;
    margin: 0;
    font-size: 0.92rem;
    cursor: pointer;
  }

  .publication-topic-option input {
    margin: 0 0.35rem 0 0;
    accent-color: var(--global-theme-color, #007bff);
  }

  .publication-filter-help,
  .publication-empty {
    margin: 0.45rem 0 0;
    color: var(--global-text-color-light, #6c757d);
    font-size: 0.88rem;
  }

  #publication-list .row[hidden] {
    display: none !important;
  }
</style>

<div class="publication-filter-controls">
  <div class="publication-filters" role="group" aria-label="Author role filters">
    <span class="publication-filter-label">Author role:</span>
    <button type="button" class="btn btn-sm btn-primary mr-2" data-publication-filter="all" aria-pressed="true">All</button>
    <button type="button" class="btn btn-sm btn-outline-primary mr-2" data-publication-filter="first" aria-pressed="false">First Author</button>
    <button type="button" class="btn btn-sm btn-outline-primary mr-2" data-publication-filter="corresponding" aria-pressed="false">Corresponding Author</button>
    <button type="button" class="btn btn-sm btn-outline-primary mr-2" data-publication-filter="first-corresponding" aria-pressed="false">First + Corresponding</button>
    <button type="button" class="btn btn-sm btn-outline-primary" data-publication-filter="collaborative" aria-pressed="false">Collaborative</button>
  </div>

  <fieldset class="publication-topic-filters">
    <legend>Research topic:</legend>
    <label class="publication-topic-option">
      <input type="checkbox" id="topic-all" checked>
      <span>All</span>
    </label>
    <label class="publication-topic-option">
      <input type="checkbox" value="transfer_learning" checked>
      <span>Transfer Learning</span>
    </label>
    <label class="publication-topic-option">
      <input type="checkbox" value="cross_modal" checked>
      <span>Cross-modal</span>
    </label>
    <label class="publication-topic-option">
      <input type="checkbox" value="clustering" checked>
      <span>Clustering</span>
    </label>
    <label class="publication-topic-option">
      <input type="checkbox" value="other" checked>
      <span>Other</span>
    </label>
  </fieldset>

  <p class="publication-filter-help">
    Multiple topics are combined with OR; the selected topic(s) and author role are combined with AND.
  </p>
</div>

<h2>Publications</h2>
<div id="publication-list" class="publications">
  {% bibliography --query @* %}
</div>
<p id="publication-empty" class="publication-empty" hidden>No publications match the selected filters.</p>

<script>
  (() => {
    const publicationMetadata = {
      teng2026tensor: { topic: "clustering", author: "corresponding" },
      teng2026noisyhash: { topic: "cross_modal", author: "collaborative" },
      wu2026multimodal: { topic: "cross_modal", author: "collaborative" },
      teng2026multigranularity: { topic: "transfer_learning", author: "corresponding" },
      teng2026dsgcm: { topic: "transfer_learning", author: "collaborative" },
      he2026esdetr: { topic: "other", author: "collaborative" },
      zheng2026tmsn: { topic: "transfer_learning", author: "first" },
      zheng2025aglsp: { topic: "transfer_learning", author: "first" },
      zheng2025microcommunity: { topic: "transfer_learning", author: "first" },
      teng2025cdpmvl: { topic: "clustering", author: "corresponding" },
      teng2025dynamic: { topic: "cross_modal", author: "collaborative" },
      teng2025global: { topic: "cross_modal", author: "collaborative" },
      he2025wavelet: { topic: "other", author: "collaborative" },
      fang2025labelenhanced: { topic: "cross_modal", author: "collaborative" },
      wang2025lssrc: { topic: "transfer_learning", author: "collaborative" },
      wang2025relaxed: { topic: "transfer_learning", author: "collaborative" },
      teng2024kernel: { topic: "other", author: "corresponding" },
      teng2024joint: { topic: "cross_modal", author: "collaborative" },
      teng2024gig: { topic: "transfer_learning", author: "corresponding" },
      teng2024jmcsl: { topic: "transfer_learning", author: "collaborative" },
      teng2024robust: { topic: "cross_modal", author: "collaborative" },
      zeng2024complementary: { topic: "clustering", author: "collaborative" },
      fang2024discriminative: { topic: "transfer_learning", author: "collaborative" },
      zheng2023ktldds: { topic: "transfer_learning", author: "first" },
      teng2023agecs: { topic: "transfer_learning", author: "first" },
      zheng2023scsl: { topic: "transfer_learning", author: "first" },
      teng2023relation: { topic: "transfer_learning", author: "collaborative" },
      teng2023injection: { topic: "other", author: "collaborative" },
      teng2022icsc: { topic: "transfer_learning", author: "first" },
      "11228496": { topic: "transfer_learning", author: "collaborative" }
    };

    const authorButtons = Array.from(document.querySelectorAll("[data-publication-filter]"));
    const topicAll = document.getElementById("topic-all");
    const topicCheckboxes = Array.from(document.querySelectorAll(".publication-topic-filters input[value]"));
    const emptyMessage = document.getElementById("publication-empty");
    const publications = Object.entries(publicationMetadata)
      .map(([key, metadata]) => {
        const anchor = document.getElementById(key);
        const row = anchor ? anchor.closest(".row") : null;
        if (row) {
          row.dataset.publicationTopic = metadata.topic;
          row.dataset.publicationAuthor = metadata.author;
        }
        return { row, metadata };
      })
      .filter(({ row }) => row);

    let selectedAuthor = "all";

    const selectedTopics = () => topicCheckboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);

    const syncTopicAll = () => {
      const count = topicCheckboxes.filter((checkbox) => checkbox.checked).length;
      topicAll.checked = count === topicCheckboxes.length;
      topicAll.indeterminate = count > 0 && count < topicCheckboxes.length;
    };

    const authorMatches = (author) => {
      if (selectedAuthor === "all") return true;
      if (selectedAuthor === "first-corresponding") return author === "first" || author === "corresponding";
      return author === selectedAuthor;
    };

    const applyFilters = () => {
      const topics = selectedTopics();
      let visibleCount = 0;
      publications.forEach(({ row, metadata }) => {
        const matches = authorMatches(metadata.author) && topics.includes(metadata.topic);
        row.hidden = !matches;
        if (matches) visibleCount += 1;
      });
      emptyMessage.hidden = visibleCount > 0;
      syncTopicAll();
    };

    authorButtons.forEach((button) => {
      button.addEventListener("click", () => {
        selectedAuthor = button.dataset.publicationFilter;
        authorButtons.forEach((item) => {
          const active = item === button;
          item.setAttribute("aria-pressed", active ? "true" : "false");
          item.classList.toggle("btn-primary", active);
          item.classList.toggle("btn-outline-primary", !active);
        });
        applyFilters();
      });
    });

    topicAll.addEventListener("change", () => {
      topicCheckboxes.forEach((checkbox) => {
        checkbox.checked = topicAll.checked;
      });
      applyFilters();
    });

    topicCheckboxes.forEach((checkbox) => checkbox.addEventListener("change", applyFilters));
    applyFilters();
  })();
</script>
