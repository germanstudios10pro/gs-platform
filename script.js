/* =========================================================
GS PLATFORM — PREMIUM APP INTERFACE
========================================================= */

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  }

:root {
--bg: #07101f;
--bg-soft: #0b1729;
--card: rgba(17, 31, 52, 0.78);
--card-solid: #101e32;
--text: #ffffff;
--muted: #9eabc0;
--blue: #168cff;
--blue-light: #31b8ff;
--gold: #f7c928;
--gold-light: #ffe477;
--border: rgba(255, 255, 255, 0.10);
--shadow: 0 30px 80px rgba(0, 0, 0, 0.38);
}

html {
width: 100%;
min-height: 100%;
background: var(--bg);
scroll-behavior: smooth;
}

body {
width: 100%;
min-height: 100vh;
background:
radial-gradient(
circle at 20% 10%,
rgba(22, 140, 255, 0.13),
transparent 32%
),
radial-gradient(
circle at 85% 20%,
rgba(247, 201, 40, 0.10),
transparent 28%
),
linear-gradient(
135deg,
#050b15 0%,
#07101f 50%,
#091426 100%
);
color: var(--text);
font-family:
Inter,
-apple-system,
BlinkMacSystemFont,
"Segoe UI",
Roboto,
Arial,
sans-serif;
overflow-x: hidden;
}

body.auth-open,
body.gs-role-active {
overflow: hidden;
}

button,
input {
font: inherit;
}

button {
border: none;
}

a {
color: inherit;
text-decoration: none;
}

/* =========================================================
APP SHELL
========================================================= */

.app-shell {
position: relative;
min-height: 100vh;
overflow: hidden;
}

/* =========================================================
AMBIENT BACKGROUND
========================================================= */

.ambient {
position: absolute;
border-radius: 50%;
pointer-events: none;
filter: blur(2px);
}

.ambient-one {
width: 420px;
height: 420px;
top: 18%;
left: -230px;
background: rgba(22, 140, 255, 0.08);
}

.ambient-two {
width: 350px;
height: 350px;
top: 45%;
right: -180px;
background: rgba(247, 201, 40, 0.06);
}

.ambient-three {
width: 260px;
height: 260px;
bottom: -100px;
left: 45%;
background: rgba(49, 184, 255, 0.05);
}

/* =========================================================
TOP BAR
========================================================= */

.top-bar {
position: relative;
z-index: 20;

width: min(1180px, calc(100% - 40px));
margin: 0 auto;

min-height: 86px;

display: flex;
align-items: center;
justify-content: space-between;
}

.brand {
display: flex;
align-items: center;
gap: 11px;
}

.logo-frame {
width: 48px;
height: 48px;

display: flex;
align-items: center;
justify-content: center;

border-radius: 15px;

background: rgba(255, 255, 255, 0.96);

box-shadow:
0 8px 30px rgba(0, 0, 0, 0.25),
0 0 30px rgba(22, 140, 255, 0.08);

overflow: hidden;
}

.gs-logo {
width: 90%;
height: 90%;
object-fit: contain;
}

.brand-name {
display: flex;
flex-direction: column;
line-height: 1;
gap: 4px;
}

.brand-name span:first-child {
font-size: 13px;
font-weight: 800;
letter-spacing: 0.22em;
color: var(--gold);
}

.brand-name span:last-child {
font-size: 10px;
font-weight: 700;
letter-spacing: 0.18em;
color: #d9e2f0;
}

.top-login {
padding: 11px 20px;

color: #ffffff;
background: rgba(255, 255, 255, 0.055);

border: 1px solid var(--border);
border-radius: 999px;

cursor: pointer;

transition:
background 0.25s ease,
transform 0.25s ease,
border-color 0.25s ease;
}

.top-login:hover {
background: rgba(255, 255, 255, 0.10);
border-color: rgba(255, 255, 255, 0.18);
transform: translateY(-1px);
}

/* =========================================================
HERO
========================================================= */

