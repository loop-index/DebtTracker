import { myView } from "../styles/templates.js";
import { checkToken, onAuthStateChanged, signOut } from "../screens/auth.js"
import { autocomplete, validateInputs } from "../utils.js";
import { AU, FS, db } from "../firebase.js";
import { newCard, cardExtension, attachControls } from "../styles/components.js";

const app = $("#content");
let entries;
let uid;
let curUserRef;
let outgoingList = [];
let perPage = 7;

export async function loadMyView(){
    
    await onAuthStateChanged(AU, async (user) => {
        if (user) {
            uid = user.uid;
            
            console.log('Now on first page');
            curUserRef = FS.doc(db, "users", uid);
            app.html(myView);
            entries = $("#entries");
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
                signOut(AU).then(() => {
                    console.log("Signed out");
                    router.navigate("/login");
                });
            });
        }
        else {
            router.navigate("/login");
            return;
        }
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

async function addNewEntry(title, amount, date, to){
    const docRef = await FS.addDoc(FS.collection(db, "transactions"), {
        from: uid,
        to: to,
        title: title,
        amount: amount,
        date: date,
    });
    console.log("Document written with ID: ", docRef.id);
    
    await FS.updateDoc(curUserRef, {
        outgoingTransactions: FS.arrayUnion(docRef.id),
    });

    await toRecipient(await getRecipientId(to), docRef.id);

    addNewCard(docRef.id, title, amount, date, to);
    $(entries).children().last().remove();
}


function addNewCard(id, title, amount, date, to, append=false){
    let card;
    if (!append){
        card = $(newCard(id, title, date, amount, to)).prependTo($(entries));
    } else {
        card = $(newCard(id, title, date, amount, to)).appendTo($(entries));
    }
    $(card).on("click", function(){
        if ($(this).hasClass("card-active")) return;

        $(this).siblings().removeClass("card-active");
        $(this).addClass("card-active");
        $(this).siblings().find(".card-controls").remove();
        $(this).siblings().find(".card-form").remove();
        const controls = $(cardExtension()).appendTo($(this));
        // controls.slideDown("fast");
        attachControls($(this), controls);
    });

    card.fadeIn();
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
    outgoingList = uDoc.data()['outgoingTransactions'];
    const page = outgoingList.slice(-perPage);
    const entries = [];

    for (const docId of page){
        let doc = await FS.getDoc(FS.doc(db, "transactions", docId));
        entries.push(doc);
    }
    
    console.timeEnd("loading from firestore");

    for (const doc of entries){
        addNewCard(doc.id, doc.data()['title'], doc.data()['amount'],
            doc.data()['date'], doc.data()['to']);
    }

    $(document).on("removeEntry", async function(e, id){
        try {
            let removed = outgoingList.indexOf(id);
            outgoingList.splice(removed, 1);
            let docId = outgoingList[outgoingList.length - 1 - perPage];
            console.log(docId);
            let doc = await FS.getDoc(FS.doc(db, "transactions", docId));
            addNewCard(docId, doc.data()['title'], doc.data()['amount'],
                doc.data()['date'], doc.data()['to'], true);
        } catch (err) {
            console.log(err);
        }
});

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