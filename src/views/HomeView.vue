<template>
  <div class="min-h-screen flex flex-col">

    <AppHeader @open-emergency="$emit('openEmergency')" />

    <!-- Sensitive Banner -->
    <Transition name="banner-slide">
      <div v-if="sensitiveDetected" class="mx-4 sm:mx-8 mb-2 overflow-hidden">
        <div class="relative flex items-center gap-3 sm:gap-4 bg-red-100/60 border border-red-200/50 backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-3 sm:py-4 cursor-pointer group" @click="$emit('openEmergency')">
          <span class="relative flex h-3 w-3 shrink-0">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
          <p class="text-sm sm:text-base text-red-700 leading-snug flex-1">
            <span class="font-semibold">Du scheinst gerade etwas Schweres zu durchleben.</span>
            <span class="text-red-500"> Hier findest du sofortige Hilfe und Unterstützung. →</span>
          </p>
          <button class="shrink-0 p-1 rounded-full hover:bg-red-100/50 transition-colors" @click.stop="dismissBanner">
            <XIcon class="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>
    </Transition>

    <!-- Zentrum -->
    <div class="flex-1 flex flex-col items-center justify-center px-4 sm:px-6">
      <div class="w-full max-w-4xl">

        <!-- Logo SVG – Liquid Glass -->
        <div class="flex justify-center mb-6 sm:mb-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 298.43 71.54" class="h-20 sm:h-28 md:h-36 w-auto" overflow="visible" fill="none">
            <path class="logo-shadow" fill-rule="evenodd" d="M111.29,0c9.28,.82,15.15,5.37,21.36,9.36,2.48,1.59,6.54,5.47,11.52,4.08,3.68-1.52,7.36-3.04,11.04-4.56-.23-7.33,9.07-7.75,10.32-1.92,1.77,8.24-10.3,5.31-13.68,8.64-2.93,2.88-1.64,10.34-5.52,12.24-1.65,.46-2.55-.12-3.12-1.44-.64-1.74,.8-3.55,1.2-5.28-1.31,1.04-1.65,2.16-3.84,2.4-.77-.39-1.01-.44-1.44-1.2-1.16-1.75,.32-2.97,.96-4.32-5.94-.23-9.32-3.63-14.16-4.8-4.64,.16-9.28,.32-13.92,.48-.56-.48-1.12-.96-1.68-1.44,.08-.64,.16-1.28,.24-1.92,2.82-1.93,6.98-.67,10.8-2.16v-.24c-1.52-.43-10.96-3.17-11.52-4.08-.43-.61-.62-1.34-.24-2.16,.46-.99,.87-1.08,1.68-1.68Zm181.92,11.52c6.18,.13,5.04,5.65,5.04,11.76V56.4c0,5.12,1.14,12.44-2.4,14.16-1.18,.71-2.57,.37-3.84,0-1.25-1.54-2.12-2.38-2.16-5.28-.16,.08-.32,.16-.48,.24-2.19,4.74-11.02,7.13-17.76,5.04-7.14-2.21-15.21-9.9-13.44-20.64,1.46-8.83,5.45-14.86,13.2-17.28,6.94-2.16,16.19,.25,18.24,5.28h.24c-.14-8.71-1.98-22.82,3.36-26.4Zm-179.04,2.4c6.85,.07,7.53,6.1,9.6,10.8,4.72,9.84,9.44,19.68,14.16,29.52l.48-.24c5.12-10.72,10.24-21.44,15.36-32.16,1.5-2.95,2.54-9.34,8.16-7.92,4.54,1.14,3.47,8.57,4.32,13.44,1.04,8.56,2.08,17.12,3.12,25.68,.84,4.84,2.41,11.43,1.2,16.32-1.29,.99-1.67,1.65-4.08,1.68-1.63-.52-2.69-.92-3.36-2.4-1.13-2.07-.72-5.12-1.2-7.92-1.28-10.08-2.56-20.16-3.84-30.24v.48l-12.24,24.48c-1.31,2.95-2.62,7.84-5.52,9.12-5.16,2.28-7.06-3.11-8.4-5.76-4.56-9.36-9.12-18.72-13.68-28.08h-.24c-1.2,9.76-2.4,19.52-3.6,29.28-.64,3.66,.15,8.58-2.64,10.08-1.85,1.77-4.49,.65-6-.48-1.06-3.95-.02-9.16,.72-13.44,1.12-9.2,2.24-18.4,3.36-27.6,1.07-6.22,.08-11.66,4.32-14.64Zm-111.36,.24c2.41-.05,3.22,.55,4.56,1.44,4.4,13.52,8.8,27.04,13.2,40.56h.24c1.84-6.48,3.68-12.96,5.52-19.44,1.46-4.78,2.01-10.64,4.56-14.4,1.78-.56,3.06-.7,5.04-.24,4.38,6.24,8.41,25.45,10.56,34.08h.24c3.36-10.4,6.72-20.8,10.08-31.2,1.29-3.66,1.53-9.11,5.04-10.56,3.86-1.12,6.61,1.96,5.52,5.76-4.24,12.32-8.48,24.64-12.72,36.96-1.32,3.76-2.29,11.59-5.52,13.44-2.22,1.27-5.49,.03-6.48-1.44-2.96-10.64-5.92-21.28-8.88-31.92l-.24,.48c-4.88,9.77-4.05,23.98-10.08,32.64-7.45,2.18-7.7-3.94-9.6-9.36-3.68-10.72-7.36-21.44-11.04-32.16-1.51-4.29-4.42-9.8-1.68-13.92,.56-.24,1.12-.48,1.68-.72ZM81.29,31.92c12.35-.26,23.7,7.27,21.12,20.4-2.7,3.68-22.97,2.24-30,2.16v.24c1.98,5.95,7.84,12.01,16.56,8.4,3.14-1.3,4.22-4.34,8.88-3.6,4.47,3.3-.3,6.91-3.12,8.64-5.8,3.56-15.78,4.08-21.84,.24-7.63-4.83-12.05-19.42-5.28-28.8,3.45-4.78,7.67-5.24,13.68-7.68Zm110.64,0c28-.61,28.97,35.15,4.32,39.36-14.6,2.5-26.26-13.38-20.88-27.12,3.16-8.06,8.37-9.01,16.56-12.24Zm41.76,0c28-.61,28.97,35.15,4.32,39.36-14.6,2.5-26.26-13.38-20.88-27.12,3.16-8.06,8.37-9.01,16.56-12.24ZM94.49,48.48h-22.08c1.29-5.8,4.03-6.87,8.88-9.12,7.9-.23,12.28,2.51,13.2,9.12Zm101.28,14.64c-8.54,1.65-15.26-6.44-12.96-14.88,1.38-5.08,4.82-6.14,9.36-8.16,16.91-.5,17.61,20.34,3.6,23.04Zm41.76,0c-8.54,1.65-15.26-6.44-12.96-14.88,1.38-5.08,4.82-6.14,9.36-8.16,16.91-.5,17.61,20.34,3.6,23.04Zm42.48,0c-8.54,1.65-15.26-6.44-12.96-14.88,1.39-5.12,4.77-6.14,9.36-8.16,16.82-.49,17.64,20.33,3.6,23.04Z"/>
            <path class="logo-edge" fill-rule="evenodd" d="M111.29,0c9.28,.82,15.15,5.37,21.36,9.36,2.48,1.59,6.54,5.47,11.52,4.08,3.68-1.52,7.36-3.04,11.04-4.56-.23-7.33,9.07-7.75,10.32-1.92,1.77,8.24-10.3,5.31-13.68,8.64-2.93,2.88-1.64,10.34-5.52,12.24-1.65,.46-2.55-.12-3.12-1.44-.64-1.74,.8-3.55,1.2-5.28-1.31,1.04-1.65,2.16-3.84,2.4-.77-.39-1.01-.44-1.44-1.2-1.16-1.75,.32-2.97,.96-4.32-5.94-.23-9.32-3.63-14.16-4.8-4.64,.16-9.28,.32-13.92,.48-.56-.48-1.12-.96-1.68-1.44,.08-.64,.16-1.28,.24-1.92,2.82-1.93,6.98-.67,10.8-2.16v-.24c-1.52-.43-10.96-3.17-11.52-4.08-.43-.61-.62-1.34-.24-2.16,.46-.99,.87-1.08,1.68-1.68Zm181.92,11.52c6.18,.13,5.04,5.65,5.04,11.76V56.4c0,5.12,1.14,12.44-2.4,14.16-1.18,.71-2.57,.37-3.84,0-1.25-1.54-2.12-2.38-2.16-5.28-.16,.08-.32,.16-.48,.24-2.19,4.74-11.02,7.13-17.76,5.04-7.14-2.21-15.21-9.9-13.44-20.64,1.46-8.83,5.45-14.86,13.2-17.28,6.94-2.16,16.19,.25,18.24,5.28h.24c-.14-8.71-1.98-22.82,3.36-26.4Zm-179.04,2.4c6.85,.07,7.53,6.1,9.6,10.8,4.72,9.84,9.44,19.68,14.16,29.52l.48-.24c5.12-10.72,10.24-21.44,15.36-32.16,1.5-2.95,2.54-9.34,8.16-7.92,4.54,1.14,3.47,8.57,4.32,13.44,1.04,8.56,2.08,17.12,3.12,25.68,.84,4.84,2.41,11.43,1.2,16.32-1.29,.99-1.67,1.65-4.08,1.68-1.63-.52-2.69-.92-3.36-2.4-1.13-2.07-.72-5.12-1.2-7.92-1.28-10.08-2.56-20.16-3.84-30.24v.48l-12.24,24.48c-1.31,2.95-2.62,7.84-5.52,9.12-5.16,2.28-7.06-3.11-8.4-5.76-4.56-9.36-9.12-18.72-13.68-28.08h-.24c-1.2,9.76-2.4,19.52-3.6,29.28-.64,3.66,.15,8.58-2.64,10.08-1.85,1.77-4.49,.65-6-.48-1.06-3.95-.02-9.16,.72-13.44,1.12-9.2,2.24-18.4,3.36-27.6,1.07-6.22,.08-11.66,4.32-14.64Zm-111.36,.24c2.41-.05,3.22,.55,4.56,1.44,4.4,13.52,8.8,27.04,13.2,40.56h.24c1.84-6.48,3.68-12.96,5.52-19.44,1.46-4.78,2.01-10.64,4.56-14.4,1.78-.56,3.06-.7,5.04-.24,4.38,6.24,8.41,25.45,10.56,34.08h.24c3.36-10.4,6.72-20.8,10.08-31.2,1.29-3.66,1.53-9.11,5.04-10.56,3.86-1.12,6.61,1.96,5.52,5.76-4.24,12.32-8.48,24.64-12.72,36.96-1.32,3.76-2.29,11.59-5.52,13.44-2.22,1.27-5.49,.03-6.48-1.44-2.96-10.64-5.92-21.28-8.88-31.92l-.24,.48c-4.88,9.77-4.05,23.98-10.08,32.64-7.45,2.18-7.7-3.94-9.6-9.36-3.68-10.72-7.36-21.44-11.04-32.16-1.51-4.29-4.42-9.8-1.68-13.92,.56-.24,1.12-.48,1.68-.72ZM81.29,31.92c12.35-.26,23.7,7.27,21.12,20.4-2.7,3.68-22.97,2.24-30,2.16v.24c1.98,5.95,7.84,12.01,16.56,8.4,3.14-1.3,4.22-4.34,8.88-3.6,4.47,3.3-.3,6.91-3.12,8.64-5.8,3.56-15.78,4.08-21.84,.24-7.63-4.83-12.05-19.42-5.28-28.8,3.45-4.78,7.67-5.24,13.68-7.68Zm110.64,0c28-.61,28.97,35.15,4.32,39.36-14.6,2.5-26.26-13.38-20.88-27.12,3.16-8.06,8.37-9.01,16.56-12.24Zm41.76,0c28-.61,28.97,35.15,4.32,39.36-14.6,2.5-26.26-13.38-20.88-27.12,3.16-8.06,8.37-9.01,16.56-12.24ZM94.49,48.48h-22.08c1.29-5.8,4.03-6.87,8.88-9.12,7.9-.23,12.28,2.51,13.2,9.12Zm101.28,14.64c-8.54,1.65-15.26-6.44-12.96-14.88,1.38-5.08,4.82-6.14,9.36-8.16,16.91-.5,17.61,20.34,3.6,23.04Zm41.76,0c-8.54,1.65-15.26-6.44-12.96-14.88,1.38-5.08,4.82-6.14,9.36-8.16,16.91-.5,17.61,20.34,3.6,23.04Zm42.48,0c-8.54,1.65-15.26-6.44-12.96-14.88,1.39-5.12,4.77-6.14,9.36-8.16,16.82-.49,17.64,20.33,3.6,23.04Z"/>
            <path class="logo-glass-fill" fill-rule="evenodd" d="M111.29,0c9.28,.82,15.15,5.37,21.36,9.36,2.48,1.59,6.54,5.47,11.52,4.08,3.68-1.52,7.36-3.04,11.04-4.56-.23-7.33,9.07-7.75,10.32-1.92,1.77,8.24-10.3,5.31-13.68,8.64-2.93,2.88-1.64,10.34-5.52,12.24-1.65,.46-2.55-.12-3.12-1.44-.64-1.74,.8-3.55,1.2-5.28-1.31,1.04-1.65,2.16-3.84,2.4-.77-.39-1.01-.44-1.44-1.2-1.16-1.75,.32-2.97,.96-4.32-5.94-.23-9.32-3.63-14.16-4.8-4.64,.16-9.28,.32-13.92,.48-.56-.48-1.12-.96-1.68-1.44,.08-.64,.16-1.28,.24-1.92,2.82-1.93,6.98-.67,10.8-2.16v-.24c-1.52-.43-10.96-3.17-11.52-4.08-.43-.61-.62-1.34-.24-2.16,.46-.99,.87-1.08,1.68-1.68Zm181.92,11.52c6.18,.13,5.04,5.65,5.04,11.76V56.4c0,5.12,1.14,12.44-2.4,14.16-1.18,.71-2.57,.37-3.84,0-1.25-1.54-2.12-2.38-2.16-5.28-.16,.08-.32,.16-.48,.24-2.19,4.74-11.02,7.13-17.76,5.04-7.14-2.21-15.21-9.9-13.44-20.64,1.46-8.83,5.45-14.86,13.2-17.28,6.94-2.16,16.19,.25,18.24,5.28h.24c-.14-8.71-1.98-22.82,3.36-26.4Zm-179.04,2.4c6.85,.07,7.53,6.1,9.6,10.8,4.72,9.84,9.44,19.68,14.16,29.52l.48-.24c5.12-10.72,10.24-21.44,15.36-32.16,1.5-2.95,2.54-9.34,8.16-7.92,4.54,1.14,3.47,8.57,4.32,13.44,1.04,8.56,2.08,17.12,3.12,25.68,.84,4.84,2.41,11.43,1.2,16.32-1.29,.99-1.67,1.65-4.08,1.68-1.63-.52-2.69-.92-3.36-2.4-1.13-2.07-.72-5.12-1.2-7.92-1.28-10.08-2.56-20.16-3.84-30.24v.48l-12.24,24.48c-1.31,2.95-2.62,7.84-5.52,9.12-5.16,2.28-7.06-3.11-8.4-5.76-4.56-9.36-9.12-18.72-13.68-28.08h-.24c-1.2,9.76-2.4,19.52-3.6,29.28-.64,3.66,.15,8.58-2.64,10.08-1.85,1.77-4.49,.65-6-.48-1.06-3.95-.02-9.16,.72-13.44,1.12-9.2,2.24-18.4,3.36-27.6,1.07-6.22,.08-11.66,4.32-14.64Zm-111.36,.24c2.41-.05,3.22,.55,4.56,1.44,4.4,13.52,8.8,27.04,13.2,40.56h.24c1.84-6.48,3.68-12.96,5.52-19.44,1.46-4.78,2.01-10.64,4.56-14.4,1.78-.56,3.06-.7,5.04-.24,4.38,6.24,8.41,25.45,10.56,34.08h.24c3.36-10.4,6.72-20.8,10.08-31.2,1.29-3.66,1.53-9.11,5.04-10.56,3.86-1.12,6.61,1.96,5.52,5.76-4.24,12.32-8.48,24.64-12.72,36.96-1.32,3.76-2.29,11.59-5.52,13.44-2.22,1.27-5.49,.03-6.48-1.44-2.96-10.64-5.92-21.28-8.88-31.92l-.24,.48c-4.88,9.77-4.05,23.98-10.08,32.64-7.45,2.18-7.7-3.94-9.6-9.36-3.68-10.72-7.36-21.44-11.04-32.16-1.51-4.29-4.42-9.8-1.68-13.92,.56-.24,1.12-.48,1.68-.72ZM81.29,31.92c12.35-.26,23.7,7.27,21.12,20.4-2.7,3.68-22.97,2.24-30,2.16v.24c1.98,5.95,7.84,12.01,16.56,8.4,3.14-1.3,4.22-4.34,8.88-3.6,4.47,3.3-.3,6.91-3.12,8.64-5.8,3.56-15.78,4.08-21.84,.24-7.63-4.83-12.05-19.42-5.28-28.8,3.45-4.78,7.67-5.24,13.68-7.68Zm110.64,0c28-.61,28.97,35.15,4.32,39.36-14.6,2.5-26.26-13.38-20.88-27.12,3.16-8.06,8.37-9.01,16.56-12.24Zm41.76,0c28-.61,28.97,35.15,4.32,39.36-14.6,2.5-26.26-13.38-20.88-27.12,3.16-8.06,8.37-9.01,16.56-12.24ZM94.49,48.48h-22.08c1.29-5.8,4.03-6.87,8.88-9.12,7.9-.23,12.28,2.51,13.2,9.12Zm101.28,14.64c-8.54,1.65-15.26-6.44-12.96-14.88,1.38-5.08,4.82-6.14,9.36-8.16,16.91-.5,17.61,20.34,3.6,23.04Zm41.76,0c-8.54,1.65-15.26-6.44-12.96-14.88,1.38-5.08,4.82-6.14,9.36-8.16,16.91-.5,17.61,20.34,3.6,23.04Zm42.48,0c-8.54,1.65-15.26-6.44-12.96-14.88,1.39-5.12,4.77-6.14,9.36-8.16,16.82-.49,17.64,20.33,3.6,23.04Z"/>
          </svg>
        </div>

        <!-- Greeting (logged in) -->
        <Transition name="greeting-fade">
          <p v-if="isLoggedIn" class="text-center text-gray-600 mb-4 text-base sm:text-lg nav-label-dark">
            Hallo, <span class="font-semibold text-gray-800">{{ currentUser?.name }}</span> 👋
          </p>
        </Transition>

        <!-- Suchleiste -->
        <form @submit.prevent="handleSearch" class="mb-6 sm:mb-8">
          <div class="relative" ref="searchContainer">
            <input
                ref="searchInput"
                v-model="searchQuery"
                type="text"
                placeholder="Suche nach Themen..."
                autocomplete="off"
                @focus="showSuggestions = true"
                @keydown.down.prevent="moveSuggestion(1)"
                @keydown.up.prevent="moveSuggestion(-1)"
                @keydown.enter.prevent="selectOrSearch"
                @keydown.escape="showSuggestions = false"
                :class="[
                  'w-full glass rounded-full px-7 sm:px-9 py-4 sm:py-5 pr-28 sm:pr-36 text-base sm:text-lg placeholder:text-gray-400/70 text-gray-800 font-medium outline-none transition-all',
                  searchError ? 'border-orange-300/70' : sensitiveDetected ? 'border-red-300/70' : 'focus:bg-white/30 focus:shadow-lg'
                ]"
            />
            <button
                type="submit"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 sm:px-7 py-2 sm:py-3 glass rounded-full hover:bg-white/35 transition-all flex items-center gap-2 text-gray-700 text-sm sm:text-base font-bold nav-label"
            >
              <SearchIcon class="w-4 h-4 sm:w-5 sm:h-5" />
              <span class="hidden sm:inline">Suchen</span>
            </button>

            <!-- Autocomplete dropdown -->
            <Transition name="dropdown">
              <div v-if="showSuggestions && visibleSuggestions.length > 0" class="absolute top-full left-0 right-0 mt-2 glass-strong rounded-2xl overflow-hidden z-50">
                <button
                  v-for="(s, i) in visibleSuggestions" :key="s.text"
                  type="button"
                  @mousedown.prevent="selectSuggestion(s.text)"
                  class="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-white/25 transition-colors border-b border-white/10 last:border-0"
                  :class="{ 'bg-white/20': activeSuggestion === i }"
                >
                  <component :is="s.icon" class="w-4 h-4 shrink-0" :class="s.iconClass" />
                  <span class="text-sm text-gray-800 flex-1 nav-label-dark">
                    <span class="font-semibold">{{ s.text.slice(0, searchQuery.length) }}</span>{{ s.text.slice(searchQuery.length) }}
                  </span>
                  <span class="text-xs text-gray-500 nav-label-dark">{{ s.hint }}</span>
                </button>
              </div>
            </Transition>
          </div>

          <Transition name="fade-slide">
            <p v-if="searchError" class="text-sm text-orange-500 mt-2 ml-4 nav-label-dark">
              Bitte gib etwas ein, bevor du suchst 🔍
            </p>
          </Transition>
        </form>

        <!-- Emotion Filter -->
        <div class="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-10 sm:mb-14">
          <button
              v-for="emotion in emotions"
              :key="emotion.value"
              @click="toggleEmotion(emotion.value)"
              :class="[
              'px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border transition-all text-sm sm:text-base font-semibold',
              selectedEmotions.includes(emotion.value)
                ? 'glass border-white/40 text-gray-800 shadow-md bg-white/30 nav-label'
                : 'glass-subtle text-gray-600 hover:bg-white/25 nav-label-dark'
            ]"
          >
            {{ emotion.label }}
          </button>
        </div>

        <!-- Personalized Recommendations (logged in only) -->
        <Transition name="fade-slide">
          <div v-if="isLoggedIn && recommendations.length > 0" class="mb-8 sm:mb-10">
            <div class="flex items-center gap-2 mb-3 px-1">
              <SparklesIcon class="w-4 h-4 text-gray-500" />
              <span class="text-sm text-gray-600 font-medium nav-label-dark">{{ recommendationLabel }}</span>
            </div>
            <div class="flex gap-3 overflow-x-auto pb-3 suggestions-scroll">
              <router-link
                v-for="rec in recommendations" :key="rec.id"
                :to="'/article/' + rec.id"
                class="flex-shrink-0 flex items-center gap-3 glass rounded-2xl px-4 py-3 hover:bg-white/30 transition-all max-w-xs"
              >
                <span class="text-2xl">{{ rec.emoji }}</span>
                <span class="text-sm font-medium text-gray-700 line-clamp-2 leading-snug nav-label-dark">{{ rec.title }}</span>
              </router-link>
            </div>
          </div>
        </Transition>

        <!-- Bibliothek -->
        <router-link
            to="/library"
            class="flex flex-col items-center gap-1 mx-auto w-fit group transition-opacity hover:opacity-85"
        >
          <span class="nav-label-dark text-3xl sm:text-4xl font-quicksand text-white font-bold group-hover:text-white transition-colors">
            Bibliothek
          </span>
          <ChevronDownIcon class="nav-icon-dark w-10 h-10 sm:w-12 sm:h-12 text-white/90 stroke-[2.5] group-hover:text-white transition-colors" />
        </router-link>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search as SearchIcon,
  ChevronDown as ChevronDownIcon,
  X as XIcon,
  Sparkles as SparklesIcon,
  Clock as ClockIcon,
  Heart as HeartIcon,
} from 'lucide-vue-next'
import AppHeader from '../components/AppHeader.vue'
import { useAuth } from '../composables/useAuth.js'
import { getArticleHistory, getFavorites, getAllArticles } from '../services/api.js'

