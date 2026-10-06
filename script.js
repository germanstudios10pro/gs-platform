"use strict";

/* =========================================================
GS PLATFORM
SUPABASE AUTHENTICATION + ROLE SELECTION
Everything stays inside this one script.js file.
========================================================= */

/* =========================================================

1. SUPABASE PROJECT
   ========================================================= */

const SUPABASE_URL =
"https://xykhrjrsfrcxdmvtwsww.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
"sb_publishable_WLZRphYc4uvp7wEsH_j4tw_u4zw5wSU";

let supabaseClient = null;
let authMode = "login";

/* =========================================================
2. APP ELEMENTS
========================================================= */

let roleSelectionScreen = null;
let heroSection = null;
let roleStatusMessage = null;
let roleLoading = null;

/* =========================================================
3. LOAD SUPABASE LIBRARY
========================================================= */

function loadSupabaseLibrary() {

return new Promise((resolve, reject) => {

    if (
        window.supabase &&
        typeof window.supabase.createClient === "function"
    ) {
        resolve();
        return;
    }


    const existing =
        document.querySelector(
            'script[src*="supabase-js"]'
        );


    if (existing) {

        existing.addEventListener(
            "load",
            resolve,
            { once: true }
        );

        existing.addEventListener(
            "error",
            reject,
            { once: true }
        );

        return;
    }


    const script =
        document.createElement("script");


    script.src =
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";


    script.async = true;


    script.onload = resolve;


    script.onerror = () => {

        reject(
            new Error(
                "Supabase library could not be loaded."
            )
        );

    };


    document.head.appendChild(script);

});

}

/* =========================================================
4. CONNECT TO SUPABASE
========================================================= */

async function initializeSupabase() {

try {

    await loadSupabaseLibrary();


    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );


    console.log(
        "GS Platform: Supabase connected successfully."
    );


    return true;

} catch (error) {

    console.error(
        "GS Platform: Supabase connection failed.",
        error
    );


    return false;
}

}

/* =========================================================
5. GET CURRENT USER
========================================================= */

async function getCurrentUser() {

if (!supabaseClient) {
    return null;
}


try {

    const {
        data,
        error
    } =
        await supabaseClient.auth.getUser();


    if (error) {
        throw error;
    }


    return data.user || null;

} catch (error) {

    console.error(
        "GS Platform: Could not get current user.",
        error
    );


    return null;
}

}

/* =========================================================
6. CREATE AUTH WINDOW
========================================================= */

