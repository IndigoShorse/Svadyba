const intro = document.querySelector('#intro');
const envelope = document.querySelector('#envelope');
const openButton = document.querySelector('#openInvitation');
const invitation = document.querySelector('#invitation');
const introGreeting = document.querySelector('.introl');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
