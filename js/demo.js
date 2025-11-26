/**
 * XCred Demo - Interactive Tweet Popup Logic
 * All tweets and profiles shown are 100% FICTIONAL for demonstration purposes only.
 */

const DEMO_PROFILES = {
  'parody-russia': {
    status: 'SUSPICIOUS',
    statusClass: 'tier-5',
    tier: 5,
    vpn: true,
    vpnWarning: 'VPN/Proxy detected - Location may be masked',
    accountBasedIn: 'Netherlands',
    accountBasedInNote: '(IP-derived)',
    connectedVia: 'Russian Federation App Store (iOS)',
    accountAge: '47 days',
    usernameChanges: 4,
    verification: 'None',
    score: -6,
    factors: [
      { text: 'Web platform', value: '-1', negative: true },
      { text: 'Location mismatch (NL app, RU store)', value: '-3', negative: true },
      { text: 'VPN detected from suspicious region', value: '-4', negative: true },
      { text: 'Multiple username changes (4)', value: '-2', negative: true },
      { text: 'Account less than 90 days old', value: '-1', negative: true },
      { text: 'Unverified account', value: '+0', negative: false }
    ]
  },
  'parody-india': {
    status: 'SUSPICIOUS',
    statusClass: 'tier-5',
    tier: 5,
    vpn: true,
    vpnWarning: 'VPN/Proxy detected - Location may be masked',
    accountBasedIn: 'United States',
    accountBasedInNote: '(IP-derived)',
    connectedVia: 'India Google Play (Android)',
    accountAge: '2 months',
    usernameChanges: 3,
    verification: 'None',
    score: -4,
    factors: [
      { text: 'Android platform', value: '+0', negative: false },
      { text: 'Location mismatch (US IP, IN store)', value: '-3', negative: true },
      { text: 'VPN detected', value: '-2', negative: true },
      { text: 'Multiple username changes (3)', value: '-1', negative: true },
      { text: 'Account less than 90 days old', value: '-1', negative: true },
      { text: 'Unverified account', value: '+0', negative: false }
    ]
  },
  'parody-venezuela': {
    status: 'LOW CREDIBILITY',
    statusClass: 'tier-4',
    tier: 4,
    vpn: false,
    accountBasedIn: 'Venezuela',
    accountBasedInNote: '(IP-derived)',
    connectedVia: 'Web Browser',
    accountAge: '8 months',
    usernameChanges: 2,
    verification: 'None',
    score: -1,
    factors: [
      { text: 'Web platform', value: '-1', negative: true },
      { text: 'Location consistent', value: '+1', negative: false },
      { text: 'Username changes (2)', value: '-1', negative: true },
      { text: 'Account age 6-12 months', value: '+0', negative: false },
      { text: 'Unverified account', value: '+0', negative: false }
    ]
  },
  'parody-gov-dem': {
    status: 'GOVERNMENT',
    statusClass: 'tier-gov',
    tier: 'gov',
    vpn: false,
    accountBasedIn: 'United States',
    accountBasedInNote: '(Verified)',
    connectedVia: 'iOS App Store (United States)',
    accountAge: '12 years',
    usernameChanges: 0,
    verification: 'Government Official',
    party: 'Democrat',
    partyIcon: 'donkey',
    score: 'N/A',
    factors: [
      { text: 'Government verified account', value: 'GOV', negative: false },
      { text: 'iOS platform', value: '+1', negative: false },
      { text: 'Location verified', value: '+2', negative: false },
      { text: 'Account age 10+ years', value: '+3', negative: false },
      { text: 'No username changes', value: '+1', negative: false }
    ]
  },
  'parody-gov-rep': {
    status: 'GOVERNMENT',
    statusClass: 'tier-gov',
    tier: 'gov',
    vpn: false,
    accountBasedIn: 'United States',
    accountBasedInNote: '(Verified)',
    connectedVia: 'iOS App Store (United States)',
    accountAge: '9 years',
    usernameChanges: 0,
    verification: 'Government Official',
    party: 'Republican',
    partyIcon: 'elephant',
    score: 'N/A',
    factors: [
      { text: 'Government verified account', value: 'GOV', negative: false },
      { text: 'iOS platform', value: '+1', negative: false },
      { text: 'Location verified', value: '+2', negative: false },
      { text: 'Account age 5+ years', value: '+3', negative: false },
      { text: 'No username changes', value: '+1', negative: false }
    ]
  },
  'parody-legitimate': {
    status: 'HIGHLY CREDIBLE',
    statusClass: 'tier-1',
    tier: 1,
    vpn: false,
    accountBasedIn: 'United States',
    accountBasedInNote: '(IP-derived)',
    connectedVia: 'iOS App Store (United States)',
    accountAge: '6 years',
    usernameChanges: 0,
    verification: 'X Blue',
    score: 8,
    factors: [
      { text: 'iOS platform', value: '+1', negative: false },
      { text: 'Location match (US IP, US store)', value: '+2', negative: false },
      { text: 'Account age 5+ years', value: '+3', negative: false },
      { text: 'No username changes', value: '+1', negative: false },
      { text: 'X Blue verified', value: '+2', negative: false }
    ]
  }
};