const router = useRouter()
const { currentUser, isLoggedIn } = useAuth()

defineEmits(['openEmergency'])

const searchQuery      = ref('')
const searchError      = ref(false)
const selectedEmotions = ref([])
const bannerDismissed  = ref(false)
const searchContainer  = ref(null)
const searchInput      = ref(null)
const showSuggestions  = ref(false)
const activeSuggestion = ref(-1)

const recommendations     = ref([])
const recommendationLabel = ref('Empfehlungen für dich')
const allArticles         = ref([])
const historyTitles       = ref([])
const favoriteTitles      = ref([])

const suggestionPool = [
  'Angststörung', 'Angst', 'Angstattacke', 'Angstbewältigung',
  'Depression', 'Depressionen', 'Depressiv',
  'Stress', 'Stressbewältigung', 'Stressabbau',
  'Trauma', 'Traumabewältigung', 'PTBS',
  'Schlafstörung', 'Schlafprobleme', 'Schlafen',
  'Burnout', 'Erschöpfung', 'Panikattacke', 'Panikstörung',
  'Selbstwert', 'Selbstvertrauen', 'Selbstfürsorge',
  'Achtsamkeit', 'Meditation', 'Entspannung',
  'Einsamkeit', 'Soziale Angst', 'Essstörung', 'Magersucht', 'Bulimie',
  'Kognitive Verhaltenstherapie', 'KVT', 'Psychotherapie',
  'Resilienz', 'Wohlbefinden', 'Mentale Gesundheit',
  'Trauer', 'Verlust', 'Traurigkeit',
  'Konzentration', 'Konzentrationsprobleme', 'ADHS',
  'Sucht', 'Abhängigkeit'
]

