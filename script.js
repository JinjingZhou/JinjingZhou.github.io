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

let openProjectIndex = -1;

function closeProjectDrawer() {
  stackedProjectCards.forEach((card) => {
    const headerButton = card.querySelector(".project-card-header");

    card.classList.remove("is-open", "is-shifted");
    headerButton?.setAttribute("aria-expanded", "false");
  });

  openProjectIndex = -1;
}

// 点击表头后，后面的卡片向下移动，当前卡片仍保留原来的层级。
stackedProjectCards.forEach((card, cardIndex) => {
  const headerButton = card.querySelector(".project-card-header");

  if (!headerButton) {
    return;
  }

  headerButton.addEventListener("click", () => {
    // 手机端没有粘性堆叠，因此不执行抽拉动画。
    if (window.matchMedia("(max-width: 700px)").matches) {
      return;
    }

    if (openProjectIndex === cardIndex) {
      closeProjectDrawer();
      return;
    }

    stackedProjectCards.forEach((otherCard, otherIndex) => {
      const otherButton = otherCard.querySelector(".project-card-header");
      const isOpen = otherIndex === cardIndex;
      const shouldMoveDown = otherIndex > cardIndex;

      otherCard.classList.toggle("is-open", isOpen);
      otherCard.classList.toggle("is-shifted", shouldMoveDown);
      otherButton?.setAttribute("aria-expanded", String(isOpen));
    });

    openProjectIndex = cardIndex;
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && openProjectIndex !== -1) {
    closeProjectDrawer();
  }
});

// 用户继续浏览页面时，让抽屉平滑收回，再恢复正常的 1→6 粘性顺序。
function closeDrawerBeforeScrolling() {
  if (openProjectIndex !== -1) {
    closeProjectDrawer();
  }
}

window.addEventListener("wheel", closeDrawerBeforeScrolling, {
  passive: true
});

window.addEventListener("touchmove", closeDrawerBeforeScrolling, {
  passive: true
});

window.addEventListener("scroll", closeDrawerBeforeScrolling, {
  passive: true
});

window.addEventListener("resize", () => {
  if (
    openProjectIndex !== -1 &&
    window.matchMedia("(max-width: 700px)").matches
  ) {
    closeProjectDrawer();
  }
});
