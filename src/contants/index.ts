export const loanServiceHeaders = {
  "Content-Type": "application/json",
  "Profile-Timezone": "1",
  "Client-Timezone": "1",
  "App-Version": "1",
  "OS-Version": "1",
  // "Device-Id": "1",
  "Device-Name": "",
  "Device-Type": "1",
  "App-Id": "fundme",
  Language: "mn",
  Location: "1",
};

export const navigationMenu = [
  {
    key: "1",
    label: "Нүүр",
    link: "/",
  },
  {
    key: "2",
    label: "Санхүүжилт өгөх",
    link: "/finance",
  },
  {
    key: "3",
    label: "Зээл авах",
    link: "/loan",
  },
];

export const regex = /^\/dashboard(?:\/\w+(?:\/\w+)?)?$/;

export const regexLogin = /\/login\b(?:\?.*)?$/;
export const regexForgot = /\/forgot\b(?:\?.*)?$/;
export const regexRegister = /\/signup\b(?:\?.*)?$/;

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?\-“!@#%&/,><’:;|_~`])\S{7,99}$/;
