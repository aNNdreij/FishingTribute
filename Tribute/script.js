//Sicherung damit das Script erst startet wenn das html geladen ist
document.addEventListener("DOMContentLoaded", () => {

// Höhe des Headers herausfinden
function getHeaderHeight() {
    const header = document.querySelector('header');
    return header ? header.offsetHeight : 0;
}

//Helfer zum scrollen mit Versatz
function scrollToWithOffset(targetSelector) {
    const el = document.querySelector(targetSelector);
    if (!el) return;

    const headerH = getHeaderHeight();
    const rect = el.getBoundingClientRect();
    const absoluteTop = window.pageYOffset + rect.top;

    //Sanft scrollen 
    window.scrollTo({
        top: absoluteTop - headerH - 10,
        behavior: 'smooth'
    });
}

//Klick auf den mehr erfahren button abfangen
const moreBtn = document.querySelector('.btn[href="#about"]');
if (moreBtn) {
    moreBtn.addEventListener('click', function (e) {
        e.preventDefault();
        scrollToWithOffset ('#about');
    });
}



//Scroll Spy (Sammeln aller Sektions IDS die im Menü vorkommen)
const sections = Array.from(document.querySelectorAll('main > section[id]'));
const navLinks = Array.from(document.querySelectorAll('nav.primary a'));

//Hilfsfunktion aktiven Link setzen
function setActiveLink(id) {
    navLinks.forEach(a => {
        const isActive = a.getAttribute('href') === `#${id}`;
        a.classList.toggle('active', isActive);
    });
}

//Beobachter meldet wenn die Sektion zu 50% sichtbar ist
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
        }
    });
}, {
    root:null, //
    threshold: 0.5
});

//Beobachtung aller Sektionen
sections.forEach(sec => observer.observe(sec));

//Die Klicks auf die Menülinks scrollen mit versatz
navLinks.forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToWithOffset(href);
        });
    }
});
});

//Gallerie und Lightbox(Bei klick auf ein Thumbnail wird es gross und die Caption ist im overlay)
document.addEventListener("DOMContentLoaded", () => {

    const lihtbox = document.querySelector(".lightbox");
    const backdrop = document.querySelector(".lightbox-backdrop");
    const imgEl = document.querySelector(".lightbox-image");
    const capEl = document.querySelector(".lightbox-caption");
    const closeBtn = document.querySelector(".lightbox-close");

//Öffnen der Thumbnails mit klick (link mit href)
const thumbs = Array.from (document.querySelectorAll(".gallery-item"));
thumbs.forEach(a => {
    a.addEventListener("click", (e) => {
        e.preventDefault(); 

        //Grosse Bild-Url kommt aus href, Caption von data-caption
        const fullSrc = a.getAttribute("href");
        const caption = a.dataset.caption || a.querySelector("img")?.alt || "";

        //Bild und Caption in die Lightbox eingesetzt
        imgEl.src = fullSrc;
        imgEl.alt = caption || "Vollbild";
        capEl.textContent = caption;

        //Lightbox wird sichtbar und aria setzen
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");

        //verhindern vom Scrollen im Hintergrund
        document.body.style.overflow = "hidden";
        //Focus auf den Close Button
        closeBtn.focus();
    });
});

//Schliessen mit Button, klick auf Hintergrund oder ESC
function closeLightbox() {
    lightbox.classlist.remove("is-open"),
    lightbox.setAttribute("aria-hidden", "true");
    imgEl.src = ""; //entladen
    document.body.style.overflow = ""; //Scroll geht wieder
}

closeBtn.addEventListener("click", closeLightbox);
backdrop.addEventListener("click", closeLightbox);

document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
});
});