function createAuthWindow() {

if (
    document.getElementById(
        "gsAuthOverlay"
    )
) {
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

/* =========================================================
7. AUTH STYLES
========================================================= */

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
        background: rgba(3,10,20,.82);
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
        width: min(440px,100%);
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
            255,255,255,.12
        );
        box-shadow:
            0 30px 90px rgba(
                0,0,0,.55
            );
        color: #fff;
        font-family:
            Arial,
            Helvetica,
            sans-serif;
        transform:
            translateY(20px)
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
        background:
            rgba(255,255,255,.08);
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
        color: rgba(255,255,255,.65);
        font-size: 14px;
        line-height: 1.5;
    }


    .gs-google-button {
        width: 100%;
        min-height: 54px;
        border: 1px solid rgba(
            255,255,255,.14
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


    .gs-google-icon {
        font-weight: 900;
        font-size: 19px;
    }


    .gs-divider {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 21px 0;
        color: rgba(255,255,255,.42);
        font-size: 11px;
    }


    .gs-divider span {
        height: 1px;
        flex: 1;
        background:
            rgba(255,255,255,.12);
    }


    #gsEmailForm label {
        display: block;
        margin: 0 0 7px;
        color: rgba(255,255,255,.8);
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
            rgba(255,255,255,.12);
        border-radius: 14px;
        outline: none;
        background:
            rgba(255,255,255,.06);
        color: #fff;
        font-size: 15px;
    }


    #gsEmailForm input::placeholder {
        color:
            rgba(255,255,255,.38);
    }


    #gsEmailForm input:focus {
        border-color: #ffd43b;
        box-shadow:
            0 0 0 3px
            rgba(255,212,59,.10);
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
        border-top:
            1px solid
            rgba(255,255,255,.09);
        color:
            rgba(255,255,255,.55);
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


    @media (max-width:480px) {

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

/* =========================================================
8. AUTH CONTROLS
========================================================= */

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


/* =====================================================
   GOOGLE LOGIN
   ===================================================== */

googleButton.addEventListener(
    "click",
    async function () {

        message.textContent =
            "Connecting to Google...";


        if (!supabaseClient) {

            message.textContent =
                "Supabase is still connecting. Please try again.";

            return;
        }


        googleButton.disabled =
            true;


        try {

            const {
                error
            } =
                await supabaseClient.auth
                    .signInWithOAuth({

                        provider:
                            "google",

                        options: {

                            redirectTo:
                                window.location.origin +
                                window.location.pathname

                        }

                    });


            if (error) {
                throw error;
            }


        } catch (error) {

            console.error(
                "Google login error:",
                error
            );


            message.textContent =
                error.message ||
                "Google login could not be started.";

        } finally {

            googleButton.disabled =
                false;
        }
    }
);


/* =====================================================
   EMAIL LOGIN / SIGNUP
   ===================================================== */

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const emailValue =
            email.value.trim();

        const passwordValue =
            password.value;


        if (
            !emailValue ||
            !passwordValue
        ) {

            message.textContent =
                "Please enter your email and password.";

            return;
        }


        if (!supabaseClient) {

            message.textContent =
                "Supabase is still connecting. Please try again.";

            return;
        }


        submitButton.disabled =
            true;


        submitButton.textContent =
            authMode === "signup"
                ? "Creating account..."
                : "Signing in...";


        try {

            let result;


            if (
                authMode ===
                "signup"
            ) {

                result =
                    await supabaseClient.auth
                        .signUp({

                            email:
                                emailValue,

                            password:
                                passwordValue,

                            options: {

                                emailRedirectTo:
                                    window.location.origin +
                                    window.location.pathname

                            }

                        });

            } else {

                result =
                    await supabaseClient.auth
                        .signInWithPassword({

                            email:
                                emailValue,

                            password:
                                passwordValue

                        });
            }


            if (result.error) {
                throw result.error;
            }


            if (
                authMode ===
                "signup"
            ) {

                if (
                    result.data.session
                ) {

                    message.textContent =
                        "Account created successfully.";

                    close();


                    setTimeout(
                        function () {

                            checkUserAndContinue();

                        },
                        300
                    );

                } else {

                    message.textContent =
                        "Account created. Check your email to confirm your account.";
                }

            } else {

                message.textContent =
                    "Login successful. Welcome to GS Platform.";

                close();


                setTimeout(
                    function () {

                        checkUserAndContinue();

                    },
                    300
                );
            }


        } catch (error) {

            console.error(
                "Email authentication error:",
                error
            );


            message.textContent =
                error.message ||
                "Authentication failed.";

        } finally {

            submitButton.disabled =
                false;

            updateText();
        }
    }
);


/* =====================================================
   PASSWORD VISIBILITY
   ===================================================== */

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


/* =====================================================
   LOGIN / SIGNUP SWITCH
   ===================================================== */

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


/* =====================================================
   PASSWORD RESET
   ===================================================== */

forgotButton.addEventListener(
    "click",
    async function () {

        const emailValue =
            email.value.trim();


        if (!emailValue) {

            message.textContent =
                "Enter your email address first.";

            email.focus();

            return;
        }


        if (!supabaseClient) {

            message.textContent =
                "Supabase is still connecting.";

            return;
        }


        try {

            const {
                error
            } =
                await supabaseClient.auth
                    .resetPasswordForEmail(
                        emailValue,
                        {
                            redirectTo:
                                window.location.origin +
                                window.location.pathname
                        }
                    );


            if (error) {
                throw error;
            }


            message.textContent =
                "Password reset instructions have been sent to your email.";

        } catch (error) {

            message.textContent =
                error.message ||
                "Unable to send password reset email.";
        }
    }
);


