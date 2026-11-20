// Page behaviour without libraries: the request builder in #pidbir, the mobile menu, the header hairline,
// the mobile call bar and the accordion of #umovy. Every control works as a real link without this script.

const $ = <T extends Element>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* ---------- Request builder ---------- */
function initPicker(): void {
  const picker = $<HTMLElement>("[data-picker]");
  if (!picker) return;
  const brand = $<HTMLSelectElement>("[data-brand]", picker);
  const model = $<HTMLInputElement>("[data-model]", picker);
  const out = $<HTMLElement>("[data-request]", picker);
  const hint = $<HTMLElement>("[data-hint]", picker);
  const status = $<HTMLElement>("[data-copy-status]", picker);
  const copyBtn = $<HTMLButtonElement>("[data-copy]", picker);
  const copyLabel = $<HTMLElement>("[data-copy-label]", picker);
  const viber = $<HTMLAnchorElement>('[data-send="viber"]', picker);
  const telegram = $<HTMLAnchorElement>('[data-send="telegram"]', picker);
  const mail = $<HTMLAnchorElement>('[data-send="mail"]', picker);
  const chips = $$<HTMLButtonElement>("[data-chip]", picker);
  if (!brand || !model || !out || !hint || !status || !copyBtn || !copyLabel || !viber || !telegram || !mail) return;

  const viberBase = viber.getAttribute("href") ?? "";
  const mailBase = (mail.getAttribute("href") ?? "").split("?")[0];
  const defaultHint = hint.textContent ?? "";
  const defaultStatus = status.textContent ?? "";
  let shown: string[] = [];
  let resetTimer = 0;

  const nodeEl = (id: string) => $<SVGGElement>(`.scheme [data-node="${id}"]`, picker);

  const parts = (): string[] => {
    const car = [brand.value, model.value.trim()].filter(Boolean).join(" ");
    const broken = chips.filter((c) => c.getAttribute("aria-pressed") === "true").map((c) => c.dataset.phrase ?? "");
    return [car, ...broken].filter(Boolean);
  };
  const message = (): string => {
    const p = parts();
    return p.length ? `Добрий день! Потрібна деталь: ${p.join(", ")}.` : "Добрий день! Потрібна допомога з підбором деталі.";
  };

  const render = (): void => {
    const p = parts();
    out.replaceChildren();
    out.classList.toggle("is-empty", p.length === 0);
    if (!p.length) {
      out.textContent = "оберіть марку й що зламалося";
    } else {
      p.forEach((text, i) => {
        const span = document.createElement("span");
        span.className = "request__part";
        if (!shown.includes(text) && !reduceMotion.matches) span.classList.add("is-new");
        span.textContent = text;
        out.append(span);
        if (i < p.length - 1) out.append(", ");
      });
    }
    shown = p;

    const hasBrand = brand.value !== "";
    const hasNode = chips.some((c) => c.getAttribute("aria-pressed") === "true");
    hint.textContent = hasBrand && !hasNode
      ? "Оберіть, що зламалося: на схемі або кнопкою."
      : !hasBrand && hasNode
        ? "Додайте марку, і менеджер швидше знайде деталь."
        : defaultHint;

    const msg = message();
    const car = [brand.value, model.value.trim()].filter(Boolean).join(" ");
    viber.href = `${viberBase}&text=${encodeURIComponent(msg)}`;
    mail.href = `${mailBase}?subject=${encodeURIComponent(car ? `Підбір деталі: ${car}` : "Підбір деталі")}&body=${encodeURIComponent(`${msg}\n\n`)}`;
  };

  const copy = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.className = "visually-hidden";
      document.body.append(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch { ok = false; }
      ta.remove();
      return ok;
    }
  };

  const say = (text: string): void => {
    status.textContent = text;
    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      status.textContent = defaultStatus;
      copyLabel.textContent = "Скопіювати запит";
      copyBtn.classList.remove("is-done");
    }, 4000);
  };

  chips.forEach((chip) => {
    const id = chip.dataset.chip ?? "";
    chip.addEventListener("click", () => {
      const on = chip.getAttribute("aria-pressed") !== "true";
      chip.setAttribute("aria-pressed", String(on));
      nodeEl(id)?.classList.toggle("is-on", on);
      render();
    });
    chip.addEventListener("pointerenter", () => nodeEl(id)?.classList.add("is-hover"));
    chip.addEventListener("pointerleave", () => nodeEl(id)?.classList.remove("is-hover"));
    chip.addEventListener("focus", () => nodeEl(id)?.classList.add("is-hover"));
    chip.addEventListener("blur", () => nodeEl(id)?.classList.remove("is-hover"));
  });

  // A click on a part of the drawing is the same choice as its chip.
  $$<SVGGElement>(".scheme [data-node]", picker).forEach((node) => {
    const chip = chips.find((c) => c.dataset.chip === node.dataset.node);
    if (!chip) return;
    node.addEventListener("click", () => chip.click());
    node.addEventListener("pointerenter", () => { node.classList.add("is-hover"); chip.classList.add("is-hover"); });
    node.addEventListener("pointerleave", () => { node.classList.remove("is-hover"); chip.classList.remove("is-hover"); });
  });

  brand.addEventListener("change", render);
  model.addEventListener("input", render);

  copyBtn.addEventListener("click", async () => {
    const ok = await copy(message());
    copyLabel.textContent = ok ? "Скопійовано" : "Не вдалося скопіювати";
    copyBtn.classList.toggle("is-done", ok);
    say(ok ? "Запит скопійовано. Вставте його в чат або лист." : "Не вдалося скопіювати: виділіть текст запиту вручну.");
  });

  [viber, telegram].forEach((link) => {
    link.addEventListener("click", () => {
      if (!parts().length) return;
      void copy(message()).then((ok) => { if (ok) say("Запит скопійовано: вставте його в чат KRX."); });
    });
  });

  render();
}