.hero {
position: relative;
z-index: 2;

width: min(1180px, calc(100% - 40px));

min-height: calc(100vh - 86px);

margin: 0 auto;

display: grid;
grid-template-columns: 1.05fr 0.95fr;
align-items: center;

gap: 70px;

padding: 50px 0 70px;

transition:
opacity 0.3s ease,
transform 0.3s ease;
}

/* =========================================================
HERO CONTENT
========================================================= */

.hero-content {
max-width: 650px;
}

.eyebrow {
display: inline-flex;
align-items: center;
gap: 9px;

padding: 8px 13px;

margin-bottom: 24px;

color: #b8c7dc;

background: rgba(255, 255, 255, 0.045);

border: 1px solid var(--border);

border-radius: 999px;

font-size: 12px;
font-weight: 600;
letter-spacing: 0.04em;
}

.status-dot {
width: 7px;
height: 7px;

border-radius: 50%;

background: var(--blue-light);

box-shadow:
0 0 12px rgba(49, 184, 255, 0.9);

animation: pulse 2s infinite;
}

@keyframes pulse {

0%,
100% {
opacity: 0.5;
transform: scale(0.85);
}

50% {
opacity: 1;
transform: scale(1);
}
}

.hero h1 {
font-size: clamp(48px, 6vw, 82px);
line-height: 0.98;
letter-spacing: -0.055em;
font-weight: 800;
}

.hero h1 span {
display: inline-block;

background:
linear-gradient(
100deg,
var(--gold) 0%,
#ffffff 48%,
var(--blue-light) 100%
);

-webkit-background-clip: text;
background-clip: text;
color: transparent;

transition:
opacity 0.35s ease,
transform 0.35s ease;
}

.hero h1 span.changing {
opacity: 0;
transform: translateY(8px);
}

.hero-description {
max-width: 570px;

margin-top: 28px;

color: var(--muted);

font-size: 17px;
line-height: 1.75;
}

.rotating-message {
margin-top: 20px;

min-height: 25px;

color: #dbe5f3;

font-size: 14px;
font-weight: 500;

transition:
opacity 0.35s ease,
transform 0.35s ease;
}

.rotating-message.changing {
opacity: 0;
transform: translateY(8px);
}

/* =========================================================
ACTIONS
========================================================= */

.hero-actions {
display: flex;
align-items: center;
gap: 14px;

margin-top: 32px;
}

.primary-button,
.secondary-button {
min-height: 54px;

padding: 0 23px;

border-radius: 15px;

cursor: pointer;

transition:
transform 0.25s ease,
box-shadow 0.25s ease,
background 0.25s ease;
}

.primary-button {
display: flex;
align-items: center;
justify-content: center;
gap: 18px;

color: #07101f;

background:
linear-gradient(
135deg,
var(--gold),
var(--gold-light)
);

font-weight: 800;

box-shadow:
0 14px 35px rgba(247, 201, 40, 0.18);
}

.primary-button:hover {
transform: translateY(-3px);

box-shadow:
0 18px 42px rgba(247, 201, 40, 0.27);
}

.button-arrow {
font-size: 20px;
}

.secondary-button {
color: #ffffff;

background: rgba(255, 255, 255, 0.055);

border: 1px solid var(--border);
}

.secondary-button:hover {
background: rgba(255, 255, 255, 0.10);
transform: translateY(-2px);
}

/* =========================================================
TRUST LINE
========================================================= */

.trust-line {
display: flex;
flex-wrap: wrap;
align-items: center;
gap: 9px;

margin-top: 25px;

color: #73839b;

font-size: 11px;
letter-spacing: 0.03em;
}

.trust-divider {
color: #40516b;
}

/* =========================================================
PLATFORM PREVIEW
========================================================= */

.platform-preview {
position: relative;

min-height: 470px;

display: flex;
align-items: center;
justify-content: center;
}

