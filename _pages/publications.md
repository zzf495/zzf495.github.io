---
layout: page
permalink: /publications/
title: Publications
description: "Publications confirmed from public author, publisher, and institutional records."
nav: true
nav_order: 3
---

Rank labels refer to the venue rather than the individual paper. CCF categories follow the China Computer Federation (CCF) recommended list, while Journal Citation Reports (JCR) quartiles are based on the latest publicly available data. Categories and quartiles may vary by year and subject category.

<div class="publication-filters" role="group" aria-label="Publication filters">
  <button type="button" class="btn btn-sm btn-primary mr-2" data-publication-filter="all" aria-pressed="true">All</button>
  <button type="button" class="btn btn-sm btn-outline-primary mr-2" data-publication-filter="lead" aria-pressed="false">First/Corresponding</button>
  <button type="button" class="btn btn-sm btn-outline-primary" data-publication-filter="collaborative" aria-pressed="false">Collaborative</button>
</div>

<div data-publication-panel="lead">
  <h2>First-Author and Corresponding-Author Publications</h2>
  <div class="publications">

  {% bibliography --query @*[classification=first_or_corresponding] %}

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
        panel.hidden = view !== "all" && panel.dataset.publicationPanel !== view;
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
