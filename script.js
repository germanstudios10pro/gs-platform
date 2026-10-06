"use strict";

/* =========================================================
   GS PLATFORM
   SUPABASE AUTHENTICATION + ROLE SELECTION
   ========================================================= */


/* =========================================================
   1. SUPABASE
   ========================================================= */

const SUPABASE_URL =
    "https://xykhrjrsfrcxdmvtwsww.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_WLZRphYc4uvp7wEsH_j4tw_u4zw5wSU";

let supabaseClient = null;
let authMode = "login";


/* =========================================================
   2. SUPABASE INITIALIZATION
   ========================================================= */

async function initializeSupabase() {

    try {

        if (
            !window.supabase ||
            typeof window.supabase.createClient !== "function"
        ) {
            throw new Error(
                "Supabase library is not available."
            );
        }

        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_PUBLISHABLE_KEY
            );

        console.log(
            "GS Platform: Supabase connected."
        );

        return true;

    } catch (error) {

        console.error(
            "GS Platform: Supabase initialization failed:",
            error
        );

        return false;
    }
}


/* =========================================================
   3. ELEMENT HELPERS
   ========================================================= */

function get(id) {
    return document.getElementById(id);
}


/* =========================================================
   4. AUTH MODAL
   ========================================================= */

function openAuth(mode = "login") {

    authMode = mode;

    const overlay = get("authOverlay");

    if (!overlay) {
        console.error(
            "GS Platform: authOverlay not found."
        );
        return;
    }

    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");

    document.body.classList.add("auth-open");

    updateAuthText();

    const email =
        get("email");

    if (email) {
        setTimeout(() => email.focus(), 250);
    }
}


function closeAuth() {

    const overlay =
        get("authOverlay");

    if (!overlay) return;

    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");

    document.body.classList.remove("auth-open");
}


function updateAuthText() {

    const title =
        get("authTitle");

    const subtitle =
        get("authSubtitle");

    const submit =
        get("emailSubmitButton");

    const switchText =
        get("authSwitchText");

    const switchButton =
        get("authSwitchButton");

    if (!title || !subtitle || !submit ||
        !switchText || !switchButton) {
        return;
    }


    if (authMode === "signup") {

        title.textContent =
            "Create your GS account";

        subtitle.textContent =
            "Join GS Platform and turn your skills into opportunities.";

        submit.textContent =
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

        submit.textContent =
            "Continue";

        switchText.textContent =
            "Don't have an account?";

        switchButton.textContent =
            "Create account";
    }
}


/* =========================================================
   5. AUTH MESSAGE
   ========================================================= */

function showAuthMessage(message) {

    const element =
        get("authMessage");

    if (element) {
        element.textContent =
            message || "";
    }
}


/* =========================================================
   6. PASSWORD VISIBILITY
   ========================================================= */

function connectPasswordToggle() {

    const button =
        get("togglePassword");

    const input =
        get("password");

    if (!button || !input) return;

    button.addEventListener(
        "click",
        () => {

            if (input.type === "password") {

                input.type = "text";

                button.textContent =
                    "Hide";

                button.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                input.type = "password";

                button.textContent =
                    "Show";

                button.setAttribute(
                    "aria-label",
                    "Show password"
                );
            }
        }
    );
}


/* =========================================================
   7. EMAIL AUTHENTICATION
   ========================================================= */

function connectEmailAuthentication() {

    const form =
        get("emailAuthForm");

    if (!form) {
        console.error(
            "GS Platform: emailAuthForm not found."
        );
        return;
    }


    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            showAuthMessage("");


            const emailInput =
                get("email");

            const passwordInput =
                get("password");

            const submitButton =
                get("emailSubmitButton");


            if (!emailInput || !passwordInput) {
                return;
            }


            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            if (!email || !password) {

                showAuthMessage(
                    "Please enter your email and password."
                );

                return;
            }


            if (!supabaseClient) {

                showAuthMessage(
                    "Supabase is not ready yet. Please try again."
                );

                return;
            }


            if (submitButton) {
                submitButton.disabled = true;

                submitButton.textContent =
                    authMode === "signup"
                        ? "Creating account..."
                        : "Signing in...";
            }


            try {

                let result;


                /* -------------------------
                   SIGN UP
                ------------------------- */

                if (authMode === "signup") {

                    result =
                        await supabaseClient.auth.signUp({

                            email: email,

                            password: password,

                            options: {

                                emailRedirectTo:
                                    window.location.href

                            }
                        });


                    if (result.error) {
                        throw result.error;
                    }


                    if (result.data.session) {

                        showAuthMessage(
                            "Account created successfully."
                        );

                        closeAuth();

                        await handleAuthenticatedUser();

                    } else {

                        showAuthMessage(
                            "Account created. Check your email to confirm your account."
                        );
                    }


                /* -------------------------
                   LOGIN
                ------------------------- */

                } else {

                    result =
                        await supabaseClient.auth
                            .signInWithPassword({

                                email: email,

                                password: password

                            });


                    if (result.error) {
                        throw result.error;
                    }


                    showAuthMessage(
                        "Login successful."
                    );

                    closeAuth();

                    await handleAuthenticatedUser();
                }


            } catch (error) {

                console.error(
                    "GS Platform authentication error:",
                    error
                );


                showAuthMessage(
                    error.message ||
                    "Authentication failed. Please try again."
                );


            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    updateAuthText();
                }
            }
        }
    );
}