.preview-glow {
position: absolute;

width: 330px;
height: 330px;

border-radius: 50%;

background:
radial-gradient(
circle,
rgba(22, 140, 255, 0.22),
rgba(247, 201, 40, 0.06) 42%,
transparent 70%
);

filter: blur(15px);

animation: floatingGlow 7s ease-in-out infinite;
}

@keyframes floatingGlow {

0%,
100% {
transform: translateY(0) scale(1);
}

50% {
transform: translateY(-15px) scale(1.05);
}
}

.preview-card {
position: relative;

width: min(460px, 100%);

padding: 30px;

border-radius: 27px;

background:
linear-gradient(
145deg,
rgba(20, 39, 66, 0.94),
rgba(9, 20, 36, 0.94)
);

border: 1px solid rgba(255, 255, 255, 0.11);

box-shadow: var(--shadow);

backdrop-filter: blur(20px);

transform: rotate(2deg);

transition:
transform 0.4s ease;
}

.preview-card:hover {
transform: rotate(0deg) translateY(-5px);
}

.preview-top {
display: flex;
align-items: flex-start;
justify-content: space-between;

gap: 20px;
}

.preview-label {
color: var(--gold);

font-size: 10px;
font-weight: 800;

letter-spacing: 0.18em;
}

.preview-card h2 {
max-width: 320px;

margin-top: 12px;

font-size: 31px;
line-height: 1.08;
letter-spacing: -0.035em;
}

.preview-card h2 span {
color: var(--blue-light);
}

.preview-icon {
width: 52px;
height: 52px;

display: flex;
align-items: center;
justify-content: center;

flex-shrink: 0;

border-radius: 16px;

color: #07101f;

background:
linear-gradient(
135deg,
var(--gold),
var(--blue-light)
);

font-weight: 900;
letter-spacing: -0.08em;
}

.preview-stats {
display: grid;
grid-template-columns: repeat(3, 1fr);

gap: 10px;

margin-top: 45px;
}

.preview-stat {
min-height: 115px;

padding: 15px;

border-radius: 16px;

background: rgba(255, 255, 255, 0.045);

border: 1px solid rgba(255, 255, 255, 0.065);
}

.preview-stat strong {
display: block;

margin-bottom: 9px;

font-size: 12px;
}

.preview-stat span {
color: #8292aa;

font-size: 10px;
line-height: 1.5;
}

.preview-bottom {
display: flex;
align-items: center;
justify-content: space-between;

margin-top: 30px;
padding-top: 19px;

border-top: 1px solid rgba(255, 255, 255, 0.08);

color: #8595aa;

font-size: 11px;
}

.preview-arrow {
color: var(--gold);

font-size: 20px;
}

/* =========================================================
ROLE SELECTION SCREEN
========================================================= */

.role-selection-screen {
position: fixed;

inset: 0;

z-index: 90;

display: flex;
align-items: center;
justify-content: center;

width: 100%;
min-height: 100vh;

padding: 35px 20px;

overflow-y: auto;

background:
radial-gradient(
circle at 15% 15%,
rgba(22, 140, 255, 0.12),
transparent 32%
),
radial-gradient(
circle at 85% 80%,
rgba(247, 201, 40, 0.08),
transparent 30%
),
linear-gradient(
135deg,
#050b15 0%,
#07101f 50%,
#091426 100%
);

opacity: 0;
visibility: hidden;
pointer-events: none;

transform: translateY(18px);

transition:
opacity 0.35s ease,
visibility 0.35s ease,
transform 0.35s ease;
}

.role-selection-screen.active {
opacity: 1;
visibility: visible;
pointer-events: auto;

transform: translateY(0);
}

/* =========================================================
ROLE CONTAINER
========================================================= */

.role-selection-container {
position: relative;

width: min(650px, 100%);

margin: auto;

padding: 30px 0;

text-align: center;
}

/* =========================================================
ROLE BRAND
========================================================= */

.role-brand {
display: inline-flex;

align-items: center;

gap: 11px;

margin-bottom: 27px;

color: #d9e2f0;

font-size: 11px;
font-weight: 800;

letter-spacing: 0.19em;
}

