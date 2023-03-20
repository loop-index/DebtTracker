import { AU, FS, db } from "../firebase.js";
import { signInWithCustomToken, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js';
import { matchDropdown } from "/styles/components.js";

// Create our number formatter.
export const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export function login(email, password) {
    signInWithEmailAndPassword(AU, email, password).then((userCredential) => {
        saveCache(userCredential);

        console.log("Logged in");
        router.navigate("/");
    }).catch((error) => {
        let errorCode = error.code;
        console.log(errorCode);
        switch (errorCode) {
            case 'auth/wrong-password':
                alert('Wrong password');
                break;
            case 'auth/user-not-found':
                alert('User not found');
                break;
            default:
                alert('Something went wrong');
        }
    })
}

export function checkToken() {
    if (localStorage.getItem('token') !== null) {
        // signInWithCustomToken(AU, localStorage.getItem('token')).then((userCredential) => {
        // }).catch((error) => {
        //     let errorCode = error.code;
        //     console.log(errorCode);
        //     switch (errorCode) {
        //         default:
        //             alert('Something went wrong');
        //     }
        // })
        router.navigate("/");
        return;
    }
    router.navigate("/login");
}

export async function signup(email, password) {
    await createUserWithEmailAndPassword(AU, email, password).then((userCredential) => {
        saveCache(userCredential);
        console.log("Signed in");

        // Create user in firestore
        FS.setDoc(FS.doc(db, "users", userCredential.user.uid), {
            email: email,
            outgoingTransactions: [],
            incomingTransactions: [],
            knownUsers: {},
        });

        router.navigate("/");
    }).catch((error) => {
        let errorCode = error.code;
        console.log(errorCode);
        switch (errorCode) {
            default:
                alert('Something went wrong');
        }
    })
}

function saveCache(userCredential) {
    localStorage.setItem('token', userCredential.user.getIdToken());
    localStorage.setItem('uid', userCredential.user.uid);
}

export function autocomplete(input, arrayFn) {
    let array;
    $(input).on("focus", async function () {
        array = await arrayFn();
        $(this).parent().append(matchDropdown);
        $("#matches").offset({
            "top": $(input).offset().top + $(input).outerHeight(),
            "left": $(input).offset().left,
        })
        $("#matches").css({
            "width": $(input).outerWidth(),
        });
        match($(this));
    });

    // $(input).on("blur", function () {
    //     $("#matches").remove();
    // });

    $(input).on("input", function () {
        match($(this));
    });

    function match(input){
        let val = $(input).val();
        let matches = array.filter((item) => {
            return item.toLowerCase().startsWith(val.toLowerCase());
        });
        $("#matches").empty();
        matches.forEach((item) => {
            let option = $(`<button class="list-group-item 
                list-group-item-action">${item}</button>`)
                .appendTo("#matches");
            option.on("click", function (e) {
                e.preventDefault();
                $(input).val($(this).text());
                $("#matches").remove();
                $(input).blur();
            });
        });
    }
}

export function validateInputs(title, amount, to){
    if (title === "") {
        return false;
    }
    if (amount === "") {
        return false;
    }
    if (to === "") {
        return false;
    }
    return true;
}
