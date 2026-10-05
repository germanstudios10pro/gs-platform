const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// ==========================================
// CHECK AUTHENTICATED USER
// ==========================================

async function getCurrentUser() {

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


// ==========================================
// SAVE USER ROLE
// ==========================================

async function saveRole(role) {

    const user = await getCurrentUser();

    if (!user) return;

    const statusMessage =
        document.getElementById("statusMessage");

    const loadingOverlay =
        document.getElementById("loadingOverlay");

    const loadingText =
        document.getElementById("loadingText");


    if (loadingText) {

        loadingText.textContent =
            "Saving your choice...";

    }

    if (loadingOverlay) {

        loadingOverlay.classList.add("active");

    }


    try {

        const { error } =
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


        if (statusMessage) {

            statusMessage.textContent =
                "Your choice has been saved.";

        }


        /*
         * We are deliberately NOT redirecting yet.
         *
         * The next page will be created after
         * we confirm that role selection works.
         */

        if (loadingOverlay) {

            loadingOverlay.classList.remove("active");

        }


        console.log(
            "GS Platform role saved:",
            role
        );


    } catch (error) {

        console.error(
            "Could not save role:",
            error
        );


        if (loadingOverlay) {

            loadingOverlay.classList.remove("active");

        }


        if (statusMessage) {

            statusMessage.textContent =
                "Something went wrong. Please try again.";

            statusMessage.classList.add("error");

        }

    }

}


// ==========================================
// FREELANCER
// ==========================================

const freelancerCard =
    document.getElementById("freelancerCard");

if (freelancerCard) {

    freelancerCard.addEventListener(
        "click",
        function () {

            saveRole("freelancer");

        }
    );

}


// ==========================================
// CLIENT
// ==========================================

const clientCard =
    document.getElementById("clientCard");

if (clientCard) {

    clientCard.addEventListener(
        "click",
        function () {

            saveRole("client");

        }
    );

}


// ==========================================
// START
// ==========================================

getCurrentUser();