.role-brand-mark {
width: 43px;
height: 43px;

display: flex;
align-items: center;
justify-content: center;

border-radius: 13px;

color: #07101f;

background:
linear-gradient(
135deg,
var(--gold),
var(--blue-light)
);

font-size: 15px;
font-weight: 900;

letter-spacing: -0.08em;

box-shadow:
0 10px 30px rgba(22, 140, 255, 0.12);
}

/* =========================================================
ROLE STEP
========================================================= */

.role-step {
display: inline-flex;

align-items: center;
justify-content: center;

min-height: 28px;

padding: 0 12px;

margin-bottom: 17px;

color: var(--gold);

background: rgba(247, 201, 40, 0.07);

border: 1px solid rgba(247, 201, 40, 0.16);

border-radius: 999px;

font-size: 9px;
font-weight: 800;

letter-spacing: 0.16em;
}

/* =========================================================
ROLE HEADING
========================================================= */

.role-selection-container > h1 {
color: #ffffff;

font-size: clamp(32px, 6vw, 52px);

line-height: 1.05;

letter-spacing: -0.045em;

font-weight: 800;
}

.role-subtitle {
max-width: 500px;

margin: 14px auto 0;

color: var(--muted);

font-size: 15px;

line-height: 1.65;
}

/* =========================================================
ROLE OPTIONS
========================================================= */

.role-options {
display: grid;

grid-template-columns: 1fr 1fr;

gap: 15px;

margin-top: 34px;

text-align: left;
}

/* =========================================================
ROLE CARD
========================================================= */

.role-card {
position: relative;

width: 100%;

min-height: 235px;

display: flex;

flex-direction: column;

align-items: flex-start;

padding: 25px;

border-radius: 22px;

color: #ffffff;

background:
linear-gradient(
145deg,
rgba(18, 36, 61, 0.95),
rgba(8, 18, 32, 0.95)
);

border: 1px solid rgba(255, 255, 255, 0.10);

box-shadow:
0 20px 55px rgba(0, 0, 0, 0.25);

cursor: pointer;

overflow: hidden;

text-align: left;

transition:
transform 0.25s ease,
border-color 0.25s ease,
box-shadow 0.25s ease,
background 0.25s ease;
}

.role-card::before {
content: "";

position: absolute;

width: 150px;
height: 150px;

top: -75px;
right: -75px;

border-radius: 50%;

background:
radial-gradient(
circle,
rgba(247, 201, 40, 0.15),
transparent 70%
);

pointer-events: none;
}

.role-card:hover {
transform: translateY(-5px);

border-color:
rgba(247, 201, 40, 0.38);

box-shadow:
0 27px 65px rgba(0, 0, 0, 0.34),
0 0 35px rgba(247, 201, 40, 0.06);

background:
linear-gradient(
145deg,
rgba(22, 43, 72, 0.98),
rgba(9, 21, 37, 0.98)
);
}

.role-card:active {
transform: translateY(-1px) scale(0.99);
}

/* =========================================================
ROLE ICON
========================================================= */

.role-icon {
width: 48px;
height: 48px;

display: flex;
align-items: center;
justify-content: center;

margin-bottom: 22px;

border-radius: 15px;

color: #07101f;

background:
linear-gradient(
135deg,
var(--gold),
var(--gold-light)
);

font-size: 19px;
font-weight: 900;

box-shadow:
0 10px 25px rgba(247, 201, 40, 0.12);
}

/* =========================================================
ROLE CARD CONTENT
========================================================= */

.role-card-content {
padding-right: 25px;
}

.role-card-label {
display: block;

margin-bottom: 7px;

color: var(--blue-light);

font-size: 8px;
font-weight: 800;

letter-spacing: 0.15em;
}

.role-card h2 {
color: #ffffff;

font-size: 22px;

line-height: 1.15;

letter-spacing: -0.025em;
}

.role-card p {
margin-top: 10px;

color: #8f9eb3;

font-size: 12px;

line-height: 1.65;
}