const sensitiveKeywords = [
  'suizid', 'suicide', 'selbstmord', 'selbstverletzung', 'self-harm', 'self harm',
  'sterben', 'sterben wollen', 'nicht mehr leben', 'tod', 'töten', 'umbringen',
  'hoffnungslos', 'hoffnungslosigkeit', 'depression', 'verzweiflung', 'krise',
  'crisis', 'harming', 'cutting', 'overdose', 'überdosis', 'missbrauch', 'abuse',
  'trauma', 'panic attack', 'panikattacke', 'angststörung', 'eating disorder',
  'essstörung', 'magersucht', 'anorexia', 'bulimia'
]

const sensitiveDetected = computed(() => {
  if (bannerDismissed.value) return false
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return false
  return sensitiveKeywords.some(kw => q.includes(kw))
})

const visibleSuggestions = computed(() => {
  const q = searchQuery.value.trim()
  if (!q || q.length < 2) return []
  const qLower = q.toLowerCase()
  const results = []

  historyTitles.value
    .filter(t => t.toLowerCase().startsWith(qLower))
    .slice(0, 2)
    .forEach(t => results.push({ text: t, hint: 'Verlauf', icon: ClockIcon, iconClass: 'text-gray-400' }))

  favoriteTitles.value
    .filter(t => t.toLowerCase().startsWith(qLower) && !results.find(r => r.text === t))
    .slice(0, 2)
    .forEach(t => results.push({ text: t, hint: 'Favorit', icon: HeartIcon, iconClass: 'text-red-400' }))

  suggestionPool
    .filter(t => t.toLowerCase().startsWith(qLower) && !results.find(r => r.text.toLowerCase() === t.toLowerCase()))
    .slice(0, 5 - results.length)
    .forEach(t => results.push({ text: t, hint: 'Vorschlag', icon: SearchIcon, iconClass: 'text-gray-400/60' }))

  return results.slice(0, 6)
})