/* ---------- Mobile menu ---------- */
function initMenu(): void {
  const menu = $<HTMLElement>("[data-menu]");
  const openBtn = $<HTMLButtonElement>("[data-menu-open]");
  const closeBtn = $<HTMLButtonElement>("[data-menu-close]");
  if (!menu || !openBtn || !closeBtn) return;

  const focusables = () => $$<HTMLElement>('a[href], button, [tabindex="0"]', menu);
  const close = (restore = true): void => {
    menu.hidden = true;
    openBtn.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("menu-open");
    if (restore) openBtn.focus();
  };
  const open = (): void => {
    menu.hidden = false;
    openBtn.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("menu-open");
    focusables()[1]?.focus();
  };

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", () => close());
  $$<HTMLAnchorElement>("[data-menu-link]", menu).forEach((a) => a.addEventListener("click", () => close(false)));
  menu.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { close(); return; }
    if (e.key !== "Tab") return;
    const list = focusables();
    const first = list[0];
    const last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  });
  window.matchMedia("(min-width: 60rem)").addEventListener("change", (e) => { if (e.matches && !menu.hidden) close(false); });
}

/* ---------- Header hairline and mobile call bar ---------- */
function initChrome(): void {
  const header = $<HTMLElement>("[data-header]");
  const bar = $<HTMLElement>("[data-callbar]");
  const hero = $<HTMLElement>("#pidbir");
  if (header) {
    let ticking = false;
    const update = () => { header.classList.toggle("is-scrolled", window.scrollY > 4); ticking = false; };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }
  if (bar && hero && "IntersectionObserver" in window) {
    const set = (show: boolean) => {
      bar.classList.toggle("is-shown", show);
      bar.inert = !show;
    };
    set(false);
    new IntersectionObserver(([entry]) => set(!entry.isIntersecting), { threshold: 0 }).observe(hero);
  }
}

/* ---------- Conditions: an accordion on phones, an open register on wider screens ---------- */
function initTerms(): void {
  const terms = $$<HTMLElement>("[data-term]");
  if (!terms.length) return;
  const phone = window.matchMedia("(max-width: 39.99rem)");
  const set = (term: HTMLElement, open: boolean): void => {
    const btn = term.querySelector<HTMLButtonElement>(".term__toggle");
    const body = term.querySelector<HTMLElement>(".term__body");
    btn?.setAttribute("aria-expanded", String(open));
    if (body) body.hidden = !open;
  };
  const apply = (): void => terms.forEach((t, i) => set(t, phone.matches ? i === 0 : true));
  terms.forEach((t) => {
    t.querySelector<HTMLButtonElement>(".term__toggle")?.addEventListener("click", (e) => {
      const btn = e.currentTarget as HTMLButtonElement;
      set(t, btn.getAttribute("aria-expanded") !== "true");
    });
  });
  phone.addEventListener("change", apply);
  apply();
}

initPicker();
initMenu();
initChrome();
initTerms();
