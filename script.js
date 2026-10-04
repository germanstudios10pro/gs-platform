/* =========================================================
   GS PLATFORM — AUTHENTICATION & APP LOGIC
   ========================================================= */


/* =========================================================
   1. SUPABASE CONFIGURATION
   =========================================================

   Replace ONLY these two values with your Supabase project
   URL and your public/publishable (anon) key.

   NEVER put your Supabase service_role key here.
   ========================================================= */

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY";


/* Create Supabase client */

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);


/* =========================================================
   2. ELEMENTS
   ========================================================= */

const authOverlay = document.getElementById("authOverlay");

const getStartedButton =
  document.getElementById("getStartedButton");

const heroLoginButton =
  document.getElementById("heroLoginButton");

const topLoginButton =
  document.getElementById("topLoginButton");

const closeAuthButton =
  document.getElementById("closeAuthButton");

const googleButton =
  document.getElementById("googleButton");

const emailAuthForm =
  document.getElementById("emailAuthForm");

const emailSubmitButton =
  document.getElementById("emailSubmitButton");

const authMessage =
  document.getElementById("authMessage");

const authSwitchButton =
  document.getElementById("authSwitchButton");

const authSwitchText =
  document.getElementById("authSwitchText");

const authTitle =
  document.getElementById("authTitle");

const authSubtitle =
  document.getElementById("authSubtitle");

const forgotPasswordButton =
  document.getElementById("forgotPasswordButton");

const togglePassword =
  document.getElementById("togglePassword");

const passwordInput =
  document.getElementById("password");

const emailInput =
  document.getElementById("email");

const rotatingWord =
  document.getElementById("rotatingWord");

const rotatingMessage =
  document.getElementById("rotatingMessage");

const currentYear =
  document.getElementById("currentYear");


/* =========================================================
   3. APPLICATION STATE
   ========================================================= */

let authMode = "login";


/* =========================================================
   4. CURRENT YEAR
   ========================================================= */

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}


/* =========================================================
   5. OPEN AUTHENTICATION WINDOW
   ========================================================= */

function openAuth(mode = "login") {

  authMode = mode;

  updateAuthInterface();

  authOverlay.classList.add("active");

  authOverlay.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add("auth-open");

  setTimeout(() => {

    if (emailInput) {
      emailInput.focus();
    }

  }, 250);
}


/* =========================================================
   6. CLOSE AUTHENTICATION WINDOW
   ========================================================= */

function closeAuth() {

  authOverlay.classList.remove("active");

  authOverlay.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove("auth-open");

  clearAuthMessage();
}


/* =========================================================
   7. UPDATE LOGIN / SIGNUP INTERFACE
   ========================================================= */

function updateAuthInterface() {

  if (authMode === "signup") {

    authTitle.textContent =
      "Create your GS account";

    authSubtitle.textContent =
      "Join GS Platform and start building your future.";

    emailSubmitButton.textContent =
      "Create account";

    authSwitchText.textContent =
      "Already have an account?";

    authSwitchButton.textContent =
      "Log in";

  } else {

    authTitle.textContent =
      "Welcome to GS";

    authSubtitle.textContent =
      "Sign in to continue to GS Platform.";

    emailSubmitButton.textContent =
      "Continue";

    authSwitchText.textContent =
      "Don't have an account?";

    authSwitchButton.textContent =
      "Create account";
  }
}


/* =========================================================
   8. AUTH MESSAGE
   ========================================================= */

function showAuthMessage(message, type = "info") {

  authMessage.textContent = message;

  authMessage.className =
    "auth-message " + type;
}


function clearAuthMessage() {

  authMessage.textContent = "";

  authMessage.className =
    "auth-message";
}


/* =========================================================
   9. GET STARTED
   ========================================================= */

if (getStartedButton) {

  getStartedButton.addEventListener(
    "click",
    () => {

      openAuth("signup");

    }
  );
}


/* =========================================================
   10. LOGIN BUTTONS
   ========================================================= */

if (heroLoginButton) {

  heroLoginButton.addEventListener(
    "click",
    () => {

      openAuth("login");

    }
  );
}


if (topLoginButton) {

  topLoginButton.addEventListener(
    "click",
    () => {

      openAuth("login");

    }
  );
}


/* =========================================================
   11. CLOSE AUTH
   ========================================================= */

if (closeAuthButton) {

  closeAuthButton.addEventListener(
    "click",
    closeAuth
  );
}


