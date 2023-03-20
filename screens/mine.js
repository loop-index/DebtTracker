import { myView, newCard } from "../styles/templates.js";
import { checkToken, autocomplete, validateInputs } from "../utils.js"
import { FS, db } from "../firebase.js";

const app = $("#content");
let curUserRef = FS.doc(db, "users", localStorage.getItem("uid"));

export async function loadMyView(){
    checkToken();
    console.log('Now on first page');
    curUserRef = FS.doc(db, "users", localStorage.getItem("uid"));
    app.html(myView);
    loadEntries();

    $(".dropdown-menu").on("click.bs.dropdown", function(e){
        e.stopPropagation();
    });

    $("#newEntryForm").submit(function(e){
        e.preventDefault();
        let title = $(this).children()[0].value;
        let amount = $(this).children()[1].value;
        let to = $(this).children()[2].value;
        let date = new Date().toLocaleDateString();
        if (validateInputs(title, amount, to)){
            addNewEntry(title, amount, date, to);
        }
        $(this).children()[0].value = "";
        $(this).children()[1].value = "";
        $(this).children()[2].value = "";

        $(this).siblings(".dropdown-toggle").trigger('click.bs.dropdown');
    });

    await attachInputAutocomplete("#recipientInput");

    $("#signOut").on("click", function(e){
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("uid");
        router.navigate("/login");
    });
}

async function attachInputAutocomplete(input){
    async function getKnownUsers(){
        const uDoc = await FS.getDoc(curUserRef);
        const knownUsers = Object.keys(uDoc.data()['knownUsers']);
        return knownUsers;
    }

    autocomplete($(input), getKnownUsers);
}

async function addNewEntry(title, amount, date, to, save=true){
    app.append(newCard(title, date, amount));

    if (!save) return;

    const docRef = await FS.addDoc(FS.collection(db, "transactions"), {
        from: localStorage.getItem("uid"),
        to: to,
        title: title,
        amount: amount,
        date: date,
    });
    console.log("Document written with ID: ", docRef.id);
    console.log(getRecipientId(to));
    
    await FS.updateDoc(curUserRef, {
        outgoingTransactions: FS.arrayUnion(docRef.id),
    });

    await toRecipient(await getRecipientId(to), docRef.id);
}

async function loadEntries(){
    console.time("loading from firestore");

    // let curUser = localStorage.getItem("uid");
    // const q = FS.query(FS.collection(db, "transactions"), FS.where("from", "==", curUser));

    // const querySnapshot = await FS.getDocs(q);
    // querySnapshot.forEach((doc) => {
    //     addNewEntry(doc.data()['title'], doc.data()['amount'], 
    //         doc.data()['date'], doc.data()['to'], false);
    // });

    const uDoc = await FS.getDoc(curUserRef);
    const outgoingList = uDoc.data()['outgoingTransactions'];

    for (const docId of outgoingList){
        let doc = await FS.getDoc(FS.doc(db, "transactions", docId));
        addNewEntry(doc.data()['title'], doc.data()['amount'], 
            doc.data()['date'], doc.data()['to'], false);
    }
    
    console.timeEnd("loading from firestore");
}

async function toRecipient(receiverId, docId){
    if (!receiverId) return;
    const rDoc = await FS.getDoc(FS.doc(db, "users", receiverId));
    await FS.updateDoc(rDoc.ref, {
        incomingTransactions: FS.arrayUnion(docId),
    });
}

async function getRecipientId(recipientMail){
    const uDoc = await FS.getDoc(curUserRef);
    let knownUsers = uDoc.data()['knownUsers'];

    if (knownUsers){
        if (knownUsers[recipientMail]){
            return knownUsers[recipientMail];
        }
    } else {
        knownUsers = {};
    }

    const q = FS.query(FS.collection(db, "users"), 
        FS.where("email", "==", recipientMail));
    const querySnapshot = await FS.getDocs(q);
    if (querySnapshot.empty){
        knownUsers[recipientMail] = "";
        await FS.updateDoc(curUserRef, {
            knownUsers: knownUsers,
        });
        return null;
    }
    for (const doc of querySnapshot.docs){
        knownUsers[recipientMail] = doc.id;
        await FS.updateDoc(curUserRef, {
            knownUsers: knownUsers,
        });

        return doc.id;
    }
}