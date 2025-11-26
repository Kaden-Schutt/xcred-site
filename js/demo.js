/**
 * XCred Demo - Interactive Tweet Popup Logic
 * All tweets and profiles shown are 100% FICTIONAL for demonstration purposes only.
 * Popup design matches the real XCred extension 1:1
 */

const DEMO_PROFILES = {
  'parody-russia': {
    isGov: false,
    status: 'SUSPICIOUS',
    statusClass: 'tier-5',
    tier: 5,
    vpn: true,
    vpnWarning: 'X has indicated this account may be connecting via a proxy or VPN, which may change the displayed location.',
    accountBasedIn: 'Netherlands',
    connectedVia: 'Russian Federation App Store',
    accountAge: '47 days',
    usernameChanges: 4,
    verification: 'None',
    score: -6,
    factors: [
      { text: 'Web platform (less trusted)', value: '-1', positive: false },
      { text: 'Location mismatch (NL IP, RU store)', value: '-3', positive: false },
      { text: 'VPN detected from suspicious region', value: '-4', positive: false },
      { text: 'Multiple username changes (4)', value: '-2', positive: false }
    ]
  },
  'parody-india': {
    isGov: false,
    status: 'SUSPICIOUS',
    statusClass: 'tier-5',
    tier: 5,
    vpn: true,
    vpnWarning: 'X has indicated this account may be connecting via a proxy or VPN, which may change the displayed location.',
    accountBasedIn: 'United States',
    connectedVia: 'India Google Play (Android)',
    accountAge: '2 months',
    usernameChanges: 3,
    verification: 'None',
    score: -4,
    factors: [
      { text: 'Android platform', value: '+0', positive: true },
      { text: 'Location mismatch (US IP, IN store)', value: '-3', positive: false },
      { text: 'VPN detected', value: '-2', positive: false },
      { text: 'Multiple username changes (3)', value: '-1', positive: false }
    ]
  },
  'parody-venezuela': {
    isGov: false,
    status: 'LOW CREDIBILITY',
    statusClass: 'tier-4',
    tier: 4,
    vpn: false,
    accountBasedIn: 'Venezuela',
    connectedVia: 'Web',
    accountAge: '8 months',
    usernameChanges: 2,
    verification: 'None',
    score: -1,
    factors: [
      { text: 'Web platform (less trusted)', value: '-1', positive: false },
      { text: 'Location consistent', value: '+1', positive: true },
      { text: 'Username changes (2)', value: '-1', positive: false }
    ]
  },
  'parody-gov-dem': {
    isGov: true,
    status: 'Government Verified',
    statusClass: 'tier-gov',
    tier: 'gov',
    party: 'Democratic Party',
    partyIcon: 'donkey',
    partyClass: 'democrat'
  },
  'parody-gov-rep': {
    isGov: true,
    status: 'Government Verified',
    statusClass: 'tier-gov',
    tier: 'gov',
    party: 'Republican Party',
    partyIcon: 'elephant',
    partyClass: 'republican'
  },
  'parody-legitimate': {
    isGov: false,
    status: 'Highest Credibility',
    statusClass: 'tier-1',
    tier: 1,
    vpn: false,
    accountBasedIn: 'United States',
    connectedVia: 'United States App Store',
    accountAge: '6 years',
    usernameChanges: 2,
    verification: 'Blue verified',
    score: 6,
    factors: [
      { text: 'iOS platform', value: '+1', positive: true },
      { text: 'iOS + geo match', value: '+3', positive: true },
      { text: 'Blue verified', value: '+2', positive: true }
    ]
  }
};

/**
 * Generate popup HTML matching extension's popup structure 1:1
 */