window.GSPlatformAuth = {
    open,
    close
};

}

/* =========================================================
9. ROLE SELECTION ELEMENTS
========================================================= */

function connectRoleSelection() {

roleSelectionScreen =
    document.getElementById(
        "roleSelectionScreen"
    );

heroSection =
    document.getElementById(
        "heroSection"
    );

roleStatusMessage =
    document.getElementById(
        "roleStatusMessage"
    );

roleLoading =
    document.getElementById(
        "roleLoading"
    );


const freelancerButton =
    document.getElementById(
        "freelancerRoleButton"
    );

const clientButton =
    document.getElementById(
        "clientRoleButton"
    );

const backButton =
    document.getElementById(
        "roleBackButton"
    );


if (
    freelancerButton
) {

    freelancerButton.addEventListener(
        "click",
        function () {

            saveUserRole(
                "freelancer"
            );

        }
    );
}


if (
    clientButton
) {

    clientButton.addEventListener(
        "click",
        function () {

            saveUserRole(
                "client"
            );

        }
    );
}


if (
    backButton
) {

    backButton.addEventListener(
        "click",
        function () {

            hideRoleSelection();

        }
    );
}

}

/* =========================================================
10. SHOW ROLE SELECTION
========================================================= */

function showRoleSelection() {

if (!roleSelectionScreen) {
    return;
}


if (heroSection) {

    heroSection.style.display =
        "none";
}


roleSelectionScreen.classList.add(
    "active"
);


roleSelectionScreen.setAttribute(
    "aria-hidden",
    "false"
);


document.body.classList.add(
    "gs-role-active"
);


window.scrollTo(
    0,
    0
);


if (roleStatusMessage) {

    roleStatusMessage.textContent =
        "";
}

}

/* =========================================================
11. HIDE ROLE SELECTION
========================================================= */

function hideRoleSelection() {

if (!roleSelectionScreen) {
    return;
}


roleSelectionScreen.classList.remove(
    "active"
);


roleSelectionScreen.setAttribute(
    "aria-hidden",
    "true"
);


document.body.classList.remove(
    "gs-role-active"
);


if (heroSection) {

    heroSection.style.display =
        "";
}

}

/* =========================================================
12. ROLE LOADING
========================================================= */

function setRoleLoading(isLoading) {

if (!roleLoading) {
    return;
}


if (isLoading) {

    roleLoading.classList.add(
        "active"
    );

    roleLoading.setAttribute(
        "aria-hidden",
        "false"
    );

} else {

    roleLoading.classList.remove(
        "active"
    );

    roleLoading.setAttribute(
        "aria-hidden",
        "true"
    );
}

}

/* =========================================================
13. SAVE USER ROLE
========================================================= */

async function saveUserRole(role) {

if (
    role !== "freelancer" &&
    role !== "client"
) {
    return;
}


const user =
    await getCurrentUser();


if (!user) {

    if (roleStatusMessage) {

        roleStatusMessage.textContent =
            "Your session has expired. Please log in again.";
    }

    return;
}


setRoleLoading(true);


if (roleStatusMessage) {

    roleStatusMessage.textContent =
        "";
}


try {

    const {
        error
    } =
        await supabaseClient
            .from("profiles")
            .upsert(
                {
                    id:
                        user.id,

                    role:
                        role
                },
                {
                    onConflict:
                        "id"
                }
            );


    if (error) {
        throw error;
    }


    console.log(
        "GS Platform: Role saved:",
        role
    );


    setRoleLoading(false);


    if (roleStatusMessage) {

        roleStatusMessage.textContent =
            "Your choice has been saved.";
    }


    /*
     * We deliberately do not create another HTML page.
     *
     * The next GS Platform screen will also live
     * inside index.html.
     */

    setTimeout(
        function () {

            openRoleDestination(
                role
            );

        },
        500
    );


} catch (error) {

    console.error(
        "GS Platform: Could not save role.",
        error
    );


    setRoleLoading(false);


    if (roleStatusMessage) {

        roleStatusMessage.textContent =
            error.message ||
            "We could not save your choice. Please try again.";
    }
}

}

