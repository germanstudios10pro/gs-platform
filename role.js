// ==========================================
// GS PLATFORM — ROLE SELECTION
// ==========================================

const SUPABASE_URL = "https://xykhrjrsfrcxdmvtwsww.supabase.co";
const SUPABASE_KEY = "sb_publishable_WLZRphYc4uvp7wEsH_j4tw_u4zw5wSU";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// ------------------------------------------
// PAGE ELEMENTS
// ------------------------------------------

const freelancerCard = document.getElementById("freelancerCard");
const clientCard = document.getElementById("clientCard");
const statusMessage = document.getElementById("statusMessage");
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingText = document.getElementById("loadingText");

// ------------------------------------------
// HELPERS
// ------------------------------------------

function showLoading(message) {
    if (loadingText) {
        loadingText.textContent = message;
    }

    if (loadingOverlay) {
        loadingOverlay.classList.add("active");
    }
}

function hideLoading() {
    if (loadingOverlay) {
        loadingOverlay.classList.remove("active");
    }
}

function showStatus(message, error = false) {
    if (!statusMessage) return;

    statusMessage.textContent = message;
    statusMessage.classList.toggle("error", error);
}

// ------------------------------------------
// CHECK LOGIN
// ------------------------------------------

async function checkUser() {

    const {
        data: { user },
        error
    } = await supabaseClient.auth.getUser();

    if (error || !user) {

        window.location.href = "index.html";
        return null;

    }

    return user;
}

// ------------------------------------------
// SAVE ROLE
// ------------------------------------------

async function selectRole(role) {

    showLoading(
        role === "freelancer"
            ? "Setting up your Freelancer account..."
            : "Setting up your Client account..."
    );

    showStatus("");

    const user = await checkUser();

    if (!user) return;

    try {

        // Check whether a profile already exists
        const { data: existingProfile, error: profileError } =
            await supabaseClient
                .from("profiles")
                .select("id, role")
                .eq("id", user.id)
                .maybeSingle();

        if (profileError) {
            throw profileError;
        }

        // Save the selected role
        const { error: saveError } =
            await supabaseClient
                .from("profiles")
                .upsert(
                    {
                        id: user.id,
                        role: role,
                        display_name:
                            user.user_metadata?.full_name ||
                            user.user_metadata?.name ||
                            "",
                        avatar_url:
                            user.user_metadata?.avatar_url ||
                            user.user_metadata?.picture ||
                            ""
                    },
                    {
                        onConflict: "id"
                    }
                );

        if (saveError) {
            throw saveError;
        }

        showStatus("Role saved successfully.");

        /*
         * HOME PAGE COMES LATER.
         *
         * We are NOT sending the user to home.html yet
         * because that page has not been built.
         *
         * For now, keep the user on the role page.
         */

        hideLoading();

        if (role === "freelancer") {

            showStatus(
                "Freelancer selected. Your profile setup will come next."
            );

        } else {

            showStatus(
                "Client selected. Your profile setup will come next."
            );

        }

    } catch (error) {

        console.error("Role setup error:", error);

        hideLoading();

        showStatus(
            "We couldn't save your selection. Please try again.",
            true
        );

    }
}

// ------------------------------------------
// BUTTONS
// ------------------------------------------

if (freelancerCard) {

    freelancerCard.addEventListener("click", function () {
        selectRole("freelancer");
    });

}

if (clientCard) {

    clientCard.addEventListener("click", function () {
        selectRole("client");
    });

}

// ------------------------------------------
// INITIAL CHECK
// ------------------------------------------

checkUser();
