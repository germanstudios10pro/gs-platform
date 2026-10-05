// ==========================================
// GS PLATFORM — MAIN LOGIN SCRIPT
// ==========================================

const SUPABASE_URL = "https://xykhrjrsfrcxdmvtwsww.supabase.co";
const SUPABASE_KEY = "sb_publishable_WLZRphYc4uvp7wEsH_j4tw_u4zw5wSU";

let supabaseClient = null;

// ------------------------------------------
// Start Supabase
// ------------------------------------------
function initializeSupabase() {
    if (!window.supabase) {
        console.error("Supabase library was not loaded.");
        return false;
    }

    supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    return true;
}

// ------------------------------------------
// Google Login
// ------------------------------------------
async function loginWithGoogle() {
    if (!supabaseClient) {
        alert("Login system is not ready. Please refresh the page.");
        return;
    }

    try {
        const redirectUrl =
            window.location.origin +
            window.location.pathname.replace("index.html", "") +
            "role.html";

        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: redirectUrl
            }
        });

        if (error) {
            console.error("Google login error:", error);
            alert("Google login could not start. Please try again.");
        }

    } catch (error) {
        console.error("Login error:", error);
        alert("Something went wrong. Please try again.");
    }
}

// ------------------------------------------
// Find Google button
// ------------------------------------------
function connectGoogleButton() {

    const elements = document.querySelectorAll(
        "button, a, [role='button']"
    );

    elements.forEach((element) => {

        const text = (element.textContent || "")
            .trim()
            .toLowerCase();

        if (
            text.includes("continue with google") ||
            text.includes("sign in with google") ||
            text.includes("login with google") ||
            text === "google"
        ) {

            element.addEventListener("click", function(event) {
                event.preventDefault();
                loginWithGoogle();
            });

        }

    });
}

// ------------------------------------------
// Remove broken image placeholders
// from the main login page
// ------------------------------------------
function removeBrokenImages() {

    document.querySelectorAll("img").forEach((image) => {

        image.addEventListener("error", function() {
            this.style.display = "none";
        });

    });

}

// ------------------------------------------
// Start
// ------------------------------------------
document.addEventListener("DOMContentLoaded", function() {

    initializeSupabase();

    connectGoogleButton();

    removeBrokenImages();

});
