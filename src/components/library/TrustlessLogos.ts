export enum WalletToken {
  Hue = 'Hue',
  LendHue = 'LendHue',
  Tcp = 'Tcp',
  TDao = 'TDao',
  Eth = 'Eth',
}

export enum TrustlessLogoColor {
  Black = 'Black',
  White = 'White',
}

const TrustlessLogos: {
  [color in TrustlessLogoColor]: { [key in WalletToken]: string }
} = {
  Black: {
    Hue: '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135.23 135.23"><defs><style>.cls-1{fill:#f6f6fd;}.cls-2{fill:#080917;}</style></defs><circle class="cls-1" cx="67.62" cy="67.62" r="57.95"/><path class="cls-2" d="M67.62,5.43A62.19,62.19,0,1,0,129.8,67.62,62.26,62.26,0,0,0,67.62,5.43Z"/><path class="cls-1" d="M121.37,67.62A53.75,53.75,0,0,0,67.62,13.86V121.37A53.74,53.74,0,0,0,121.37,67.62Z"/><path class="cls-2" d="M97.05,67.62A29.42,29.42,0,0,0,67.62,38.18V97.05A29.43,29.43,0,0,0,97.05,67.62Z"/><path class="cls-1" d="M38.18,67.62A29.44,29.44,0,0,0,67.62,97.05V38.18A29.44,29.44,0,0,0,38.18,67.62Z"/></svg>',
    LendHue: '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135.23 135.23"><defs><style>.cls-1{fill:#f6f6fd;}.cls-2{fill:#080917;}</style></defs><circle class="cls-1" cx="67.62" cy="67.62" r="57.95"/><path class="cls-2" d="M67.62,5.43A62.19,62.19,0,1,0,129.8,67.62,62.26,62.26,0,0,0,67.62,5.43Z"/><path class="cls-1" d="M121.37,67.62A53.75,53.75,0,0,0,67.62,13.86V121.37A53.74,53.74,0,0,0,121.37,67.62Z"/><path class="cls-2" d="M97.05,67.62A29.42,29.42,0,0,0,67.62,38.18V97.05A29.43,29.43,0,0,0,97.05,67.62Z"/><path class="cls-1" d="M38.18,67.62A29.44,29.44,0,0,0,67.62,97.05V38.18A29.44,29.44,0,0,0,38.18,67.62Z"/></svg>',
    Tcp: '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135.23 135.23"><defs><style>.cls-1{fill:#080917;}.cls-2{fill:#f6f6fd;}</style></defs><path class="cls-1" d="M67.62,5.43A62.19,62.19,0,1,0,129.8,67.62,62.26,62.26,0,0,0,67.62,5.43Z"/><path class="cls-2" d="M121.37,67.62A53.75,53.75,0,0,0,67.62,13.86V121.38A53.75,53.75,0,0,0,121.37,67.62Z"/></svg>',
    TDao: '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135.23 135.23"><defs><style>.cls-1{fill:#080917;}</style></defs><path class="cls-1" d="M67.62,5.64A62.41,62.41,0,1,0,130,68.05,62.41,62.41,0,0,0,67.62,5.64Zm0,91.85A29.44,29.44,0,1,1,97.06,68.05,29.44,29.44,0,0,1,67.62,97.49Z"/></svg>',
    Eth: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xodm="http://www.corel.com/coreldraw/odm/2003" xml:space="preserve" width="100%" height="100%" version="1.1" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 784.37 1277.39"> <g id="Layer_x0020_1"> <metadata id="CorelCorpID_0Corel-Layer"/> <g id="_1421394342400"> <g> <polygon fill="#343434" fill-rule="nonzero" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "/> <polygon fill="#8C8C8C" fill-rule="nonzero" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "/> <polygon fill="#3C3C3B" fill-rule="nonzero" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "/> <polygon fill="#8C8C8C" fill-rule="nonzero" points="392.07,1277.38 392.07,956.52 -0,724.89 "/> <polygon fill="#141414" fill-rule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33 "/> <polygon fill="#393939" fill-rule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33 "/> </g> </g> </g> <style xmlns="" class="darkreader darkreader--fallback">html, body, body :not(iframe) { background-color: #181a1b !important; border-color: #776e62 !important; color: #e8e6e3 !important; }</style></svg>'
  },
  White: {
    Hue: '<?xml version="1.0" encoding="utf-8"?> <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 135.2 135.2" style="enable-background:new 0 0 135.2 135.2;" xml:space="preserve"> <style type="text/css"> .st0{fill:#F6F6FD;} .st1{fill:#080917;} .st2{enable-background:new    ;} </style> <circle class="st0" cx="66.3" cy="67.6" r="58"/> <path class="st0" d="M66.3,5.4C32,5.4,4.2,33.3,4.2,67.6s27.8,62.2,62.2,62.2s62.2-27.8,62.2-62.2C128.5,33.3,100.7,5.5,66.3,5.4z" /> <path class="st1" d="M120.1,67.6c0-29.7-24.1-53.8-53.8-53.8h0v107.5C96,121.4,120.1,97.3,120.1,67.6 C120.1,67.6,120.1,67.6,120.1,67.6z"/> <path class="st0" d="M95.8,67.6c0-16.3-13.2-29.4-29.4-29.4c0,0,0,0,0,0v58.9C82.6,97.1,95.8,83.9,95.8,67.6z"/> <path class="st1" d="M36.9,67.6c0,16.3,13.2,29.4,29.4,29.4V38.2C50.1,38.2,36.9,51.4,36.9,67.6z"/> </svg>',
    LendHue: '<?xml version="1.0" encoding="utf-8"?> <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 135.2 135.2" style="enable-background:new 0 0 135.2 135.2;" xml:space="preserve"> <style type="text/css"> .st0{fill:#F6F6FD;} .st1{fill:#080917;} .st2{enable-background:new    ;} </style> <circle class="st0" cx="66.3" cy="67.6" r="58"/> <path class="st0" d="M66.3,5.4C32,5.4,4.2,33.3,4.2,67.6s27.8,62.2,62.2,62.2s62.2-27.8,62.2-62.2C128.5,33.3,100.7,5.5,66.3,5.4z" /> <path class="st1" d="M120.1,67.6c0-29.7-24.1-53.8-53.8-53.8h0v107.5C96,121.4,120.1,97.3,120.1,67.6 C120.1,67.6,120.1,67.6,120.1,67.6z"/> <path class="st0" d="M95.8,67.6c0-16.3-13.2-29.4-29.4-29.4c0,0,0,0,0,0v58.9C82.6,97.1,95.8,83.9,95.8,67.6z"/> <path class="st1" d="M36.9,67.6c0,16.3,13.2,29.4,29.4,29.4V38.2C50.1,38.2,36.9,51.4,36.9,67.6z"/> </svg>',
    Tcp: '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 26.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --> <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 135.2 135.2" style="enable-background:new 0 0 135.2 135.2;" xml:space="preserve"> <style type="text/css"> .st0{enable-background:new    ;} .st1{fill:#F6F6FD;} .st2{fill:#080917;} </style> <path class="st1" d="M66.1,5.4C31.8,5.4,3.9,33.3,3.9,67.6s27.8,62.2,62.2,62.2s62.2-27.8,62.2-62.2l0,0 C128.3,33.3,100.5,5.5,66.1,5.4z"/> <path class="st2" d="M119.9,67.6c0-29.7-24.1-53.8-53.8-53.8l0,0v107.5C95.8,121.4,119.9,97.3,119.9,67.6z"/> </svg>',
    TDao: '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 135.2 135.2" style="enable-background:new 0 0 135.2 135.2;" xml:space="preserve"> <style type="text/css"> .st0{fill:#F6F6FD;} .st1{enable-background:new    ;} </style> <path class="st0" d="M66.4,5.6C32,5.6,4,33.6,4,68.1s27.9,62.4,62.4,62.4s62.4-27.9,62.4-62.4S100.9,5.6,66.4,5.6L66.4,5.6z M66.4,97.5C50.2,97.5,37,84.3,37,68s13.2-29.4,29.4-29.4s29.4,13.2,29.4,29.4l0,0C95.9,84.3,82.7,97.5,66.4,97.5z"/> </svg>',
    Eth: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xodm="http://www.corel.com/coreldraw/odm/2003" xml:space="preserve" width="100%" height="100%" version="1.1" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 784.37 1277.39"> <g id="Layer_x0020_1"> <metadata id="CorelCorpID_0Corel-Layer"/> <g id="_1421394342400"> <g> <polygon fill="#ffffff" fill-rule="nonzero" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "/> <polygon fill="#ffffff" fill-rule="nonzero" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "/> <polygon fill="#ffffff" fill-rule="nonzero" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "/> <polygon fill="#ffffff" fill-rule="nonzero" points="392.07,1277.38 392.07,956.52 -0,724.89 "/> <polygon fill="#ffffff" fill-rule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33 "/> <polygon fill="#ffffff" fill-rule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33 "/> </g> </g> </g> <style xmlns="" class="darkreader darkreader--fallback"> body, body :not(iframe), html { background-color: #181a1b !important; border-color: #776e62 !important; color: #e8e6e3 !important; } </style> </svg>',
  }
}

export default TrustlessLogos