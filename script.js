// ============================================
// GS PLATFORM — AUTHENTICATION CONTROLLER
// ============================================

const SUPABASE_URL = "https://xykhrjrsfrcxdmvtwsww.supabase.co";
const SUPABASE_KEY = "sb_publishable_WLZRphYc4uvp7wEsH_j4tw_u4zw5wSU";

let supabaseClient;

// --------------------------------------------
// Load Supabase if the HTML hasn't loaded it
// --------------------------------------------
function loadSupabase() {
    return new Promise((resolve, reject) => {
        if (window.supabase) {
            resolve();
            return;
        }

        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// --------------------------------------------
// Initialize
// --------------------------------------------
async function initializeAuth() {
    try {
        await loadSupabase();

        supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

        // Check whether the user has returned from Google
        const {
            data: { session }
        } = await supabaseClient.auth.getSession();

        if (session) {
            goToRolePage();
            return;
        }

        setupGoogleLogin();

    } catch (error) {
        console.error("GS Auth initialization error:", error);
    }
}

// --------------------------------------------
// Google Login
// --------------------------------------------
function setupGoogleLogin() {

    const allButtons = document.querySelectorAll("button, a");

    allButtons.forEach((button) => {

        const text = (button.textContent || "").toLowerCase();

        if (
            text.includes("google") ||
            text.includes("continue with google") ||
            text.includes("sign in with google")
        ) {

            button.addEventListener("click", async (event) => {

                event.preventDefault();

                try {

                    button.disabled = true;

                    const redirectUrl =
                        window.location.origin +
                        window.location.pathname
                            .replace("index.html", "") +
                        "role.html";

                    const { error } =
                        await supabaseClient.auth.signInWithOAuth({
                            provider: "google",
                            options: {
                                redirectTo: redirectUrl
                            }
                        });

                    if (error) {
                        console.error("Google login error:", error);
                        button.disabled = false;
                    }

                } catch (error) {

                    console.error("Google login error:", error);
                    button.disabled = false;

                }

            });

        }

    });
}

// --------------------------------------------
// Send authenticated user to role selection
// --------------------------------------------
function goToRolePage() {

    const roleUrl =
        window.location.origin +
        window.location.pathname
            .replace("index.html", "") +
        "role.html";

    window.location.href = roleUrl;
}

// --------------------------------------------
// Watch authentication state
// --------------------------------------------
async function watchAuthState() {

    if (!supabaseClient) return;

    supabaseClient.auth.onAuthStateChange((event, session) => {

        if (
            session &&
            (
                event === "SIGNED_IN" ||
                event === "INITIAL_SESSION"
            )
        ) {

            goToRolePage();

        }

    });
}

// --------------------------------------------
// Start GS Platform authentication
// --------------------------------------------
(async function () {

    await initializeAuth();

    if (supabaseClient) {
        await watchAuthState();
    }

})();