/* =========================================================
ROLE ARROW
========================================================= */

.role-arrow {
position: absolute;

right: 22px;
bottom: 20px;

color: var(--gold);

font-size: 21px;

transition:
transform 0.25s ease;
}

.role-card:hover .role-arrow {
transform: translateX(5px);
}

/* =========================================================
ROLE STATUS
========================================================= */

.role-status {
min-height: 20px;

margin-top: 18px;

color: var(--gold);

font-size: 12px;

line-height: 1.5;

text-align: center;
}

/* =========================================================
ROLE BACK
========================================================= */

.role-back-button {
display: inline-flex;

align-items: center;
justify-content: center;

margin-top: 18px;

padding: 9px 14px;

color: #77879d;

background: transparent;

border-radius: 10px;

cursor: pointer;

font-size: 11px;

transition:
color 0.2s ease,
background 0.2s ease;
}

.role-back-button:hover {
color: #ffffff;

background:
rgba(255, 255, 255, 0.05);
}

/* =========================================================
ROLE LOADING
========================================================= */

.role-loading {
position: absolute;

inset: 0;

z-index: 10;

display: flex;

flex-direction: column;

align-items: center;
justify-content: center;

gap: 14px;

background:
rgba(3, 9, 17, 0.82);

backdrop-filter: blur(10px);

opacity: 0;
visibility: hidden;
pointer-events: none;

transition:
opacity 0.25s ease,
visibility 0.25s ease;
}

.role-loading.active {
opacity: 1;
visibility: visible;
pointer-events: auto;
}

.role-loading p {
color: #b6c3d5;

font-size: 12px;

text-align: center;
}

.role-loader {
width: 36px;
height: 36px;

border-radius: 50%;

border:
3px solid
rgba(255, 255, 255, 0.12);

border-top-color: var(--gold);

animation:
roleSpin 0.8s linear infinite;
}

@keyframes roleSpin {
to {
transform: rotate(360deg);
}
}

/* =========================================================
DYNAMIC AUTH WINDOW
========================================================= */

#gsAuthOverlay {
position: fixed;

inset: 0;

z-index: 999999;

display: flex;

align-items: center;
justify-content: center;

padding: 20px;

background:
rgba(3, 10, 20, 0.82);

backdrop-filter: blur(18px);
-webkit-backdrop-filter: blur(18px);

opacity: 0;
visibility: hidden;
pointer-events: none;

transition:
opacity 0.25s ease,
visibility 0.25s ease;

box-sizing: border-box;
}

#gsAuthOverlay.gs-open {
opacity: 1;
visibility: visible;
pointer-events: auto;
}

#gsAuthCard {
width: min(440px, 100%);

max-height: 92vh;

overflow-y: auto;

position: relative;

box-sizing: border-box;

padding: 30px 24px 26px;

border-radius: 28px;

background:
linear-gradient(
145deg,
#10223c,
#081322
);

border: 1px solid rgba(
255,
255,
255,
0.12
);

box-shadow:
0 30px 90px rgba(
0,
0,
0,
0.55
);

color: #fff;

transform:
translateY(20px)
scale(0.97);

transition:
transform 0.28s ease;
}

#gsAuthOverlay.gs-open #gsAuthCard {
transform:
translateY(0)
scale(1);
}

#gsAuthClose {
position: absolute;

right: 17px;
top: 14px;

width: 40px;
height: 40px;

border: 0;

border-radius: 50%;

background:
rgba(255, 255, 255, 0.08);

color: #fff;

font-size: 28px;

line-height: 1;

cursor: pointer;
}

.gs-auth-logo {
width: 62px;
height: 62px;

display: flex;
align-items: center;
justify-content: center;

margin: 0 auto 14px;

border-radius: 18px;

background:
linear-gradient(
135deg,
#ffd43b,
#38bdf8
);

color: #071426;

font-size: 25px;
font-weight: 900;
}