/* Close when clicking outside the panel */

if (authOverlay) {

  authOverlay.addEventListener(
    "click",
    (event) => {

      if (event.target === authOverlay) {

        closeAuth();

      }

    }
  );
}


/* Close with Escape */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      authOverlay.classList.contains("active")
    ) {

      closeAuth();

    }

  }
);


/* =========================================================
   12. SWITCH LOGIN / SIGNUP
   ========================================================= */

if (authSwitchButton) {

  authSwitchButton.addEventListener(
    "click",
    () => {

      if (authMode === "login") {

        authMode = "signup";

      } else {

        authMode = "login";

      }

      clearAuthMessage();

      updateAuthInterface();

    }
  );
}


/* =========================================================
   13. GOOGLE AUTHENTICATION
   ========================================================= */

if (googleButton) {

  googleButton.addEventListener(
    "click",
    async () => {

      clearAuthMessage();

      googleButton.disabled = true;

      googleButton.classList.add("loading");

      googleButton.querySelector("span:last-child")
        .textContent = "Connecting to Google...";


      try {

        const {
          error
        } = await supabaseClient.auth.signInWithOAuth({

          provider: "google",

          options: {

            redirectTo:
              window.location.origin

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
          "Unable to connect to Google. Please try again.",
          "error"
        );

        googleButton.disabled = false;

        googleButton.classList.remove("loading");

        googleButton.querySelector("span:last-child")
          .textContent = "Continue with Google";

      }

    }
  );
}


/* =========================================================
   14. EMAIL LOGIN / SIGNUP
   ========================================================= */

if (emailAuthForm) {

  emailAuthForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      clearAuthMessage();

      const email =
        emailInput.value.trim();

      const password =
        passwordInput.value;


      if (!email || !password) {

        showAuthMessage(
          "Please enter your email and password.",
          "error"
        );

        return;

      }


      emailSubmitButton.disabled = true;

      emailSubmitButton.textContent =
        authMode === "signup"
          ? "Creating account..."
          : "Signing in...";


      try {

        let result;


        /* -------------------------
           CREATE ACCOUNT
           ------------------------- */

        if (authMode === "signup") {

          result =
            await supabaseClient.auth.signUp({

              email: email,

              password: password,

              options: {

                emailRedirectTo:
                  window.location.origin

              }

            });

        }


        /* -------------------------
           LOGIN
           ------------------------- */

        else {

          result =
            await supabaseClient.auth.signInWithPassword({

              email: email,

              password: password

            });

        }


        if (result.error) {

          throw result.error;

        }


        /* -------------------------
           SUCCESS
           ------------------------- */

        if (authMode === "signup") {

          if (
            result.data.user &&
            !result.data.session
          ) {

            showAuthMessage(
              "Account created. Please check your email to confirm your account.",
              "success"
            );

          } else {

            showAuthMessage(
              "Your GS account has been created successfully.",
              "success"
            );

          }

        } else {

          showAuthMessage(
            "Login successful. Welcome back to GS Platform.",
            "success"
          );

        }


      } catch (error) {

        console.error(
          "Email authentication error:",
          error
        );

        showAuthMessage(
          getFriendlyAuthError(error),
          "error"
        );

      } finally {

        emailSubmitButton.disabled = false;

        updateAuthInterface();

      }

    }
  );
}


/* =========================================================
   15. FRIENDLY AUTH ERRORS
   ========================================================= */

function getFriendlyAuthError(error) {

  const message =
    (error.message || "").toLowerCase();


  if (
    message.includes("invalid login credentials")
  ) {

    return "The email or password is incorrect.";

  }


  if (
    message.includes("email not confirmed")
  ) {

    return "Please confirm your email before logging in.";

  }


  if (
    message.includes("user already registered")
  ) {

    return "An account with this email already exists. Try logging in.";

  }


  if (
    message.includes("password should be at least")
  ) {

    return "Your password is too short. Please use a stronger password.";

  }


  if (
    message.includes("rate limit")
  ) {

    return "Too many attempts. Please wait a little and try again.";

  }


  return (
    error.message ||
    "Something went wrong. Please try again."
  );
}


/* =========================================================
   16. SHOW / HIDE PASSWORD
   ========================================================= */

if (togglePassword) {

  togglePassword.addEventListener(
    "click",
    () => {

      if (
        passwordInput.type === "password"
      ) {

        passwordInput.type = "text";

        togglePassword.textContent =
          "Hide";

      } else {

        passwordInput.type = "password";

        togglePassword.textContent =
          "Show";

      }

    }
  );
}


