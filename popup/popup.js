/**
 * Distraction Free YouTube - Popup Controller
 */

(function () {
  'use strict';

  const DEFAULT_SETTINGS = {
    enabled: true,
    hideHomeFeed: true,
    hideLeftSidebar: true,
    hideWatchSidebar: true,
    hideShorts: true,
    hideComments: true,
    hideCommentsWhilePlayingOnly: false,
    hideEndscreen: true,
    showHomeFocus: true,
    redirectShorts: true
  };

  const settingKeys = Object.keys(DEFAULT_SETTINGS);

  // DOM Elements
  const masterToggle = document.getElementById('toggle-enabled');
  const statusBanner = document.getElementById('status-banner');
  const statusText = document.getElementById('status-text');
  const controlsList = document.getElementById('controls-list');
  const resetBtn = document.getElementById('reset-defaults-btn');
  const commentsSubCard = document.getElementById('card-comments-while-playing');

  /**
   * Update sub-card visual enabled/disabled state based on parent toggle
   */
  function updateCommentsSubcardState() {
    const hideCommentsToggle = document.getElementById('toggle-hideComments');
    if (hideCommentsToggle && commentsSubCard) {
      const isCommentsHidden = hideCommentsToggle.checked;
      commentsSubCard.style.opacity = isCommentsHidden ? '1' : '0.4';
      commentsSubCard.style.pointerEvents = isCommentsHidden ? 'auto' : 'none';
    }
  }

  /**
   * Load settings from chrome.storage and initialize UI
   */
  function loadSettings() {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
      settingKeys.forEach((key) => {
        const toggle = document.getElementById(`toggle-${key}`);
        if (toggle) {
          toggle.checked = Boolean(settings[key]);
        }
      });
      updateMasterUI(settings.enabled);
      updateCommentsSubcardState();
    });
  }

  /**
   * Update Master state visuals
   */
  function updateMasterUI(isEnabled) {
    if (isEnabled) {
      statusBanner.classList.remove('paused');
      statusText.textContent = 'Focus Mode is Active';
      controlsList.classList.remove('disabled');
    } else {
      statusBanner.classList.add('paused');
      statusText.textContent = 'Focus Mode is Paused';
      controlsList.classList.add('disabled');
    }
  }

  /**
   * Gather current settings from UI
   */
  function getCurrentSettingsFromUI() {
    const settings = {};
    settingKeys.forEach((key) => {
      const toggle = document.getElementById(`toggle-${key}`);
      if (toggle) {
        settings[key] = toggle.checked;
      }
    });
    return settings;
  }

  /**
   * Save settings to storage and notify active YouTube tabs
   */
  function saveAndNotify() {
    const settings = getCurrentSettingsFromUI();

    chrome.storage.sync.set(settings, () => {
      updateMasterUI(settings.enabled);
      updateCommentsSubcardState();
      notifyTabs(settings);
    });
  }

  /**
   * Broadcast updated settings to open YouTube tabs
   */
  function notifyTabs(settings) {
    if (!chrome.tabs) return;

    chrome.tabs.query({ url: '*://*.youtube.com/*' }, (tabs) => {
      if (!tabs || !tabs.length) return;

      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            type: 'DF_UPDATE_SETTINGS',
            settings: settings
          }).catch(() => {
            // Tab might be in background or not ready
          });
        }
      });
    });
  }

  /**
   * Reset settings to factory defaults
   */
  function resetDefaults() {
    chrome.storage.sync.set(DEFAULT_SETTINGS, () => {
      settingKeys.forEach((key) => {
        const toggle = document.getElementById(`toggle-${key}`);
        if (toggle) {
          toggle.checked = DEFAULT_SETTINGS[key];
        }
      });
      updateMasterUI(DEFAULT_SETTINGS.enabled);
      updateCommentsSubcardState();
      notifyTabs(DEFAULT_SETTINGS);
    });
  }

  // Event Listeners
  document.addEventListener('DOMContentLoaded', () => {
    loadSettings();

    // Attach change handlers to all toggles
    settingKeys.forEach((key) => {
      const toggle = document.getElementById(`toggle-${key}`);
      if (toggle) {
        toggle.addEventListener('change', saveAndNotify);
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', resetDefaults);
    }
  });
})();
