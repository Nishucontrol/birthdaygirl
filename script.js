const birthday = { month: 6, day: 31, birthYear: 2004 }; // July is month 6 in JavaScript

function nextBirthday() {
  const now = new Date();
  let target = new Date(now.getFullYear(), birthday.month, birthday.day, 0, 0, 0);
  if (now > target) target = new Date(now.getFullYear() + 1, birthday.month, birthday.day, 0, 0, 0);
  return target;
}

function updateCountdown() {
  const now = new Date();
  const target = nextBirthday();
  const remaining = Math.max(0, target - now);
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining / 3600000) % 24);
  const minutes = Math.floor((remaining / 60000) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);
  const pad = n => String(n).padStart(2, "0");
  document.querySelector('#days').textContent = pad(days);
  document.querySelector('#hours').textContent = pad(hours);
  document.querySelector('#minutes').textContent = pad(minutes);
  document.querySelector('#seconds').textContent = pad(seconds);

  const age = target.getFullYear() - birthday.birthYear;
  const suffix = (age % 10 === 1 && age % 100 !== 11) ? 'st' : (age % 10 === 2 && age % 100 !== 12) ? 'nd' : (age % 10 === 3 && age % 100 !== 13) ? 'rd' : 'th';
  document.querySelector('#birthday-line').textContent =
    days === 0 ? `It’s Nishu’s ${age}${suffix} birthday — let the magic begin! ✦` : `July 31 is written in the stars ✦`;
}

updateCountdown();
setInterval(updateCountdown, 1000);

document.querySelectorAll('.reason-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.reason-card').forEach(item => item.classList.remove('active'));
    card.classList.add('active');
    document.querySelector('#reason-reveal').textContent = card.dataset.note;
  });
});

document.querySelector('#wish-btn').addEventListener('click', event => {
  const cakeScene = document.querySelector('.cake-scene');
  cakeScene.classList.add('lit');
  event.currentTarget.setAttribute('aria-label', 'The birthday candle is lit');
  document.querySelector('#touch-note').textContent = 'Your candle is glowing, birthday girl ✦';
  document.querySelector('#wish-message').textContent = 'Happy Birthday, Nishu! May every dream in your heart find its way to you. ♡';
  for (let i = 0; i < 22; i++) {
    const sparkle = document.createElement('span');
    sparkle.textContent = '✦';
    sparkle.className = 'sparkle';
    sparkle.style.left = `${48 + (Math.random() - .5) * 52}%`;
    sparkle.style.top = `${80 + (Math.random() - .5) * 26}%`;
    sparkle.style.setProperty('--x', `${(Math.random() - .5) * 260}px`);
    sparkle.style.setProperty('--y', `${-80 - Math.random() * 200}px`);
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1400);
  }
});
