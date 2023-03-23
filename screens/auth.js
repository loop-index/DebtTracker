import { AU, FS, db } from "../firebase.js";
import { signInWithCustomToken, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } 
    from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js';

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

// export async function checkToken() {
//     if (localStorage.getItem('token') !== null) {
//         // signInWithCustomToken(AU, localStorage.getItem('token')).then((userCredential) => {
//         // }).catch((error) => {
//         //     let errorCode = error.code;
//         //     console.log(errorCode);
//         //     switch (errorCode) {
//         //         default:
//         //             alert('Something went wrong');
//         //     }
//         // })
//         let curUserRef = await FS.doc(db, "users", localStorage.getItem("uid"));
//         if (curUserRef == null) {
//             router.navigate("/login");
//         } else {
//             router.navigate("/");
//             return;
//         }
//     }
//     router.navigate("/login");
// }

export async function checkToken() {
    onAuthStateChanged(AU, async (user) => {
        if (user) {
            const uid = await user.uid;
            return uid;
        }
    });
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

export { onAuthStateChanged, signOut }