/* =========================================================
14. ROLE DESTINATION
========================================================= */

function openRoleDestination(role) {

/*
 * For now we only confirm the role.
 *
 * Freelancer and Client dashboards will be added
 * later inside this same index.html.
 */

console.log(
    "GS Platform: Opening role destination:",
    role
);


if (roleStatusMessage) {

    if (role === "freelancer") {

        roleStatusMessage.textContent =
            "Freelancer account ready.";

    } else {

        roleStatusMessage.textContent =
            "Client account ready.";
    }
}

}

/* =========================================================
15. CHECK USER AND CONTINUE
========================================================= */

async function checkUserAndContinue() {

if (!supabaseClient) {
    return;
}


const user =
    await getCurrentUser();


if (!user) {
    return;
}


console.log(
    "GS Platform: Authenticated user detected:",
    user.email
);


try {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("profiles")
            .select(
                "role"
            )
            .eq(
                "id",
                user.id
            )
            .maybeSingle();


    if (error) {
        throw error;
    }


    const role =
        data &&
        data.role
            ? data.role
            : null;


    if (
        role === "freelancer" ||
        role === "client"
    ) {

        console.log(
            "GS Platform: Existing role:",
            role
        );


        openRoleDestination(
            role
        );


        return;
    }


    /*
     * No role yet.
     * Show the role selection screen.
     */

    showRoleSelection();


} catch (error) {

    console.error(
        "GS Platform: Could not check profile role.",
        error
    );


    /*
     * If the profile exists but has no role,
     * show role selection.
     */

    showRoleSelection();
}

}

/* =========================================================
16. CONNECT LANDING-PAGE BUTTONS
========================================================= */

function connectLandingButtons() {

const getStartedButtons =
    document.querySelectorAll(
        "#getStartedButton"
    );


const loginButtons =
    document.querySelectorAll(
        "#topLoginButton, #heroLoginButton"
    );


getStartedButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                if (
                    window.GSPlatformAuth
                ) {

                    window.GSPlatformAuth.open(
                        "signup"
                    );
                }
            }
        );
    }
);


loginButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                if (
                    window.GSPlatformAuth
                ) {

                    window.GSPlatformAuth.open(
                        "login"
                    );
                }
            }
        );
    }
);

}

/* =========================================================
17. AUTH STATE LISTENER
========================================================= */

function connectAuthStateListener() {

if (!supabaseClient) {
    return;
}


supabaseClient.auth.onAuthStateChange(
    function (
        event,
        session
    ) {

        console.log(
            "GS Platform auth event:",
            event
        );


        if (
            event ===
            "SIGNED_IN" &&
            session &&
            session.user
        ) {

            /*
             * Delay slightly so Supabase can finish
             * restoring the session after OAuth.
             */

            setTimeout(
                function () {

                    checkUserAndContinue();

                },
                150
            );
        }
    }
);

}

/* =========================================================
18. START GS PLATFORM
========================================================= */

async function startGSPlatform() {

/*
 * Connect the HTML role controls.
 */

connectRoleSelection();


/*
 * Create the existing working authentication window.
 */

createAuthWindow();


/*
 * Connect landing-page buttons.
 */

connectLandingButtons();


/*
 * Connect Supabase.
 */

const connected =
    await initializeSupabase();


if (!connected) {

    console.error(
        "GS Platform: Supabase authentication is not available."
    );

    return;
}


/*
 * Listen for Google/email authentication events.
 */

connectAuthStateListener();


/*
 * Check whether a user is already logged in.
 *
 * This is especially important after Google OAuth
 * returns to index.html.
 */

await checkUserAndContinue();


console.log(
    "GS Platform: Authentication and role system ready."
);

}

/* =========================================================
19. START
========================================================= */

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
