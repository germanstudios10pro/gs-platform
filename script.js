"use strict";

/* =========================================================
   GS PLATFORM — MAIN SCRIPT
   Version: Authentication Interface
   ========================================================= */


/* =========================================================
   1. GS PLATFORM AUTH INTERFACE
   The login window is created by JavaScript itself.
   This means it does not depend on special HTML IDs.
   ========================================================= */

(function () {

    let authMode = "login";


    /* -----------------------------------------------------
       FIND THE LANDING-PAGE BUTTONS
       We find them by their visible text instead of relying
       on IDs that may be different in the HTML.
       ----------------------------------------------------- */

    function findButtonByText(text) {

        const elements = document.querySelectorAll(
            "button, a, [role='button']"
        );

        const wanted = text
            .trim()
            .toLowerCase();

        for (const element of elements) {

            const elementText =
                element.textContent
                    .trim()
                    .toLowerCase();

            if (elementText === wanted) {
                return element;
            }
        }

        return null;
    }


    /* -----------------------------------------------------
       CREATE AUTH WINDOW
       ----------------------------------------------------- */

    function createAuthWindow() {

        /* Don't create it twice */
        if (document.getElementById("gsAuthOverlay")) {
            return;
        }


        const overlay =
            document.createElement("div");

        overlay.id =
            "gsAuthOverlay";


        overlay.innerHTML = `

            <div id="gsAuthCard">

                <button
                    id="gsAuthClose"
                    type="button"
                    aria-label="Close"
                >
                    ×
                </button>


                <div class="gs-auth-logo">
                    GS
                </div>


                <div class="gs-auth-brand">
                    GS PLATFORM
                </div>


                <h2 id="gsAuthTitle">
                    Welcome to GS
                </h2>


                <p id="gsAuthSubtitle">
                    Sign in to continue to GS Platform.
                </p>


                <button
                    id="gsGoogleButton"
                    class="gs-google-button"
                    type="button"
                >
                    <span class="gs-google-icon">
                        G
                    </span>

                    Continue with Google
                </button>


                <div class="gs-divider">
                    <span></span>
                    <b>OR</b>
                    <span></span>
                </div>


                <form id="gsEmailForm">

                    <label for="gsEmail">
                        Email address
                    </label>

                    <input
                        id="gsEmail"
                        type="email"
                        placeholder="Enter your email"
                        autocomplete="email"
                        required
                    >


                    <label for="gsPassword">
                        Password
                    </label>

                    <div class="gs-password-wrap">

                        <input
                            id="gsPassword"
                            type="password"
                            placeholder="Enter your password"
                            autocomplete="current-password"
                            required
                        >

                        <button
                            id="gsPasswordToggle"
                            type="button"
                        >
                            Show
                        </button>

                    </div>


                    <button
                        id="gsEmailSubmit"
                        class="gs-submit"
                        type="submit"
                    >
                        Continue
                    </button>

                </form>


                <button
                    id="gsForgotPassword"
                    class="gs-forgot"
                    type="button"
                >
                    Forgot password?
                </button>


                <p
                    id="gsAuthMessage"
                    class="gs-auth-message"
                ></p>


                <div class="gs-switch">

                    <span id="gsSwitchText">
                        Don't have an account?
                    </span>

                    <button
                        id="gsSwitchButton"
                        type="button"
                    >
                        Create account
                    </button>

                </div>

            </div>
        `;


        document.body.appendChild(
            overlay
        );


        addAuthStyles();

        connectAuthControls();
    }


    /* =====================================================
       2. AUTH WINDOW STYLES
       These styles are included here deliberately so the
       authentication window works even if the existing CSS
       doesn't contain its classes.
       ===================================================== */

    function addAuthStyles() {

        if (
            document.getElementById(
                "gsAuthDynamicStyles"
            )
        ) {
            return;
        }


        const style =
            document.createElement("style");


        style.id =
            "gsAuthDynamicStyles";


        style.textContent = `

            #gsAuthOverlay {
                position: fixed;
                inset: 0;
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                background: rgba(3, 10, 20, 0.82);
                backdrop-filter: blur(18px);
                -webkit-backdrop-filter: blur(18px);
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
                transition:
                    opacity .25s ease,
                    visibility .25s ease;
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
                    .12
                );
                box-shadow:
                    0 30px 90px rgba(
                        0,
                        0,
                        0,
                        .55
                    );
                color: #ffffff;
                font-family:
                    Arial,
                    Helvetica,
                    sans-serif;
                transform: translateY(20px)
                           scale(.97);
                transition:
                    transform .28s ease;
            }


            #gsAuthOverlay.gs-open
            #gsAuthCard {
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
                background: rgba(
                    255,
                    255,
                    255,
                    .08
                );
                color: white;
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
                box-shadow:
                    0 12px 35px rgba(
                        255,
                        205,
                        50,
                        .22
                    );
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
                color: rgba(
                    255,
                    255,
                    255,
                    .65
                );
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
                    .14
                );
                border-radius: 15px;
                background: #ffffff;
                color: #111827;
                font-size: 15px;
                font-weight: 700;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
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
                color: rgba(
                    255,
                    255,
                    255,
                    .42
                );
                font-size: 11px;
            }


            .gs-divider span {
                height: 1px;
                flex: 1;
                background: rgba(
                    255,
                    255,
                    255,
                    .12
                );
            }


            .gs-divider b {
                font-weight: 700;
            }


            #gsEmailForm label {
                display: block;
                margin: 0 0 7px;
                color: rgba(
                    255,
                    255,
                    255,
                    .8
                );
                font-size: 13px;
                font-weight: 700;
            }


            #gsEmailForm input {
                width: 100%;
                height: 52px;
                box-sizing: border-box;
                margin-bottom: 17px;
                padding: 0 15px;
                border: 1px solid rgba(
                    255,
                    255,
                    255,
                    .12
                );
                border-radius: 14px;
                outline: none;
                background: rgba(
                    255,
                    255,
                    255,
                    .06
                );
                color: #ffffff;
                font-size: 15px;
            }


            #gsEmailForm input::placeholder {
                color: rgba(
                    255,
                    255,
                    255,
                    .38
                );
            }


            #gsEmailForm input:focus {
                border-color: #ffd43b;
                box-shadow:
                    0 0 0 3px rgba(
                        255,
                        212,
                        59,
                        .10
                    );
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
                border-top: 1px solid rgba(
                    255,
                    255,
                    255,
                    .09
                );
                color: rgba(
                    255,
                    255,
                    255,
                    .55
                );
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


            @media (max-width: 480px) {

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

        `;


        document.head.appendChild(
            style
        );
    }


    /* =====================================================
       3. AUTH CONTROLS
       ===================================================== */

    function connectAuthControls() {

        const overlay =
            document.getElementById(
                "gsAuthOverlay"
            );


        const closeButton =
            document.getElementById(
                "gsAuthClose"
            );


        const googleButton =
            document.getElementById(
                "gsGoogleButton"
            );


        const form =
            document.getElementById(
                "gsEmailForm"
            );


        const passwordToggle =
            document.getElementById(
                "gsPasswordToggle"
            );


        const switchButton =
            document.getElementById(
                "gsSwitchButton"
            );


        const forgotButton =
            document.getElementById(
                "gsForgotPassword"
            );


        const message =
            document.getElementById(
                "gsAuthMessage"
            );


        const title =
            document.getElementById(
                "gsAuthTitle"
            );


        const subtitle =
            document.getElementById(
                "gsAuthSubtitle"
            );


        const switchText =
            document.getElementById(
                "gsSwitchText"
            );


        const submitButton =
            document.getElementById(
                "gsEmailSubmit"
            );


        const email =
            document.getElementById(
                "gsEmail"
            );


        const password =
            document.getElementById(
                "gsPassword"
            );


        function open(mode) {

            authMode =
                mode || "login";


            updateText();


            overlay.classList.add(
                "gs-open"
            );


            document.body.style.overflow =
                "hidden";


            setTimeout(
                function () {

                    if (email) {
                        email.focus();
                    }

                },
                300
            );
        }


        function close() {

            overlay.classList.remove(
                "gs-open"
            );


            document.body.style.overflow =
                "";

        }


        function updateText() {

            if (
                authMode ===
                "signup"
            ) {

                title.textContent =
                    "Create your GS account";

                subtitle.textContent =
                    "Join GS Platform and turn your skills into opportunities.";

                submitButton.textContent =
                    "Create account";

                switchText.textContent =
                    "Already have an account?";

                switchButton.textContent =
                    "Log in";

            } else {

                title.textContent =
                    "Welcome to GS";

                subtitle.textContent =
                    "Sign in to continue to GS Platform.";

                submitButton.textContent =
                    "Continue";

                switchText.textContent =
                    "Don't have an account?";

                switchButton.textContent =
                    "Create account";
            }
        }


        closeButton.addEventListener(
            "click",
            close
        );


        overlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    overlay
                ) {
                    close();
                }

            }
        );


        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Escape"
                ) {
                    close();
                }

            }
        );


        googleButton.addEventListener(
            "click",
            function () {

                message.textContent =
                    "Google authentication is ready for the Supabase connection.";

            }
        );


        passwordToggle.addEventListener(
            "click",
            function () {

                if (
                    password.type ===
                    "password"
                ) {

                    password.type =
                        "text";

                    passwordToggle.textContent =
                        "Hide";

                } else {

                    password.type =
                        "password";

                    passwordToggle.textContent =
                        "Show";

                }

            }
        );


        switchButton.addEventListener(
            "click",
            function () {

                authMode =
                    authMode ===
                    "login"
                        ? "signup"
                        : "login";

                message.textContent =
                    "";

                updateText();

            }
        );


        forgotButton.addEventListener(
            "click",
            function () {

                message.textContent =
                    "Password recovery will be connected through Supabase.";

            }
        );


        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                if (
                    !email.value.trim() ||
                    !password.value
                ) {

                    message.textContent =
                        "Please enter your email and password.";

                    return;
                }


                message.textContent =
                    authMode === "signup"
                        ? "Your GS account setup will continue through Supabase."
                        : "Your GS login will continue through Supabase.";

            }
        );


        /* Expose the open function */
        window.GSPlatformAuth =
            {
                open,
                close
            };
    }


    /* =====================================================
       4. CONNECT LANDING BUTTONS
       We search by visible text, so IDs don't matter.
       ===================================================== */

    function connectLandingButtons() {

        const allElements =
            document.querySelectorAll(
                "button, a, [role='button']"
            );


        allElements.forEach(
            function (element) {

                const text =
                    element.textContent
                        .trim()
                        .toLowerCase();


                if (
                    text.includes(
                        "get started"
                    )
                ) {

                    element.addEventListener(
                        "click",
                        function (event) {

                            event.preventDefault();

                            window.GSPlatformAuth.open(
                                "signup"
                            );

                        }
                    );

                }


                if (
                    text === "log in" ||
                    text === "login"
                ) {

                    element.addEventListener(
                        "click",
                        function (event) {

                            event.preventDefault();

                            window.GSPlatformAuth.open(
                                "login"
                            );

                        }
                    );

                }

            }
        );
    }


    /* =====================================================
       5. START
       ===================================================== */

    function startGSPlatform() {

        createAuthWindow();

        connectLandingButtons();


        console.log(
            "GS Platform authentication interface loaded."
        );

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            startGSPlatform
        );

    } else {

        startGSPlatform();

    }

})();