watch(searchQuery, () => { activeSuggestion.value = -1 })

function moveSuggestion(dir) {
  const max = visibleSuggestions.value.length - 1
  if (max < 0) return
  activeSuggestion.value = Math.max(-1, Math.min(max, activeSuggestion.value + dir))
}

function selectSuggestion(text) {
  searchQuery.value = text
  showSuggestions.value = false
  activeSuggestion.value = -1
}

function selectOrSearch() {
  if (activeSuggestion.value >= 0 && visibleSuggestions.value[activeSuggestion.value]) {
    selectSuggestion(visibleSuggestions.value[activeSuggestion.value].text)
  } else {
    handleSearch()
  }
}

function handleClickOutside(e) {
  if (searchContainer.value && !searchContainer.value.contains(e.target)) {
    showSuggestions.value = false
  }
}

async function loadRecommendations() {
  if (!isLoggedIn.value) return
  try {
    const [history, favorites, articles] = await Promise.all([
      getArticleHistory({ limit: 20 }),
      getFavorites(),
      getAllArticles()
    ])
    allArticles.value    = articles
    historyTitles.value  = history.map(h => h.article_title).filter(Boolean)
    favoriteTitles.value = favorites.map(f => f.article_title).filter(Boolean)

    const tagScore = {}
    const seen = new Set([...history.map(h => h.article_id), ...favorites.map(f => f.article_id)])

    history.forEach(h => { tokenize(h.article_title).forEach(t => { tagScore[t] = (tagScore[t] || 0) + 1 }) })
    favorites.forEach(f => { tokenize(f.article_title).forEach(t => { tagScore[t] = (tagScore[t] || 0) + 2 }) })

    if (Object.keys(tagScore).length === 0) return

    const scored = articles
      .filter(a => !seen.has(a.id))
      .map(a => ({ ...a, score: tokenize(a.title).reduce((sum, t) => sum + (tagScore[t] || 0), 0) }))
      .sort((a, b) => b.score - a.score)

    const top = scored.filter(a => a.score > 0).slice(0, 6)
    if (top.length > 0) {
      recommendations.value = top
      recommendationLabel.value = favorites.length > 0 ? 'Basierend auf deinen Favoriten' : 'Basierend auf deinem Verlauf'
    } else if (articles.length > 0) {
      recommendations.value = articles.slice(0, 4)
      recommendationLabel.value = 'Entdecke diese Artikel'
    }
  } catch (e) {
    console.warn('Recommendations failed:', e.message)
  }
}