.gs-auth-brand {
text-align: center;

color: #ffd43b;

font-size: 12px;
font-weight: 800;

letter-spacing: 3px;

margin-bottom: 9px;
}

#gsAuthTitle {
margin: 0;

text-align: center;

font-size: 28px;

line-height: 1.2;
}

#gsAuthSubtitle {
margin: 10px 0 24px;

text-align: center;

color: rgba(255, 255, 255, 0.65);

font-size: 14px;

line-height: 1.5;
}

.gs-google-button {
width: 100%;

min-height: 54px;

border: 1px solid rgba(
255,
255,
255,
0.14
);

border-radius: 15px;

background: #fff;

color: #111827;

font-size: 15px;
font-weight: 700;

cursor: pointer;

display: flex;
align-items: center;
justify-content: center;

gap: 12px;
}

.gs-google-button:disabled {
opacity: 0.65;
cursor: wait;
}

.gs-google-icon {
font-weight: 900;
font-size: 19px;
}

.gs-divider {
display: flex;

align-items: center;

gap: 12px;

margin: 21px 0;

color: rgba(255, 255, 255, 0.42);

font-size: 11px;
}

.gs-divider span {
height: 1px;

flex: 1;

background:
rgba(255, 255, 255, 0.12);
}

#gsEmailForm label {
display: block;

margin: 0 0 7px;

color:
rgba(255, 255, 255, 0.8);

font-size: 13px;
font-weight: 700;
}

#gsEmailForm input {
width: 100%;

height: 52px;

box-sizing: border-box;

margin-bottom: 17px;

padding: 0 15px;

border:
1px solid
rgba(255, 255, 255, 0.12);

border-radius: 14px;

outline: none;

background:
rgba(255, 255, 255, 0.06);

color: #fff;

font-size: 15px;
}

#gsEmailForm input::placeholder {
color:
rgba(255, 255, 255, 0.38);
}

#gsEmailForm input:focus {
border-color: #ffd43b;

box-shadow:
0 0 0 3px
rgba(255, 212, 59, 0.10);
}

.gs-password-wrap {
position: relative;
}

.gs-password-wrap input {
padding-right: 65px !important;
}

#gsPasswordToggle {
position: absolute;

right: 9px;
top: 6px;

height: 40px;

padding: 0 9px;

border: 0;

border-radius: 10px;

background: transparent;

color: #ffd43b;

font-size: 12px;
font-weight: 700;

cursor: pointer;
}

.gs-submit {
width: 100%;

min-height: 54px;

margin-top: 3px;

border: 0;

border-radius: 15px;

background:
linear-gradient(
135deg,
#ffd43b,
#ffe77c
);

color: #071426;

font-size: 15px;
font-weight: 900;

cursor: pointer;
}

.gs-submit:disabled {
opacity: 0.65;
cursor: wait;
}

.gs-forgot {
display: block;

margin: 17px auto 0;

border: 0;

background: transparent;

color: #6fd3ff;

font-size: 13px;

cursor: pointer;
}

.gs-auth-message {
min-height: 20px;

margin: 15px 0 0;

text-align: center;

color: #ffd43b;

font-size: 13px;

line-height: 1.4;
}

.gs-switch {
display: flex;

justify-content: center;
align-items: center;

flex-wrap: wrap;

gap: 5px;

margin-top: 21px;

padding-top: 19px;

border-top:
1px solid
rgba(255, 255, 255, 0.09);

color:
rgba(255, 255, 255, 0.55);

font-size: 13px;
}

#gsSwitchButton {
border: 0;

background: transparent;

color: #ffd43b;

font-weight: 800;

cursor: pointer;

font-size: 13px;
}

/* =========================================================
RESPONSIVE — TABLET
========================================================= */

@media (max-width: 900px) {

.hero {
grid-template-columns: 1fr;

gap: 45px;

padding-top: 35px;

}

.hero-content {
max-width: 700px;

margin: 0 auto;

text-align: center;

}

.eyebrow {
margin-bottom: 20px;
}

.hero-description {
margin-left: auto;
margin-right: auto;
}

.hero-actions {
justify-content: center;
}

.trust-line {
justify-content: center;
}

.platform-preview {
min-height: 390px;
}

.preview-card {
transform: rotate(0);
}

.role-selection-container {
max-width: 620px;
}
}