function generatePopupHTML(profileId) {
  const profile = DEMO_PROFILES[profileId];
  if (!profile) return '';

  // Government account popup
  if (profile.isGov) {
    return `
      <div class="xloc-popup-header">
        <span class="xloc-popup-title">Government Account</span>
        <button class="xloc-popup-close" aria-label="Close">&times;</button>
      </div>
      <div class="xloc-popup-status ${profile.statusClass}">${profile.status}</div>
      <div class="xloc-popup-body">
        <div class="xloc-popup-row xloc-party-row ${profile.partyClass}">
          <img src="assets/icons/${profile.partyIcon}.svg" alt="" class="xloc-party-icon">
          <span>${profile.party}</span>
        </div>
      </div>
      <div class="xloc-popup-footer">This account has been verified by X as an official government account.</div>
    `;
  }

  // Regular account popup
  let html = `
    <div class="xloc-popup-header">
      <span class="xloc-popup-title">Location Info</span>
      <button class="xloc-popup-close" aria-label="Close">&times;</button>
    </div>
    <div class="xloc-popup-status ${profile.statusClass}">${profile.status}</div>
  `;

  // VPN Warning
  if (profile.vpn) {
    html += `
      <div class="xloc-popup-warning">
        <strong>⚠ Warning:</strong> ${profile.vpnWarning}
      </div>
    `;
  }

  html += `<div class="xloc-popup-body">`;

  // Account Based In
  html += `
    <div class="xloc-popup-row">
      <span class="xloc-row-label">Account based in</span>
      <span class="xloc-row-value">${profile.accountBasedIn}</span>
    </div>
  `;

  // Connected Via
  html += `
    <div class="xloc-popup-row">
      <span class="xloc-row-label">Connected via</span>
      <span class="xloc-row-value">${profile.connectedVia}</span>
    </div>
  `;

  // Username Changes
  html += `
    <div class="xloc-popup-row">
      <span class="xloc-row-label">Username changes</span>
      <span class="xloc-row-value">${profile.usernameChanges}</span>
    </div>
  `;

  // Verification
  html += `
    <div class="xloc-popup-row">
      <span class="xloc-row-label">Verification</span>
      <span class="xloc-row-value">${profile.verification}</span>
    </div>
  `;

  // Credibility Score
  html += `
    <div class="xloc-popup-row xloc-score-row">
      <span class="xloc-row-label">Credibility Score</span>
      <span class="xloc-row-value xloc-score ${profile.statusClass}">${profile.score > 0 ? '+' : ''}${profile.score}</span>
    </div>
  `;

  // Score Factors (as pills)
  if (profile.factors && profile.factors.length > 0) {
    html += `<div class="xloc-factors">`;
    profile.factors.forEach(factor => {
      const pillClass = factor.positive ? 'positive' : 'negative';
      html += `<span class="xloc-factor ${pillClass}">${factor.value} ${factor.text}</span>`;
    });
    html += `</div>`;
  }

  html += `</div>`;

  // Footer
  html += `<div class="xloc-popup-footer">Data from X's account transparency info</div>`;

  return html;
}

// Currently open popup element
let activePopup = null;

/**
 * Close any open popup
 */
function closePopup() {
  if (activePopup) {
    activePopup.remove();
    activePopup = null;
  }
}

/**
 * Show popup below the indicator
 */
function showPopup(indicator, profileId) {
  closePopup();

  const popup = document.createElement('div');
  popup.className = 'xloc-popup';
  popup.innerHTML = generatePopupHTML(profileId);

  // Position popup below the indicator
  document.body.appendChild(popup);

  const rect = indicator.getBoundingClientRect();
  const popupRect = popup.getBoundingClientRect();

  // Position below and slightly to the right of the indicator
  let left = rect.left + window.scrollX - 10;
  let top = rect.bottom + window.scrollY + 8;

  // Ensure popup doesn't go off screen
  if (left + popupRect.width > window.innerWidth) {
    left = window.innerWidth - popupRect.width - 20;
  }
  if (left < 10) left = 10;

  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;

  // Add close button handler
  const closeBtn = popup.querySelector('.xloc-popup-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closePopup();
    });
  }

  activePopup = popup;

  // Close on click outside
  setTimeout(() => {
    document.addEventListener('click', handleOutsideClick);
  }, 10);
}

function handleOutsideClick(e) {
  if (activePopup && !activePopup.contains(e.target) && !e.target.closest('.demo-xcred-indicator')) {
    closePopup();
    document.removeEventListener('click', handleOutsideClick);
  }
}

/**
 * Initialize demo popup functionality
 */
function initDemoPopups() {
  // Attach click handlers to all demo indicators
  document.querySelectorAll('.demo-xcred-indicator').forEach(indicator => {
    indicator.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const profileId = indicator.dataset.profile;
      if (!profileId || !DEMO_PROFILES[profileId]) {
        console.warn('Demo profile not found:', profileId);
        return;
      }

      showPopup(indicator, profileId);
    });

    // Keyboard accessibility
    indicator.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        indicator.click();
      }
    });
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePopup();
    }
  });
}

/**
 * Flag fallback handling
 */
function initFlagFallbacks() {
  document.querySelectorAll('.demo-flag').forEach(flag => {
    flag.addEventListener('error', function() {
      const countryCode = this.dataset.country;
      const emojiMap = {
        'US': '🇺🇸', 'RU': '🇷🇺', 'IN': '🇮🇳', 'VE': '🇻🇪', 'NL': '🇳🇱'
      };
      if (emojiMap[countryCode]) {
        const emoji = document.createElement('span');
        emoji.className = 'demo-flag-emoji';
        emoji.textContent = emojiMap[countryCode];
        this.parentNode.replaceChild(emoji, this);
      }
    });
  });
}

/**
 * Initialize everything when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  initDemoPopups();
  initFlagFallbacks();
});

// Also initialize if script loads after DOMContentLoaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(() => {
    initDemoPopups();
    initFlagFallbacks();
  }, 0);
}