/* =========================================================
   8. GOOGLE AUTHENTICATION
   ========================================================= */

function connectGoogleAuthentication() {

    const button =
        get("googleButton");

    if (!button) {
        console.error(
            "GS Platform: googleButton not found."
        );
        return;
    }


    button.addEventListener(
        "click",
        async () => {

            showAuthMessage(
                "Connecting to Google..."
            );


            if (!supabaseClient) {

                showAuthMessage(
                    "Supabase is not ready yet. Please try again."
                );

                return;
            }


            button.disabled = true;


            try {

                const {
                    error
                } =
                    await supabaseClient.auth
                        .signInWithOAuth({

                            provider: "google",

                            options: {

                                redirectTo:
                                    window.location.href

                            }
                        });


                if (error) {
                    throw error;
                }


            } catch (error) {

                console.error(
                    "Google authentication error:",
                    error
                );


                showAuthMessage(
                    error.message ||
                    "Google login could not be started."
                );


            } finally {

                button.disabled = false;
            }
        }
    );
}


/* =========================================================
   9. FORGOT PASSWORD
   ========================================================= */

function connectForgotPassword() {

    const button =
        get("forgotPasswordButton");

    if (!button) return;


    button.addEventListener(
        "click",
        async () => {

            const emailInput =
                get("email");

            if (!emailInput) return;


            const email =
                emailInput.value.trim();


            if (!email) {

                showAuthMessage(
                    "Enter your email address first."
                );

                emailInput.focus();

                return;
            }


            if (!supabaseClient) {

                showAuthMessage(
                    "Supabase is not ready yet."
                );

                return;
            }


            try {

                const {
                    error
                } =
                    await supabaseClient.auth
                        .resetPasswordForEmail(
                            email,
                            {
                                redirectTo:
                                    window.location.href
                            }
                        );


                if (error) {
                    throw error;
                }


                showAuthMessage(
                    "Password reset instructions have been sent to your email."
                );


            } catch (error) {

                console.error(
                    "Password reset error:",
                    error
                );


                showAuthMessage(
                    error.message ||
                    "Unable to send password reset email."
                );
            }
        }
    );
}


/* =========================================================
   10. AUTH MODAL CONTROLS
   ========================================================= */

function connectAuthControls() {

    const closeButton =
        get("closeAuthButton");

    const overlay =
        get("authOverlay");

    const switchButton =
        get("authSwitchButton");


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeAuth
        );
    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            (event) => {

                if (event.target === overlay) {
                    closeAuth();
                }
            }
        );
    }


    if (switchButton) {

        switchButton.addEventListener(
            "click",
            () => {

                authMode =
                    authMode === "login"
                        ? "signup"
                        : "login";

                showAuthMessage("");

                updateAuthText();
            }
        );
    }


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {
                closeAuth();
            }
        }
    );
}


/* =========================================================
   11. LANDING BUTTONS
   ========================================================= */

function connectLandingButtons() {

    const getStarted =
        get("getStartedButton");

    const heroLogin =
        get("heroLoginButton");

    const topLogin =
        get("topLoginButton");


    if (getStarted) {

        getStarted.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                openAuth("signup");
            }
        );
    }


    if (heroLogin) {

        heroLogin.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                openAuth("login");
            }
        );
    }


    if (topLogin) {

        topLogin.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                openAuth("login");
            }
        );
    }
}


/* =========================================================
   12. ROLE SELECTION
   ========================================================= */

