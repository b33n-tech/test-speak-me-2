// SERVICE WORKER
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

// LANG DATA
const DATA = [
  {
    type: "single",
    key: "hello",
    translations: {
      fr: "Bonjour",
      en: "Hello",
      ar: "مرحبا",
      fa: "سلام"
    },
    phonetic: {
      ar: "marhaban",
      fa: "salaam"
    }
  },
  {
    type: "single",
    key: "bye",
    translations: {
      fr: "Au revoir",
      en: "Goodbye",
      ar: "مع السلامة",
      fa: "خداحافظ"
    }
  },
  {
    type: "double",
    options: [
      {
        fr: "Oui",
        en: "Yes",
        ar: "نعم",
        fa: "بله"
      },
      {
        fr: "Non",
        en: "No",
        ar: "لا",
        fa: "نه"
      }
    ]
  },
  {
    type: "single",
    translations: {
      fr: "Où sont les toilettes ?",
      en: "Where are the toilets?",
      ar: "أين الحمام؟",
      fa: "دستشویی کجاست؟"
    }
  },
  {
    type: "single",
    translations: {
      fr: "Merci",
      en: "Thank you",
      ar: "شكرا",
      fa: "ممنون"
    }
  },
  {
    type: "single",
    translations: {
      fr: "Je ne comprends pas",
      en: "I don't understand",
      ar: "لا أفهم",
      fa: "نمی‌فهمم"
    }
  }
];

// STATE
let nativeLang = "fr";
let targetLang = "en";
let splitMode = false;

// INIT
const grid = document.getElementById("grid");
const banner = document.getElementById("banner");

function initLangs() {
  const langs = ["fr", "en", "ar", "fa"];
  const nativeSelect = document.getElementById("nativeLang");
  const targetSelect = document.getElementById("targetLang");

  langs.forEach(l => {
    nativeSelect.innerHTML += `<option value="${l}">${l}</option>`;
    targetSelect.innerHTML += `<option value="${l}">${l}</option>`;
  });

  nativeSelect.value = nativeLang;
  targetSelect.value = targetLang;

  nativeSelect.onchange = e => nativeLang = e.target.value;
  targetSelect.onchange = e => targetLang = e.target.value;
}

// RENDER
function render() {
  grid.innerHTML = "";

  DATA.forEach(item => {
    if (item.type === "single") {
      const btn = document.createElement("button");
      btn.innerText = item.translations[nativeLang];

      btn.onclick = () => speak(item);
      grid.appendChild(btn);
    }

    if (item.type === "double") {
      const div = document.createElement("div");
      div.className = "double";

      item.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.innerText = opt[nativeLang];
        btn.onclick = () => speak({ translations: opt });
        div.appendChild(btn);
      });

      grid.appendChild(div);
    }
  });
}

// SPEAK
function speak(item) {
  const phonetic = document.getElementById("phonetic").checked;

  let targetText = item.translations[targetLang];

  if (phonetic && item.phonetic && item.phonetic[targetLang]) {
    targetText += " (" + item.phonetic[targetLang] + ")";
  }

  if (!splitMode) {
    banner.innerText = targetText;
  } else {
    document.getElementById("topText").innerText = targetText;
    document.getElementById("bottomText").innerText = item.translations[nativeLang];
  }

  const utter = new SpeechSynthesisUtterance(item.translations[targetLang]);
  utter.lang = targetLang;
  speechSynthesis.speak(utter);
}

// SPLIT
function toggleSplit() {
  splitMode = !splitMode;

  document.getElementById("grid").style.display = splitMode ? "none" : "grid";
  document.getElementById("split").style.display = splitMode ? "flex" : "none";
}

// SETTINGS
function toggleSettings() {
  const s = document.getElementById("settings");
  s.style.display = s.style.display === "block" ? "none" : "block";
}

// FONT SIZE
document.getElementById("fontSize").oninput = e => {
  document.body.style.fontSize = e.target.value + "px";
};

// INIT
initLangs();
render();