/**
 * Generate popup HTML matching extension's popup structure 1:1
 */
function generatePopupHTML(profileId) {
  const profile = DEMO_PROFILES[profileId];
  if (!profile) return '';

  const isGov = profile.tier === 'gov';

  let html = `
    <div class="demo-popup-header ${profile.statusClass}">
      ${profile.status}
    </div>
    <div class="demo-popup-content">
  `;

  // VPN Warning
  if (profile.vpn) {
    html += `
      <div class="demo-popup-warning">
        ⚠️ ${profile.vpnWarning}
      </div>
    `;
  }

  // Government party affiliation
  if (isGov && profile.party) {
    html += `
      <div class="demo-popup-row demo-popup-party">
        <strong>Party Affiliation</strong>
        <span>
          <img src="assets/icons/${profile.partyIcon}.svg" alt="${profile.party}" class="demo-party-icon">
          ${profile.party}
        </span>
      </div>
    `;
  }

  // Account Based In
  html += `
    <div class="demo-popup-row">
      <strong>Account based in</strong>
      <span>${profile.accountBasedIn} ${profile.accountBasedInNote}</span>
    </div>
  `;

  // Connected Via
  html += `
    <div class="demo-popup-row">
      <strong>Connected via</strong>
      <span>${profile.connectedVia}</span>
    </div>
  `;

  // Account Age
  html += `
    <div class="demo-popup-row">
      <strong>Account age</strong>
      <span>${profile.accountAge}</span>
    </div>
  `;

  // Username Changes
  html += `
    <div class="demo-popup-row">
      <strong>Username changes</strong>
      <span>${profile.usernameChanges}</span>
    </div>
  `;

  // Verification Status
  html += `
    <div class="demo-popup-row">
      <strong>Verification</strong>
      <span>${profile.verification}</span>
    </div>
  `;

  // Score (not shown for government accounts)
  if (!isGov) {
    html += `
      <div class="demo-popup-row demo-popup-score">
        <strong>Credibility Score</strong>
        <span class="${profile.statusClass}">${profile.score}</span>
      </div>
    `;
  }

  // Score Breakdown
  html += `
    <div class="demo-popup-breakdown">
      <strong>Score Breakdown</strong>
      <ul>
  `;

  profile.factors.forEach(factor => {
    const className = factor.negative ? 'negative' : 'positive';
    html += `<li class="${className}"><span>${factor.text}</span><span>${factor.value}</span></li>`;
  });

  html += `
      </ul>
    </div>
  `;

  html += `</div>`;

  return html;
}

/**
 * Initialize demo popup functionality
 */
function initDemoPopups() {
  // Get or create the dialog element
  let dialog = document.getElementById('demo-popup-dialog');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'demo-popup-dialog';
    dialog.className = 'demo-popup';
    dialog.innerHTML = '<div class="demo-popup-inner"></div>';
    document.body.appendChild(dialog);
  }

  const popupInner = dialog.querySelector('.demo-popup-inner');

  // Close on backdrop click
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.close();
    }
  });

  // Close on ESC key (native dialog behavior, but ensure it works)
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dialog.close();
    }
  });

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

      // Generate and insert popup content
      popupInner.innerHTML = generatePopupHTML(profileId);

      // Show the dialog
      dialog.showModal();

      // Add animation class
      dialog.classList.add('show');
    });

    // Keyboard accessibility
    indicator.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        indicator.click();
      }
    });
  });

  // Remove animation class when dialog closes
  dialog.addEventListener('close', () => {
    dialog.classList.remove('show');
  });
}

/**
 * Flag fallback handling - load from local assets first
 */
function initFlagFallbacks() {
  document.querySelectorAll('.demo-flag').forEach(flag => {
    flag.addEventListener('error', function() {
      const countryCode = this.dataset.country;
      // Fallback to emoji if local SVG fails
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