function createRoleSelectionScreen() {

    if (get("roleSelectionScreen")) {
        return;
    }


    const screen =
        document.createElement("section");


    screen.id =
        "roleSelectionScreen";


    screen.className =
        "role-selection-screen";


    screen.innerHTML = `

        <div class="role-selection-container">

            <div class="role-brand">

                <div class="role-brand-mark">
                    GS
                </div>

                <span>
                    GS PLATFORM
                </span>

            </div>


            <div class="role-step">
                STEP 1 OF 2
            </div>


            <h1>
                Welcome to GS Platform
            </h1>


            <p class="role-subtitle">
                How would you like to use GS Platform?
            </p>


            <div class="role-options">

                <button
                    type="button"
                    class="role-card"
                    data-role="freelancer"
                >

                    <div class="role-icon">
                        F
                    </div>

                    <div class="role-card-content">

                        <span class="role-card-label">
                            SERVICE PROVIDER
                        </span>

                        <h2>
                            I'm a Freelancer
                        </h2>

                        <p>
                            Offer your skills, showcase your work,
                            and work with clients.
                        </p>

                    </div>

                    <span class="role-arrow">
                        →
                    </span>

                </button>


                <button
                    type="button"
                    class="role-card"
                    data-role="client"
                >

                    <div class="role-icon">
                        C
                    </div>

                    <div class="role-card-content">

                        <span class="role-card-label">
                            SERVICE BUYER
                        </span>

                        <h2>
                            I'm a Client
                        </h2>

                        <p>
                            Find skilled professionals and hire
                            the right person for your project.
                        </p>

                    </div>

                    <span class="role-arrow">
                        →
                    </span>

                </button>

            </div>


            <div
                class="role-status"
                id="roleStatus"
            ></div>


            <button
                type="button"
                class="role-back-button"
                id="roleBackButton"
            >
                Back to login
            </button>


            <div
                class="role-loading"
                id="roleLoading"
            >

                <div class="role-loader"></div>

                <p>
                    Setting up your GS account...
                </p>

            </div>

        </div>
    `;


    document.body.appendChild(screen);


    connectRoleButtons();
}


/* =========================================================
   13. ROLE BUTTONS
   ========================================================= */

function connectRoleButtons() {

    const screen =
        get("roleSelectionScreen");

    if (!screen) return;


    const cards =
        screen.querySelectorAll(
            ".role-card"
        );


    cards.forEach(
        (card) => {

            card.addEventListener(
                "click",
                async () => {

                    const role =
                        card.dataset.role;

                    await saveUserRole(role);
                }
            );
        }
    );


    const back =
        get("roleBackButton");

    if (back) {

        back.addEventListener(
            "click",
            () => {

                hideRoleSelection();

                openAuth("login");
            }
        );
    }
}


/* =========================================================
   14. SAVE ROLE
   ========================================================= */

async function saveUserRole(role) {

    if (
        role !== "freelancer" &&
        role !== "client"
    ) {
        return;
    }


    const status =
        get("roleStatus");

    const loading =
        get("roleLoading");


    if (status) {
        status.textContent = "";
    }


    if (loading) {
        loading.classList.add("active");
    }


    try {

        if (!supabaseClient) {
            throw new Error(
                "Supabase is not connected."
            );
        }


        const {
            data: {
                user
            },
            error: userError
        } =
            await supabaseClient.auth
                .getUser();


        if (userError) {
            throw userError;
        }


        if (!user) {
            throw new Error(
                "Your session could not be found. Please log in again."
            );
        }


        const {
            error
        } =
            await supabaseClient
                .from("profiles")
                .upsert(
                    {
                        id: user.id,
                        role: role
                    },
                    {
                        onConflict: "id"
                    }
                );


        if (error) {
            throw error;
        }


        if (status) {

            status.textContent =
                "Your account is ready.";
        }


        hideRoleSelection();


        showMainApp();


    } catch (error) {

        console.error(
            "Role save error:",
            error
        );


        if (status) {

            status.textContent =
                error.message ||
                "We couldn't save your role. Please try again.";
        }


    } finally {

        if (loading) {
            loading.classList.remove("active");
        }
    }
}


/* =========================================================
   15. SHOW / HIDE ROLE SCREEN
   ========================================================= */

function showRoleSelection() {

    createRoleSelectionScreen();


    const screen =
        get("roleSelectionScreen");

    if (!screen) return;


    screen.classList.add("active");

    document.body.classList.add(
        "gs-role-active"
    );
}


function hideRoleSelection() {

    const screen =
        get("roleSelectionScreen");

    if (!screen) return;


    screen.classList.remove("active");

    document.body.classList.remove(
        "gs-role-active"
    );
}


