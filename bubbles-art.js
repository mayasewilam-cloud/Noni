/**
 * ==============================================================================
 * BUBBLES ARTWORK GENERATOR (Extra Cute Edition 💙)
 * High-fidelity, ultra-adorable SVG vectors inspired by Bubbles from The Powerpuff Girls.
 * Glossy sparkling eyes with starry highlights, bouncy pigtails, cute blush with hearts,
 * and sweet expressive animation-ready poses.
 * ==============================================================================
 */

window.BubblesArt = (function() {
  function getSVG(mood = 'wave', width = 140, height = 140) {
    const id = 'b_' + mood + '_' + Math.floor(Math.random() * 10000);

    // Default cute sparkling eye components
    let leftEye = `
      <!-- Left Cute Eye -->
      <g>
        <circle cx="56" cy="62" r="25" fill="#FFFFFF" stroke="#103657" stroke-width="3.5"/>
        <circle cx="58" cy="62" r="17" fill="url(#eyeGrad_${id})" />
        <circle cx="60" cy="62" r="11" fill="#0C2B47" />
        <!-- Big glossy highlight -->
        <circle cx="53" cy="55" r="7" fill="#FFFFFF" />
        <!-- Star highlight -->
        <path d="M 64 66 L 65.5 69 L 68.5 70 L 65.5 71 L 64 74 L 62.5 71 L 59.5 70 L 62.5 69 Z" fill="#FFFFFF" opacity="0.9"/>
        <circle cx="52" cy="71" r="2.5" fill="#FFFFFF" opacity="0.8" />
      </g>
    `;

    let rightEye = `
      <!-- Right Cute Eye -->
      <g>
        <circle cx="104" cy="62" r="25" fill="#FFFFFF" stroke="#103657" stroke-width="3.5"/>
        <circle cx="102" cy="62" r="17" fill="url(#eyeGrad_${id})" />
        <circle cx="100" cy="62" r="11" fill="#0C2B47" />
        <!-- Big glossy highlight -->
        <circle cx="97" cy="55" r="7" fill="#FFFFFF" />
        <!-- Star highlight -->
        <path d="M 108 66 L 109.5 69 L 112.5 70 L 109.5 71 L 108 74 L 106.5 71 L 103.5 70 L 106.5 69 Z" fill="#FFFFFF" opacity="0.9"/>
        <circle cx="96" cy="71" r="2.5" fill="#FFFFFF" opacity="0.8" />
      </g>
    `;

    let mouth = `
      <!-- Joyful smile -->
      <path d="M 72 82 Q 80 94 88 82 Z" fill="#FF6B8B" stroke="#103657" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="80" cy="88" rx="4" ry="2" fill="#FFA5BA" />
    `;

    let cheeks = `
      <!-- Rosy Cheeks with little hearts -->
      <g>
        <ellipse cx="42" cy="76" rx="8" ry="5" fill="#F6B7D2" opacity="0.8" />
        <ellipse cx="118" cy="76" rx="8" ry="5" fill="#F6B7D2" opacity="0.8" />
        <path d="M 42 75 C 40 73 38 75 42 78 C 46 75 44 73 42 75 Z" fill="#FF5E89" opacity="0.6"/>
        <path d="M 118 75 C 116 73 114 75 118 78 C 122 75 120 73 118 75 Z" fill="#FF5E89" opacity="0.6"/>
      </g>
    `;

    let leftArm = `<path d="M 58 116 Q 42 120 48 132" fill="none" stroke="#FFE4D1" stroke-width="9" stroke-linecap="round" />`;
    let rightArm = `<path d="M 102 116 Q 118 120 112 132" fill="none" stroke="#FFE4D1" stroke-width="9" stroke-linecap="round" />`;
    let accessory = '';

    // Variations based on mood
    if (mood === 'wave') {
      rightArm = `
        <!-- Waving cute arm -->
        <path d="M 102 116 Q 126 98 128 82" fill="none" stroke="#FFE4D1" stroke-width="9" stroke-linecap="round" />
        <circle cx="128" cy="82" r="5" fill="#FFE4D1" />
      `;
    } else if (mood === 'excuse_me') {
      // Inquisitive hands on hips / cute attitude ("Excuse me?")
      leftArm = `
        <path d="M 58 116 Q 42 120 48 130" fill="none" stroke="#FFE4D1" stroke-width="9" stroke-linecap="round" />
      `;
      rightArm = `
        <path d="M 102 116 Q 118 120 112 130" fill="none" stroke="#FFE4D1" stroke-width="9" stroke-linecap="round" />
      `;
      mouth = `
        <ellipse cx="80" cy="83" rx="5" ry="4" fill="#FF6B8B" stroke="#103657" stroke-width="2.5" />
      `;
      // Eyebrow raised / curious look
      accessory = `
        <path d="M 46 44 Q 56 36 66 44" fill="none" stroke="#103657" stroke-width="3" stroke-linecap="round" />
        <path d="M 94 40 Q 104 32 114 42" fill="none" stroke="#103657" stroke-width="3.5" stroke-linecap="round" />
      `;
    } else if (mood === 'giggle') {
      rightArm = `
        <!-- Hand to mouth giggling -->
        <path d="M 102 116 Q 106 98 90 86" fill="none" stroke="#FFE4D1" stroke-width="9" stroke-linecap="round" />
      `;
      mouth = `
        <ellipse cx="80" cy="82" rx="4.5" ry="4.5" fill="#FF6B8B" stroke="#103657" stroke-width="2.5" />
      `;
      // Cute winking right eye
      rightEye = `
        <path d="M 92 64 Q 104 50 116 64" fill="none" stroke="#103657" stroke-width="5" stroke-linecap="round"/>
        <!-- Star next to wink -->
        <path d="M 120 54 L 121.5 57 L 124.5 58 L 121.5 59 L 120 62 L 118.5 59 L 115.5 58 L 118.5 57 Z" fill="#FFE066"/>
      `;
    } else if (mood === 'cinema') {
      accessory = `
        <!-- Cute Cinema Popcorn with Pink Heart -->
        <g transform="translate(68, 108)">
          <path d="M 4 8 L 20 8 L 18 28 L 6 28 Z" fill="#FFFFFF" stroke="#FF5E89" stroke-width="2"/>
          <line x1="9" y1="8" x2="9" y2="28" stroke="#FF5E89" stroke-width="2"/>
          <line x1="15" y1="8" x2="15" y2="28" stroke="#FF5E89" stroke-width="2"/>
          <circle cx="8" cy="6" r="3.5" fill="#FFE066"/>
          <circle cx="13" cy="4" r="4" fill="#FFE066"/>
          <circle cx="17" cy="6" r="3.5" fill="#FFE066"/>
        </g>
      `;
    } else if (mood === 'gift') {
      accessory = `
        <!-- Holding small glowing gift with bow -->
        <g transform="translate(66, 110)">
          <rect x="2" y="6" width="24" height="20" rx="3" fill="#91D5F5" stroke="#103657" stroke-width="2"/>
          <rect x="0" y="2" width="28" height="6" rx="2" fill="#D8EEFF" stroke="#103657" stroke-width="2"/>
          <line x1="14" y1="2" x2="14" y2="26" stroke="#FFFFFF" stroke-width="3"/>
          <path d="M 14 2 C 10 -4 4 0 14 2 C 24 0 18 -4 14 2" fill="#FF5E89" stroke="#103657" stroke-width="1.5"/>
        </g>
      `;
      leftArm = `<path d="M 58 116 Q 64 125 72 124" fill="none" stroke="#FFE4D1" stroke-width="8" stroke-linecap="round" />`;
      rightArm = `<path d="M 102 116 Q 96 125 88 124" fill="none" stroke="#FFE4D1" stroke-width="8" stroke-linecap="round" />`;
    } else if (mood === 'spa') {
      accessory = `
        <!-- Cute Towel Wrap Headband -->
        <path d="M 40 42 Q 80 30 120 42" fill="none" stroke="#FFFFFF" stroke-width="14" stroke-linecap="round" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"/>
        <circle cx="48" cy="42" r="6" fill="#D8EEFF"/>
        <!-- Refreshing Cucumber on Eye -->
        <circle cx="104" cy="62" r="16" fill="#68D391" stroke="#276749" stroke-width="3" />
        <circle cx="104" cy="62" r="11" fill="#9AE6B4" stroke="#276749" stroke-dasharray="2,2" stroke-width="1.5" />
      `;
      // Peaceful closed left eye
      leftEye = `
        <path d="M 46 64 Q 58 76 70 64" fill="none" stroke="#103657" stroke-width="4.5" stroke-linecap="round"/>
      `;
    } else if (mood === 'coffee') {
      accessory = `
        <g transform="translate(68, 108)">
          <!-- Coffee Mug -->
          <rect x="4" y="4" width="20" height="22" rx="4" fill="#91D5F5" stroke="#103657" stroke-width="2"/>
          <path d="M 24 9 Q 29 9 29 15 Q 29 21 24 21" fill="none" stroke="#103657" stroke-width="2.5"/>
          <!-- Sweet Heart Steam -->
          <path d="M 14 0 C 12 -3 9 -1 14 3 C 19 -1 16 -3 14 0 Z" fill="#FF5E89" opacity="0.8"/>
        </g>
      `;
      leftArm = `<path d="M 58 116 Q 64 125 72 122" fill="none" stroke="#FFE4D1" stroke-width="8" stroke-linecap="round" />`;
      rightArm = `<path d="M 102 116 Q 96 125 88 122" fill="none" stroke="#FFE4D1" stroke-width="8" stroke-linecap="round" />`;
    } else if (mood === 'camera') {
      accessory = `
        <g transform="translate(64, 108)">
          <rect x="2" y="4" width="28" height="20" rx="4" fill="#F6B7D2" stroke="#103657" stroke-width="2"/>
          <circle cx="16" cy="14" r="6" fill="#103657"/>
          <circle cx="16" cy="14" r="4" fill="#91D5F5"/>
          <circle cx="23" cy="7" r="1.5" fill="#FFE066"/>
        </g>
      `;
      leftArm = `<path d="M 58 116 Q 64 124 70 120" fill="none" stroke="#FFE4D1" stroke-width="8" stroke-linecap="round" />`;
      rightArm = `<path d="M 102 116 Q 96 124 90 120" fill="none" stroke="#FFE4D1" stroke-width="8" stroke-linecap="round" />`;
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 165" width="${width}" height="${height}" role="img" aria-label="Bubbles from The Powerpuff Girls">
        <defs>
          <linearGradient id="eyeGrad_${id}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#5AD1FF" />
            <stop offset="60%" stop-color="#2896D8" />
            <stop offset="100%" stop-color="#145A8C" />
          </linearGradient>
          <linearGradient id="hairGrad_${id}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFF275" />
            <stop offset="100%" stop-color="#FFD13B" />
          </linearGradient>
        </defs>

        <!-- Left Bouncy Pigtail & Bobble -->
        <g>
          <ellipse cx="26" cy="46" rx="20" ry="26" fill="url(#hairGrad_${id})" stroke="#103657" stroke-width="3.5" transform="rotate(-18 26 46)"/>
          <ellipse cx="22" cy="40" rx="5" ry="10" fill="#FFFFFF" opacity="0.4" transform="rotate(-18 22 40)"/>
          <circle cx="36" cy="53" r="8" fill="#91D5F5" stroke="#103657" stroke-width="3" />
        </g>

        <!-- Right Bouncy Pigtail & Bobble -->
        <g>
          <ellipse cx="134" cy="46" rx="20" ry="26" fill="url(#hairGrad_${id})" stroke="#103657" stroke-width="3.5" transform="rotate(18 134 46)"/>
          <ellipse cx="138" cy="40" rx="5" ry="10" fill="#FFFFFF" opacity="0.4" transform="rotate(18 138 40)"/>
          <circle cx="124" cy="53" r="8" fill="#91D5F5" stroke="#103657" stroke-width="3" />
        </g>

        <!-- Legs & Cute Shoes -->
        <g>
          <rect x="66" y="140" width="10" height="15" fill="#FFFFFF" stroke="#103657" stroke-width="2.5" rx="4"/>
          <ellipse cx="69" cy="154" rx="7" ry="4" fill="#103657"/>
          <rect x="84" y="140" width="10" height="15" fill="#FFFFFF" stroke="#103657" stroke-width="2.5" rx="4"/>
          <ellipse cx="87" cy="154" rx="7" ry="4" fill="#103657"/>
        </g>

        <!-- Signature Blue Dress -->
        <g>
          <path d="M 64 106 L 56 142 L 104 142 L 96 106 Z" fill="#91D5F5" stroke="#103657" stroke-width="3.5" stroke-linejoin="round"/>
          <path d="M 61 122 L 58 134 L 102 134 L 99 122 Z" fill="#103657" />
        </g>

        <!-- Arms -->
        ${leftArm}
        ${rightArm}

        <!-- Head Base -->
        <circle cx="80" cy="62" r="47" fill="url(#hairGrad_${id})" stroke="#103657" stroke-width="3.5" />

        <!-- Face (Warm soft skin) -->
        <circle cx="80" cy="66" r="41" fill="#FFE4D1" stroke="#103657" stroke-width="3.5" />

        <!-- Front Rounded Bangs with Hair Shines -->
        <path d="M 39 60 C 39 32 59 22 80 22 C 101 22 121 32 121 60 C 115 42 103 38 88 40 C 71 42 61 48 39 60 Z" fill="url(#hairGrad_${id})" stroke="#103657" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M 52 32 Q 62 26 74 27" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
        <path d="M 88 27 Q 98 28 106 34" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.6"/>

        <!-- Eyes -->
        ${leftEye}
        ${rightEye}

        <!-- Cheeks -->
        ${cheeks}

        <!-- Mouth -->
        ${mouth}

        <!-- Accessories & Mood Elements -->
        ${accessory}
      </svg>
    `;
  }

  return {
    getSVG: getSVG
  };
})();
