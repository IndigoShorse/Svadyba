const intro = document.querySelector('#intro');
const envelope = document.querySelector('#envelope');
const openButton = document.querySelector('#openInvitation');
const invitation = document.querySelector('#invitation');
const introGreeting = document.querySelector('.introl');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let mapViewer = null;
let mapViewerImage = null;

function showVisibleElements() {
  document.querySelectorAll('.reveal').forEach((element) => {
    if (element.getBoundingClientRect().top < window.innerHeight * 0.92) {
      element.classList.add('is-shown');
    }
  });
}

async function loadNameGuide() {
  try {
    const response = await fetch('./data/names.json');
    if (!response.ok) {
      throw new Error('Не удалось загрузить справочник имён');
    }

    return response.json();
  } catch (error) {
    console.warn(error);
    return [];
  }
}

function getGreetingByGender(gender, name) {
  if (gender === 'Ж') {
    return `Уважаемая ${name}`;
  }

  if (gender === 'М') {
    return `Уважаемый ${name}`;
  }

  return `Уважаемый(ая) ${name}`;
}

function closeMapViewer() {
  if (!mapViewer) {
    return;
  }

  mapViewer.classList.remove('is-open');
  mapViewer.setAttribute('aria-hidden', 'true');
  mapViewerImage.removeAttribute('src');
  mapViewerImage.removeAttribute('alt');
  document.body.classList.remove('has-map-viewer');
}

function openMapViewer(image) {
  if (!mapViewer) {
    mapViewer = document.createElement('div');
    mapViewer.className = 'map-viewer';
    mapViewer.setAttribute('aria-hidden', 'true');
    mapViewer.innerHTML = '<img class="map-viewer__image" alt="">';
    document.body.append(mapViewer);
    mapViewerImage = mapViewer.querySelector('.map-viewer__image');

    mapViewer.addEventListener('click', (event) => {
      if (event.target === mapViewer) {
        closeMapViewer();
      }
    });
  }

  mapViewerImage.src = image.currentSrc || image.src;
  mapViewerImage.alt = image.alt || 'Увеличенная карта';
  mapViewer.classList.add('is-open');
  mapViewer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('has-map-viewer');
}

async function setGreetingFromQuery() {
  if (!introGreeting) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const userId = params.get('user_id') || params.get('name_id') || params.get('id');

  if (!userId) {
    introGreeting.textContent = 'Уважаемый(ая) гость(я)!';
    return;
  }

  const names = await loadNameGuide();
  const entry = names.find((item) => String(item.id) === String(userId));

  if (!entry) {
    introGreeting.textContent = 'Уважаемый(ая) гость(я)!';
    return;
  }

  const displayName = entry.aliases?.[0] || entry.name;
  introGreeting.textContent = getGreetingByGender(entry.gender, displayName);
}

async function loadInvitationContent() {
  if (!invitation) {
    return;
  }

  try {
    const response = await fetch('./invitation-content.html');
    if (!response.ok) {
      throw new Error('Не удалось загрузить содержимое приглашения');
    }

    const html = await response.text();
    invitation.innerHTML = html;
    invitation.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
  } catch (error) {
    console.warn(error);
    invitation.innerHTML = '<p class="reveal">Не удалось загрузить содержимое приглашения.</p>';
  }
}

openButton.addEventListener('click', () => {
  envelope.classList.add('is-open');
  openButton.setAttribute('aria-expanded', 'true');

  window.setTimeout(() => {
    invitation.classList.add('is-visible');
    invitation.setAttribute('aria-hidden', 'false');
    intro.classList.add('is-gone');
    document.body.classList.remove('is-locked');
    window.scrollTo(0, 0);
    showVisibleElements();
  }, reducedMotion ? 0 : 1650);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-shown');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
setGreetingFromQuery();
loadInvitationContent();

document.addEventListener('click', (event) => {
  const mapImage = event.target.closest('.place-card__map');

  if (!mapImage) {
    return;
  }

  openMapViewer(mapImage);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMapViewer();
  }
});