/* =========================================================
   16. PROFILE CHECK
   ========================================================= */

async function handleAuthenticatedUser() {

    if (!supabaseClient) return;


    try {

        const {
            data: {
                user
            },
            error: userError
        } =
            await supabaseClient.auth
                .getUser();


        if (userError) {
            throw userError;
        }


        if (!user) {
            return;
        }


        const {
            data: profile,
            error: profileError
        } =
            await supabaseClient
                .from("profiles")
                .select(
                    "id, role, username, display_name, bio, avatar_url, skills"
                )
                .eq(
                    "id",
                    user.id
                )
                .maybeSingle();


        if (
            profileError &&
            profileError.code !== "PGRST116"
        ) {
            throw profileError;
        }


        if (
            !profile ||
            !profile.role
        ) {

            showRoleSelection();

            return;
        }


        showMainApp();


    } catch (error) {

        console.error(
            "GS Platform profile check failed:",
            error
        );

        /*
         * If the profile cannot be read yet,
         * do not pretend the user is logged out.
         */
    }
}


/* =========================================================
   17. MAIN APP
   ========================================================= */

function showMainApp() {

    /*
     * The full dashboard/navigation will be
     * connected here as we build the next stage.
     */

    console.log(
        "GS Platform: authenticated user is ready."
    );
}


/* =========================================================
   18. AUTH STATE LISTENER
   ========================================================= */

function connectAuthStateListener() {

    if (!supabaseClient) return;


    supabaseClient.auth.onAuthStateChange(
        async (event, session) => {

            console.log(
                "GS Platform auth event:",
                event
            );


            if (
                session &&
                (
                    event === "SIGNED_IN" ||
                    event === "INITIAL_SESSION"
                )
            ) {

                /*
                 * Avoid immediately running complex
                 * Supabase queries inside the auth callback.
                 */

                setTimeout(
                    () => {
                        handleAuthenticatedUser();
                    },
                    0
                );
            }


            if (
                event === "SIGNED_OUT"
            ) {

                hideRoleSelection();
            }
        }
    );
}


/* =========================================================
   19. YEAR
   ========================================================= */

function setCurrentYear() {

    const year =
        get("currentYear");

    if (year) {

        year.textContent =
            new Date().getFullYear();
    }
}


/* =========================================================
   20. ROTATING HERO TEXT
   ========================================================= */

function startHeroRotation() {

    const word =
        get("rotatingWord");

    const message =
        get("rotatingMessage");


    if (!word || !message) {
        return;
    }


    const words = [
        "Your opportunity.",
        "Your future.",
        "Your next project.",
        "Your growth."
    ];


    const messages = [
        "Find work that matches what you do best.",
        "Build your reputation through real work.",
        "Connect with people who need your skills.",
        "Grow your professional future on GS."
    ];


    let index = 0;


    setInterval(
        () => {

            word.classList.add("changing");
            message.classList.add("changing");


            setTimeout(
                () => {

                    index =
                        (index + 1) %
                        words.length;


                    word.textContent =
                        words[index];

                    message.textContent =
                        messages[index];


                    word.classList.remove(
                        "changing"
                    );

                    message.classList.remove(
                        "changing"
                    );

                },
                350
            );

        },
        4500
    );
}


/* =========================================================
   21. START PLATFORM
   ========================================================= */

async function startGSPlatform() {

    console.log(
        "GS Platform: starting..."
    );


    setCurrentYear();


    connectLandingButtons();

    connectAuthControls();

    connectPasswordToggle();

    connectEmailAuthentication();

    connectGoogleAuthentication();

    connectForgotPassword();

    createRoleSelectionScreen();

    startHeroRotation();


    const connected =
        await initializeSupabase();


    if (!connected) {

        console.error(
            "GS Platform: Supabase could not be initialized."
        );

        return;
    }


    connectAuthStateListener();


    /*
     * Check whether the visitor is already logged in.
     */

    try {

        const {
            data: {
                session
            }
        } =
            await supabaseClient.auth
                .getSession();


        if (session) {

            await handleAuthenticatedUser();
        }

    } catch (error) {

        console.error(
            "GS Platform: session check failed:",
            error
        );
    }
}


/* =========================================================
   22. GLOBAL AUTH API
   ========================================================= */

window.GSPlatformAuth = {

    open: openAuth,

    close: closeAuth
};


/* =========================================================
   23. START
   ========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startGSPlatform
    );

} else {

    startGSPlatform();
}
