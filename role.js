// ============================================================
// GS PLATFORM
// ROLE SELECTION
// File: role.js
// ============================================================

const SUPABASE_URL = "https://xykhrjrsfrcxdmvtwsww.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_WLZRphYc4uvp7wEsH_j4tw_u4zw5wSU";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


// ============================================================
// PAGE ELEMENTS
// ============================================================

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


// ============================================================
// STARTUP
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {

  console.log("GS Platform role.js loaded.");

  await checkLoggedInUser();

});


// ============================================================
// CHECK LOGIN
// ============================================================

async function checkLoggedInUser() {

  try {

    const {
      data: { user },
      error
    } = await supabaseClient.auth.getUser();


    if (error) {

      console.error(
        "Authentication check failed:",
        error
      );

      redirectToLogin();

      return;
    }


    if (!user) {

      console.log(
        "No authenticated user found."
      );

      redirectToLogin();

      return;
    }


    console.log(
      "Authenticated user:",
      user.email
    );


    // Check whether this user already has a role.
    await checkExistingProfile(user);


  } catch (error) {

    console.error(
      "Unexpected authentication error:",
      error
    );

    redirectToLogin();

  }

}


// ============================================================
// CHECK EXISTING PROFILE
// ============================================================

async function checkExistingProfile(user) {

  try {

    const {
      data: profile,
      error
    } = await supabaseClient
      .from("profiles")
      .select("id, role")
      .eq("id", user.id)
      .maybeSingle();


    if (error) {

      console.error(
        "Profile check failed:",
        error
      );

      return;
    }


    // If the user already selected a role,
    // don't ask them again.
    if (profile && profile.role) {

      console.log(
        "Existing role:",
        profile.role
      );

      showStatus(
        "Your account is already set up."
      );

      goToHome();

    }

  } catch (error) {

    console.error(
      "Profile check error:",
      error
    );

  }

}


// ============================================================
// FREELANCER
// ============================================================

if (freelancerCard) {

  freelancerCard.addEventListener(
    "click",
    async () => {

      await selectRole("freelancer");

    }
  );

}


// ============================================================
// CLIENT
// ============================================================

if (clientCard) {

  clientCard.addEventListener(
    "click",
    async () => {

      await selectRole("client");

    }
  );

}


// ============================================================
// SAVE ROLE
// ============================================================

async function selectRole(role) {

  if (
    role !== "freelancer" &&
    role !== "client"
  ) {

    return;

  }


  try {

    // Disable both choices while saving.
    setCardsDisabled(true);


    showLoading(
      role === "freelancer"
        ? "Setting up your freelancer account..."
        : "Setting up your client account..."
    );


    // Get currently authenticated user.
    const {
      data: { user },
      error: userError
    } = await supabaseClient.auth.getUser();


    if (userError || !user) {

      throw new Error(
        "Your login session could not be found."
      );

    }


    // --------------------------------------------------------
    // Get Google account information
    // --------------------------------------------------------

    const metadata =
      user.user_metadata || {};


    const displayName =
      metadata.full_name ||
      metadata.name ||
      metadata.display_name ||
      "";


    const avatarUrl =
      metadata.avatar_url ||
      metadata.picture ||
      "";


    // --------------------------------------------------------
    // Prepare profile
    // --------------------------------------------------------

    const profileData = {

      id: user.id,

      role: role

    };


    if (displayName) {

      profileData.display_name =
        displayName;

    }


    if (avatarUrl) {

      profileData.avatar_url =
        avatarUrl;

    }


    // --------------------------------------------------------
    // Save profile
    // --------------------------------------------------------

    const {
      error: saveError
    } = await supabaseClient
      .from("profiles")
      .upsert(
        profileData,
        {
          onConflict: "id"
        }
      );


    if (saveError) {

      throw saveError;

    }


    console.log(
      "Role successfully saved:",
      role
    );


    showLoading(
      "Account setup complete..."
    );


    // Give Supabase a moment to finish.
    setTimeout(() => {

      goToHome();

    }, 700);


  } catch (error) {

    console.error(
      "Role setup error:",
      error
    );


    hideLoading();


    showStatus(
      "Something went wrong. Please try again."
    );


    setCardsDisabled(false);

  }

}


// ============================================================
// GO TO HOME
// ============================================================

function goToHome() {

  window.location.href = "home.html";

}


// ============================================================
// GO TO LOGIN
// ============================================================

function redirectToLogin() {

  window.location.href =
    "index.html";

}


// ============================================================
// STATUS MESSAGE
// ============================================================

function showStatus(message) {

  if (!statusMessage) {

    return;

  }


  statusMessage.textContent =
    message;

}


// ============================================================
// LOADING
// ============================================================

function showLoading(message) {

  if (loadingText) {

    loadingText.textContent =
      message;

  }


  if (loadingOverlay) {

    loadingOverlay.style.display =
      "flex";

  }

}


function hideLoading() {

  if (loadingOverlay) {

    loadingOverlay.style.display =
      "none";

  }

}


// ============================================================
// DISABLE ROLE CARDS
// ============================================================

function setCardsDisabled(disabled) {

  if (freelancerCard) {

    freelancerCard.style.pointerEvents =
      disabled ? "none" : "auto";

    freelancerCard.style.opacity =
      disabled ? "0.6" : "1";

  }


  if (clientCard) {

    clientCard.style.pointerEvents =
      disabled ? "none" : "auto";

    clientCard.style.opacity =
      disabled ? "0.6" : "1";

  }

}
