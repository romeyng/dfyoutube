/**
 * Distraction Free YouTube - Content Script
 */

(function () {
  'use strict';

  // Default configuration
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

  let currentSettings = { ...DEFAULT_SETTINGS };

  // Focus Quotes for intentionality
  const FOCUS_QUOTES = [
    "Starve your distractions, feed your focus.",
    "Intentionality beats the algorithm every time.",
    "Watch what you came for, then get back to creating.",
    "The algorithm wants your attention. What do you want?",
    "Protect your attention like your most valuable currency.",
    "Depth over distraction."
  ];

  /**
   * Fast synchronous initialization to eliminate flash of content (FOUC).
   */
  function initSync() {
    try {
      const cached = sessionStorage.getItem('df_yt_settings');
      if (cached) {
        currentSettings = Object.assign({}, DEFAULT_SETTINGS, JSON.parse(cached));
      }
    } catch (e) {
      // Storage access error fallback
    }
    applyClasses(currentSettings);
  }

  /**
   * Apply CSS classes to <html> based on settings
   */
  function applyClasses(settings) {
    const root = document.documentElement;
    if (!root) return;

    if (!settings.enabled) {
      root.classList.remove(
        'df-hide-home-feed',
        'df-hide-left-sidebar',
        'df-hide-watch-sidebar',
        'df-hide-shorts',
        'df-hide-comments',
        'df-comments-while-playing-only',
        'df-video-playing',
        'df-hide-endscreen'
      );
      removeFocusContainer();
      return;
    }

    toggleClass(root, 'df-hide-home-feed', settings.hideHomeFeed);
    toggleClass(root, 'df-hide-left-sidebar', settings.hideLeftSidebar);
    toggleClass(root, 'df-hide-watch-sidebar', settings.hideWatchSidebar);
    toggleClass(root, 'df-hide-shorts', settings.hideShorts);
    toggleClass(root, 'df-hide-comments', settings.hideComments);
    toggleClass(root, 'df-comments-while-playing-only', settings.hideCommentsWhilePlayingOnly);
    toggleClass(root, 'df-hide-endscreen', settings.hideEndscreen);

    checkHomePage();
    setupVideoListeners();
  }

  function toggleClass(element, className, condition) {
    if (condition) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }

  /**
   * Check if current location is YouTube Home and handle focus screen
   */
  function isHomePage() {
    const path = window.location.pathname;
    return path === '/' || path === '';
  }

  function checkHomePage() {
    if (!currentSettings.enabled || !currentSettings.hideHomeFeed || !currentSettings.showHomeFocus) {
      removeFocusContainer();
      return;
    }

    if (isHomePage()) {
      injectFocusContainer();
    } else {
      removeFocusContainer();
    }

    // Handle shorts redirect
    if (currentSettings.enabled && currentSettings.redirectShorts) {
      handleShortsRedirect();
    }
  }

  /**
   * Redirect /shorts/VIDEO_ID to regular /watch?v=VIDEO_ID
   */
  function handleShortsRedirect() {
    const match = window.location.pathname.match(/^\/shorts\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const videoId = match[1];
      const newUrl = `${window.location.origin}/watch?v=${videoId}`;
      window.location.replace(newUrl);
    }
  }

  /**
   * Inject Clean Focus Screen into Home page
   */
  function injectFocusContainer() {
    if (document.getElementById('df-focus-container')) {
      return;
    }

    const homeBrowse = document.querySelector('ytd-browse[page-subtype="home"]');
    if (!homeBrowse) {
      // DOM not yet ready, will be caught by observer
      return;
    }

    const randomQuote = FOCUS_QUOTES[Math.floor(Math.random() * FOCUS_QUOTES.length)];

    const container = document.createElement('div');
    container.id = 'df-focus-container';
    container.innerHTML = `
      <div class="df-focus-badge">
        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        Focus Mode Active
      </div>
      <h1 class="df-focus-title">Distraction-Free YouTube</h1>
      <p class="df-focus-subtitle">Search for intentional content or jump directly to your library.</p>
      
      <form class="df-search-form" id="df-internal-search-form">
        <input 
          type="text" 
          class="df-search-input" 
          id="df-search-input" 
          placeholder="What do you want to learn or watch today?" 
          autocomplete="off"
          spellcheck="false"
        />
        <button type="submit" class="df-search-btn" title="Search">
          <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        </button>
      </form>

      <div class="df-shortcuts">
        <a href="/feed/subscriptions" class="df-shortcut-pill">
          <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"/></svg>
          Subscriptions
        </a>
        <a href="/feed/library" class="df-shortcut-pill">
          <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
          Library
        </a>
        <a href="/playlist?list=WL" class="df-shortcut-pill">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/></svg>
          Watch Later
        </a>
        <a href="/feed/history" class="df-shortcut-pill">
          <svg viewBox="0 0 24 24"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
          History
        </a>
      </div>

      <div class="df-quote">"${randomQuote}"</div>
    `;

    // Insert at beginning of homeBrowse or prepend to primary
    homeBrowse.prepend(container);

    // Attach search submit listener
    const form = document.getElementById('df-internal-search-form');
    const input = document.getElementById('df-search-input');

    if (form && input) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = input.value.trim();
        if (query) {
          window.location.href = `/results?search_query=${encodeURIComponent(query)}`;
        }
      });

      // Auto-focus input without jarring scroll
      setTimeout(() => {
        input.focus({ preventScroll: true });
      }, 100);
    }
  }

  function removeFocusContainer() {
    const existing = document.getElementById('df-focus-container');
    if (existing) {
      existing.remove();
    }
  }

  /**
   * Track video playback state to hide comments while playing
   */
  function updateVideoPlayState(video) {
    const root = document.documentElement;
    if (!root) return;

    if (video && !video.paused && !video.ended && video.readyState > 1) {
      root.classList.add('df-video-playing');
    } else {
      root.classList.remove('df-video-playing');
    }
  }

  function setupVideoListeners() {
    const videos = document.querySelectorAll('video');
    if (!videos || !videos.length) {
      document.documentElement.classList.remove('df-video-playing');
      return;
    }

    videos.forEach((video) => {
      if (video.__df_bound) {
        updateVideoPlayState(video);
        return;
      }
      video.__df_bound = true;

      const handler = () => updateVideoPlayState(video);
      video.addEventListener('play', handler);
      video.addEventListener('playing', handler);
      video.addEventListener('pause', handler);
      video.addEventListener('ended', handler);
      video.addEventListener('emptied', handler);
      video.addEventListener('timeupdate', () => {
        if (!video.paused && !document.documentElement.classList.contains('df-video-playing')) {
          updateVideoPlayState(video);
        }
      });

      updateVideoPlayState(video);
    });
  }

  /**
   * Observe page mutations to handle SPA navigation & asynchronous loading
   */
  function setupObserver() {
    const observer = new MutationObserver(() => {
      if (isHomePage()) {
        const homeBrowse = document.querySelector('ytd-browse[page-subtype="home"]');
        if (homeBrowse && !document.getElementById('df-focus-container')) {
          checkHomePage();
        }
      }
      setupVideoListeners();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  /**
   * YouTube SPA navigation event listeners
   */
  function setupNavigationListeners() {
    const handleNav = () => {
      checkHomePage();
      setupVideoListeners();
    };

    window.addEventListener('yt-navigate-finish', handleNav);
    window.addEventListener('yt-page-data-updated', handleNav);
    window.addEventListener('popstate', handleNav);
  }

  /**
   * Extension storage and live messaging listeners
   */
  function setupStorageListener() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get(DEFAULT_SETTINGS, (items) => {
        currentSettings = items;
        try {
          sessionStorage.setItem('df_yt_settings', JSON.stringify(items));
        } catch (e) {}
        applyClasses(currentSettings);
      });

      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync') {
          for (let key in changes) {
            currentSettings[key] = changes[key].newValue;
          }
          try {
            sessionStorage.setItem('df_yt_settings', JSON.stringify(currentSettings));
          } catch (e) {}
          applyClasses(currentSettings);
        }
      });
    }

    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener((message) => {
        if (message && message.type === 'DF_UPDATE_SETTINGS') {
          currentSettings = message.settings;
          try {
            sessionStorage.setItem('df_yt_settings', JSON.stringify(currentSettings));
          } catch (e) {}
          applyClasses(currentSettings);
        }
      });
    }
  }

  // Execute synchronously
  initSync();

  // Initialize remaining listeners
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupNavigationListeners();
      setupObserver();
      setupStorageListener();
    });
  } else {
    setupNavigationListeners();
    setupObserver();
    setupStorageListener();
  }
})();
