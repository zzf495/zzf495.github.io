---
layout: page
permalink: /publications/
title: Publications
description: "Rank labels refer to the venue rather than the individual paper. CCF categories follow the China Computer Federation (CCF) recommended list, while Journal Citation Reports (JCR) quartiles are based on the latest publicly available data. Categories and quartiles may vary by year and subject category."
nav: true
nav_order: 3
---

<style>
  .publications .publication-rank {
    display: inline-block;
    margin-left: 0.75rem;
    white-space: nowrap;
  }
</style>

<div class="publication-filters" role="group" aria-label="Publication filters">
  <button type="button" class="btn btn-sm btn-primary mr-2" data-publication-filter="all" aria-pressed="true">All</button>
  <button type="button" class="btn btn-sm btn-outline-primary mr-2" data-publication-filter="first" aria-pressed="false">First Author</button>
  <button type="button" class="btn btn-sm btn-outline-primary mr-2" data-publication-filter="corresponding" aria-pressed="false">Corresponding Author</button>
  <button type="button" class="btn btn-sm btn-outline-primary mr-2" data-publication-filter="first-corresponding" aria-pressed="false">First + Corresponding</button>
  <button type="button" class="btn btn-sm btn-outline-primary" data-publication-filter="collaborative" aria-pressed="false">Collaborative</button>
</div>

<div data-publication-panel="first">
  <h2>First-Author Publications</h2>
  <div class="publications">

  {% bibliography --query @*[classification=first_author] %}

  </div>
</div>

<div data-publication-panel="corresponding">
  <h2>Corresponding-Author Publications</h2>
  <div class="publications">

  {% bibliography --query @*[classification=corresponding_author] %}

  </div>
</div>

<div data-publication-panel="first-corresponding">
  <h2>First-Author + Corresponding-Author Publications</h2>
  <div class="publications">

  {% bibliography --query @*[author_role=first_or_corresponding] %}

  </div>
</div>

<div data-publication-panel="collaborative">
  <h2>Collaborative Publications</h2>
  <div class="publications">

  {% bibliography --query @*[classification=collaborative] %}

  </div>
</div>

<script>
  (() => {
    const buttons = Array.from(document.querySelectorAll("[data-publication-filter]"));
    const panels = Array.from(document.querySelectorAll("[data-publication-panel]"));

    const setPublicationView = (view) => {
      panels.forEach((panel) => {
        const panelName = panel.dataset.publicationPanel;
        panel.hidden = view === "all" ? panelName === "first-corresponding" : panelName !== view;
      });
      buttons.forEach((button) => {
        const active = button.dataset.publicationFilter === view;
        button.setAttribute("aria-pressed", active ? "true" : "false");
        button.classList.toggle("btn-primary", active);
        button.classList.toggle("btn-outline-primary", !active);
      });
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => setPublicationView(button.dataset.publicationFilter));
    });
    setPublicationView("all");
  })();
</script>
