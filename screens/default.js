import { loginView, mainView, signupView } from "../styles/templates.js";
import { checkToken, login, signup } from "../screens/auth.js"

const app = $("#content");

export function loadMainView(){
    console.log('Now on main page');
    app.html(mainView);
}

export function loadLoginView(){
    app.html(loginView);

    $("#loginForm").submit(function(e){
        e.preventDefault();
        let email = $(this).find("#email").val();
        let password = $(this).find("#password").val();

        login(email, password);
    });

    $("#signup").on("click", function(e){
        e.preventDefault();
        router.navigate("/signup");
    });
}

export function loadSignupView(){
    app.html(signupView);

    $("#signupForm").submit(function(e){
        e.preventDefault();
        let email = $(this).find("#email").val();
        let password = $(this).find("#password").val();

        signup(email, password);
    });

    $("#login").on("click", function(e){
        e.preventDefault();
        router.navigate("/login");
    });
}