/* =========================================================
   17. FORGOT PASSWORD
   ========================================================= */

if (forgotPasswordButton) {

  forgotPasswordButton.addEventListener(
    "click",
    async () => {

      const email =
        emailInput.value.trim();


      if (!email) {

        showAuthMessage(
          "Enter your email first, then choose Forgot password.",
          "error"
        );

        emailInput.focus();

        return;

      }


      forgotPasswordButton.disabled = true;

      try {

        const {
          error
        } =
          await supabaseClient.auth
            .resetPasswordForEmail(
              email,
              {
                redirectTo:
                  `${window.location.origin}/reset-password.html`
              }
            );


        if (error) {

          throw error;

        }


        showAuthMessage(
          "Password reset instructions have been sent to your email.",
          "success"
        );


      } catch (error) {

        console.error(
          "Password reset error:",
          error
        );

        showAuthMessage(
          error.message ||
          "Unable to send password reset email.",
          "error"
        );

      } finally {

        forgotPasswordButton.disabled = false;

      }

    }
  );
}


/* =========================================================
   18. AUTH SESSION
   ========================================================= */

async function checkCurrentSession() {

  try {

    const {
      data,
      error
    } =
      await supabaseClient.auth.getSession();


    if (error) {

      throw error;

    }


    if (data.session) {

      console.log(
        "GS user is signed in:",
        data.session.user.email
      );

      /*
       * Later this is where we will send the user
       * into the actual GS Platform dashboard.
       *
       * We are NOT redirecting yet because the
       * dashboard has not been built.
       */

    }

  } catch (error) {

    console.error(
      "Session check failed:",
      error
    );

  }

}


checkCurrentSession();


/* =========================================================
   19. AUTH STATE CHANGES
   ========================================================= */

supabaseClient.auth.onAuthStateChange(
  (event, session) => {

    console.log(
      "GS Auth event:",
      event
    );


    if (event === "SIGNED_IN" && session) {

      console.log(
        "User signed in:",
        session.user.email
      );

      /*
       * Later:
       * window.location.href = "/app.html";
       *
       * We wait until the GS Platform dashboard
       * actually exists.
       */

    }


    if (event === "SIGNED_OUT") {

      console.log(
        "User signed out."
      );

    }

  }
);


/* =========================================================
   20. LOGOUT FUNCTION
   =========================================================

   We don't have a visible logout button on this first
   screen yet, but the function is ready for the app.
   ========================================================= */

async function gsLogout() {

  try {

    const {
      error
    } = await supabaseClient.auth.signOut();


    if (error) {

      throw error;

    }

    console.log(
      "GS user logged out."
    );


  } catch (error) {

    console.error(
      "Logout error:",
      error
    );

  }

}


/* Make logout available to the rest of the app */

window.gsLogout = gsLogout;


/* =========================================================
   21. ROTATING HERO CONTENT
   ========================================================= */

const heroSlides = [

  {
    word: "Your opportunity.",
    message:
      "Find work that matches what you do best."
  },

  {
    word: "Your future.",
    message:
      "Turn your skills into meaningful opportunities."
  },

  {
    word: "Your reputation.",
    message:
      "Build trust through the work you deliver."
  },

  {
    word: "Your growth.",
    message:
      "Do great work. Build your name. Go further."
  },

  {
    word: "Your platform.",
    message:
      "One place to discover, work, communicate and grow."
  }

];


let currentSlide = 0;


function changeHeroSlide() {

  if (!rotatingWord || !rotatingMessage) {
    return;
  }


  rotatingWord.classList.add(
    "changing"
  );

  rotatingMessage.classList.add(
    "changing"
  );


  setTimeout(() => {

    currentSlide =
      (currentSlide + 1) %
      heroSlides.length;


    rotatingWord.textContent =
      heroSlides[currentSlide].word;


    rotatingMessage.textContent =
      heroSlides[currentSlide].message;


    rotatingWord.classList.remove(
      "changing"
    );

    rotatingMessage.classList.remove(
      "changing"
    );

  }, 350);
}


/* Change every 4 seconds */

setInterval(
  changeHeroSlide,
  4000
);


/* =========================================================
   22. INITIAL MESSAGE
   ========================================================= */

console.log(
  "GS Platform frontend initialized."
);

console.log(
  "Authentication system ready."
)
