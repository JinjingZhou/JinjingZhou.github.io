document.documentElement.classList.add("js");
// 读取 HTML 中需要操作的元素
const yearElement = document.querySelector("#current-year");

const menuButton = document.querySelector(".menu-toggle");
const mainNavigation = document.querySelector("#main-navigation");

// 自动显示当前年份
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const projectCards = document.querySelectorAll(".scroll-reveal");
const stackedProjectCards = document.querySelectorAll(
  ".project-stack .project-card"
);

if ("IntersectionObserver" in window) {
  const projectObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          projectObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2
    }
  );

  projectCards.forEach((card) => {
    projectObserver.observe(card);
  });
} else {
  projectCards.forEach((card) => {
    card.classList.add("is-visible");
  });
}

if (menuButton && mainNavigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = mainNavigation.classList.toggle("is-open");

    menuButton.classList.toggle("is-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "关闭导航菜单" : "打开导航菜单"
    );
  });

  mainNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNavigation.classList.remove("is-open");
      menuButton.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "打开导航菜单");
    });
  });
}

const projectTabs = Array.from(
  document.querySelectorAll(".project-tab-grid .project-card-header")
);
const projectTabGrid = document.querySelector(".project-tab-grid");
const projectStack = document.querySelector(".project-stack");
let activeProjectIndex = -1;

function closeProjectPreview(focusIndex = 0, moveFocus = false) {
  projectTabs.forEach((tab, tabIndex) => {
    const panelId = tab.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;
    const card = panel?.closest(".project-card");

    tab.setAttribute("aria-expanded", "false");
    tab.tabIndex = tabIndex === focusIndex ? 0 : -1;

    if (card) {
      card.hidden = true;
      card.classList.remove("is-open");
    }
  });

  projectTabGrid?.classList.remove("has-selection");
  projectStack?.classList.remove("has-preview");
  activeProjectIndex = -1;

  if (moveFocus) {
    projectTabs[focusIndex]?.focus();
  }
}

function activateProject(projectIndex, moveFocus = false) {
  activeProjectIndex = projectIndex;
  projectTabGrid?.classList.add("has-selection");
  projectStack?.classList.add("has-preview");

  projectTabs.forEach((tab, tabIndex) => {
    const isActive = tabIndex === projectIndex;
    const panelId = tab.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;
    const card = panel?.closest(".project-card");

    tab.setAttribute("aria-expanded", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;

    if (card) {
      card.hidden = !isActive;
      card.classList.toggle("is-open", isActive);
    }
  });

  if (moveFocus) {
    projectTabs[projectIndex]?.focus();
  }
}

projectTabs.forEach((tab, tabIndex) => {
  tab.addEventListener("click", () => {
    if (activeProjectIndex === tabIndex) {
      closeProjectPreview(tabIndex);
    } else {
      activateProject(tabIndex);
    }
  });

  tab.addEventListener("keydown", (event) => {
    let nextIndex = tabIndex;

    if (event.key === "ArrowRight") {
      nextIndex = (tabIndex + 1) % projectTabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (tabIndex - 1 + projectTabs.length) % projectTabs.length;
    } else if (event.key === "ArrowDown") {
      nextIndex = (tabIndex + 2) % projectTabs.length;
    } else if (event.key === "ArrowUp") {
      nextIndex = (tabIndex - 2 + projectTabs.length) % projectTabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = projectTabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    activateProject(nextIndex, true);
  });
});

if (projectTabs.length === stackedProjectCards.length && projectTabs.length > 0) {
  closeProjectPreview();
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activeProjectIndex !== -1) {
    closeProjectPreview(activeProjectIndex, true);
  }
});

document.addEventListener("click", (event) => {
  const clickedInsideProjects = event.target.closest(
    ".project-tab-grid, .project-stack"
  );

  if (!clickedInsideProjects && activeProjectIndex !== -1) {
    closeProjectPreview(activeProjectIndex);
  }
});