/* =========================================================
RESPONSIVE — PHONE
========================================================= */

@media (max-width: 600px) {

.top-bar {
width: calc(100% - 28px);

min-height: 72px;

}

.logo-frame {
width: 43px;
height: 43px;

border-radius: 13px;

}

.brand-name span:first-child {
font-size: 11px;
}

.brand-name span:last-child {
font-size: 8px;
}

.top-login {
padding: 9px 15px;

font-size: 12px;

}

.hero {
width: calc(100% - 28px);

min-height: auto;

padding: 45px 0 35px;

gap: 35px;

}

.hero h1 {
font-size: clamp(43px, 13vw, 62px);

letter-spacing: -0.06em;

}

.hero-description {
margin-top: 22px;

font-size: 14px;

line-height: 1.7;

}

.rotating-message {
font-size: 12px;
}

.hero-actions {
flex-direction: column;

width: 100%;

margin-top: 27px;

}

.primary-button,
.secondary-button {
width: 100%;
}

.trust-line {
font-size: 9px;
}

.platform-preview {
min-height: 330px;
}

.preview-card {
width: 100%;

padding: 22px;

border-radius: 22px;

}

.preview-card h2 {
font-size: 25px;
}

.preview-icon {
width: 45px;
height: 45px;

border-radius: 13px;

}

.preview-stats {
gap: 7px;

margin-top: 30px;

}

.preview-stat {
min-height: 100px;

padding: 11px;

}

.preview-stat strong {
font-size: 10px;
}

.preview-stat span {
font-size: 8px;
}

.preview-bottom {
font-size: 9px;
}

.site-footer {
width: calc(100% - 28px);

flex-direction: column;

gap: 12px;

text-align: center;

}

/* Role screen */

.role-selection-screen {
align-items: flex-start;

padding:
  28px 16px 35px;

}

.role-selection-container {
padding:
15px 0 25px;
}

.role-brand {
margin-bottom: 23px;
}

.role-selection-container > h1 {
font-size: 34px;

line-height: 1.08;

}

.role-subtitle {
margin-top: 12px;

font-size: 13px;

}

.role-options {
grid-template-columns: 1fr;

gap: 12px;

margin-top: 27px;

}

.role-card {
min-height: 190px;

padding: 21px;

border-radius: 19px;

}

.role-icon {
width: 43px;
height: 43px;

margin-bottom: 17px;

border-radius: 13px;

}

.role-card h2 {
font-size: 20px;
}

.role-card p {
font-size: 11px;
}

.role-card-label {
font-size: 7px;
}

/* Dynamic auth */

#gsAuthOverlay {
padding: 12px;
}

#gsAuthCard {
padding:
27px 19px 23px;

border-radius: 24px;

}

#gsAuthTitle {
font-size: 25px;
}
}

/* =========================================================
RESPONSIVE — SMALL PHONES
========================================================= */

@media (max-width: 380px) {

.hero h1 {
font-size: 42px;
}

.preview-stats {
grid-template-columns: 1fr;
}

.preview-stat {
min-height: auto;
}

.role-selection-screen {
padding-left: 13px;
padding-right: 13px;
}

.role-selection-container > h1 {
font-size: 30px;
}

.role-card {
min-height: 180px;
}
}

/* =========================================================
ACCESSIBILITY
========================================================= */

button:focus-visible,
a:focus-visible,
input:focus-visible {
outline:
2px solid
var(--blue-light);

outline-offset: 3px;
}

/* =========================================================
REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {

*,
*::before,
*::after {
scroll-behavior: auto !important;

animation-duration:
  0.01ms !important;

animation-iteration-count:
  1 !important;

transition-duration:
  0.01ms !important;

}
}