function tokenize(title) {
  if (!title) return []
  return title.toLowerCase().replace(/[–\-]/g, ' ').split(/\s+/).filter(t => t.length > 3)
}

watch(searchQuery, (newVal, oldVal) => {
  if (newVal.toLowerCase().trim() !== oldVal.toLowerCase().trim()) bannerDismissed.value = false
  showSuggestions.value = true
})

function dismissBanner() { bannerDismissed.value = true }

const emotions = [
  { label: 'Fear',      value: 'fear'      },
  { label: 'Sadness',   value: 'sadness'   },
  { label: 'Happiness', value: 'happiness' },
  { label: 'Stress',    value: 'stress'    },
  { label: 'Energy',    value: 'energy'    },
  { label: 'Calm',      value: 'calm'      }
]

function toggleEmotion(emotion) {
  if (selectedEmotions.value.includes(emotion)) {
    selectedEmotions.value = selectedEmotions.value.filter(e => e !== emotion)
  } else {
    selectedEmotions.value = [...selectedEmotions.value, emotion]
  }
}

function handleSearch() {
  if (!searchQuery.value.trim()) {
    searchError.value = true
    setTimeout(() => { searchError.value = false }, 2500)
    return
  }
  searchError.value = false
  showSuggestions.value = false
  router.push({ name: 'search', query: { q: searchQuery.value.trim(), emotions: selectedEmotions.value.join(',') } })
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (isLoggedIn.value) loadRecommendations()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.logo-shadow { fill: rgba(0,0,0,0.12); filter: blur(6px); transform: translate(0, 3px); }
.logo-edge { fill: none; stroke: rgba(255,255,255,0.5); stroke-width: 0.8; }
.logo-glass-fill { fill: rgba(255,255,255,0.25); }
.nav-label-dark { text-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 0 8px rgba(0,0,0,0.15); }
.nav-label { text-shadow: 0 1px 4px rgba(255,255,255,0.6), 0 0 12px rgba(255,255,255,0.4); }
.nav-icon-dark { filter: drop-shadow(0 1px 3px rgba(0,0,0,0.3)); }

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.25s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(-4px); }

