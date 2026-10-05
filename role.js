/* =========================================================
   GS PLATFORM — ROLE SELECTION
   File: role.js

   Purpose:
   - Connect role selection to Supabase Auth
   - Verify that the user is logged in
   - Save Freelancer / Client selection
   - Protect this page from logged-out visitors
   ========================================================= */


/* =========================================================
   1. SUPABASE CONFIGURATION
   ========================================================= */

const SUPABASE_URL = "https://xykhrjrsfrcxdmvtwsww.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_WLZRphYc4uvp7wEsH_j4tw_u4zw5wSU";


const { createClient } = window.supabase;

const supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


/* =========================================================
   2. PAGE ELEMENTS
   ========================================================= */

const freelancerCard =
    document.getElementById("freelancerCard");

const clientCard =
    document.getElementById("clientCard");

const statusMessage =
    document.getElementById("statusMessage");

const loadingOverlay =
    document.getElementById("loadingOverlay");

const loadingText =
    document.getElementById("loadingText");


/* =========================================================
   3. HELPER — SHOW STATUS
   ========================================================= */

function showStatus(message, isError = false) {

    if (!statusMessage) {
        return;
    }

    statusMessage.textContent = message;

    statusMessage.classList.add("show");

    if (isError) {
        statusMessage.classList.add("error");
    } else {
        statusMessage.classList.remove("error");
    }
}


/* =========================================================
   4. HELPER — CLEAR STATUS
   ========================================================= */

function clearStatus() {

    if (!statusMessage) {
        return;
    }

    statusMessage.textContent = "";

    statusMessage.classList.remove(
        "show",
        "error"
    );
}


/* =========================================================
   5. HELPER — SHOW LOADING
   ========================================================= */

function showLoading(message = "Setting up your account...") {

    if (loadingText) {
        loadingText.textContent = message;
    }

    if (loadingOverlay) {
        loadingOverlay.classList.add("active");
        loadingOverlay.setAttribute(
            "aria-hidden",
            "false"
        );
    }
}


/* =========================================================
   6. HELPER — HIDE LOADING
   ========================================================= */

function hideLoading() {

    if (loadingOverlay) {
        loadingOverlay.classList.remove("active");
        loadingOverlay.setAttribute(
            "aria-hidden",
            "true"
        );
    }
}


/* =========================================================
   7. DISABLE ROLE BUTTONS
   ========================================================= */

function disableRoleButtons() {

    if (freelancerCard) {
        freelancerCard.disabled = true;
        freelancerCard.setAttribute(
            "aria-disabled",
            "true"
        );
    }

    if (clientCard) {
        clientCard.disabled = true;
        clientCard.setAttribute(
            "aria-disabled",
            "true"
        );
    }
}


/* =========================================================
   8. ENABLE ROLE BUTTONS
   ========================================================= */

function enableRoleButtons() {

    if (freelancerCard) {
        freelancerCard.disabled = false;
        freelancerCard.removeAttribute(
            "aria-disabled"
        );
    }

    if (clientCard) {
        clientCard.disabled = false;
        clientCard.removeAttribute(
            "aria-disabled"
        );
    }
}


/* =========================================================
   9. GET CURRENT USER
   ========================================================= */

async function getCurrentUser() {

    const {
        data,
        error
    } = await supabaseClient.auth.getUser();

    if (error) {
        throw error;
    }

    return data.user;
}


/* =========================================================
   10. CHECK LOGIN
   ========================================================= */

async function checkAuthentication() {

    try {

        const user = await getCurrentUser();

        /*
         * If there is no authenticated user,
         * this person should not be on the role page.
         */

        if (!user) {

            window.location.replace(
                "index.html"
            );

            return null;
        }

        return user;

    } catch (error) {

        console.error(
            "Authentication check failed:",
            error
        );

        showStatus(
            "We could not verify your account. Please log in again.",
            true
        );

        setTimeout(() => {

            window.location.replace(
                "index.html"
            );

        }, 1800);

        return null;
    }
}


/* =========================================================
   11. SAVE USER ROLE
   ========================================================= */

async function saveUserRole(role) {

    clearStatus();

    /*
     * Only these two role values are accepted.
     */

    if (
        role !== "freelancer" &&
        role !== "client"
    ) {

        showStatus(
            "Please choose a valid account type.",
            true
        );

        return;
    }


    disableRoleButtons();

    showLoading(
        role === "freelancer"
            ? "Setting up your freelancer account..."
            : "Setting up your client account..."
    );


    try {

        /*
         * Get the authenticated user again.
         */

        const user = await getCurrentUser();

        if (!user) {

            window.location.replace(
                "index.html"
            );

            return;
        }


        /*
         * IMPORTANT:
         *
         * This expects a Supabase table called
         * "profiles" with a column called
         * "role".
         *
         * We are using the authenticated user's
         * Supabase UUID as the profile ID.
         */

        const profileData = {
            id: user.id,
            role: role
        };


        /*
         * Save the role.
         *
         * "upsert" means:
         * - create the profile if it doesn't exist
         * - update it if it already exists
         */

        const {
            error
        } = await supabaseClient
            .from("profiles")
            .upsert(
                profileData,
                {
                    onConflict: "id"
                }
            );


        if (error) {
            throw error;
        }


        /*
         * Role saved successfully.
         *
         * We are not sending the user to
         * home.html yet.
         *
         * First we will build the correct
         * profile/setup page.
         */

        showLoading(
            "Account type saved. Preparing your profile..."
        );


        /*
         * Temporary next destination.
         *
         * We will replace this with the real
         * onboarding/profile page when that
         * page is created.
         */

        setTimeout(() => {

            window.location.href =
                "home.html";

        }, 700);


    } catch (error) {

        console.error(
            "Role save error:",
            error
        );

        hideLoading();

        enableRoleButtons();

        showStatus(
            "We couldn't save your account type. Please try again.",
            true
        );
    }
}


/* =========================================================
   12. FREELANCER CLICK
   ========================================================= */

if (freelancerCard) {

    freelancerCard.addEventListener(
        "click",
        () => {

            saveUserRole(
                "freelancer"
            );

        }
    );
}


/* =========================================================
   13. CLIENT CLICK
   ========================================================= */

if (clientCard) {

    clientCard.addEventListener(
        "click",
        () => {

            saveUserRole(
                "client"
            );

        }
    );
}


/* =========================================================
   14. START PAGE
   ========================================================= */

async function initializeRolePage() {

    /*
     * Don't show an error immediately.
     * First check the Supabase session.
     */

    clearStatus();

    const user =
        await checkAuthentication();

    /*
     * If there is no user,
     * checkAuthentication() already
     * redirects to index.html.
     */

    if (!user) {
        return;
    }

    console.log(
        "GS Platform authenticated user:",
        user.id
    );
}


/* =========================================================
   15. RUN
   ========================================================= */

initializeRolePage();