.dropdown-enter-active { transition: all 0.15s ease; }
.dropdown-leave-active { transition: all 0.1s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px); }

.greeting-fade-enter-active { transition: all 0.4s ease; }
.greeting-fade-enter-from { opacity: 0; transform: translateY(4px); }

.banner-slide-enter-active { animation: bannerIn 0.4s cubic-bezier(0.34, 1.2, 0.64, 1); }
.banner-slide-leave-active { animation: bannerOut 0.25s ease-in forwards; }

@keyframes bannerIn {
  from { opacity: 0; transform: translateY(-8px) scale(0.98); max-height: 0; }
  to   { opacity: 1; transform: translateY(0) scale(1); max-height: 200px; }
}
@keyframes bannerOut {
  from { opacity: 1; max-height: 200px; }
  to   { opacity: 0; max-height: 0; }
}

.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* Suggestions scroll row — thin, rounded scrollbar */
.suggestions-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(160,130,220,0.4) transparent;
}
.suggestions-scroll::-webkit-scrollbar { height: 4px; }
.suggestions-scroll::-webkit-scrollbar-track { background: transparent; }
.suggestions-scroll::-webkit-scrollbar-thumb {
  background: rgba(160,130,220,0.45);
  border-radius: 99px;
}
.suggestions-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(140,110,200,0.65);
}
</style>