import { myView } from "../styles/templates.js";
import { getRecipientId, onAuthStateChanged, signOut } from "../screens/auth.js"
import { autocomplete, validateInputs, validateNewUser } from "../utils.js";
import { AU, FS, db } from "../firebase.js";
import { newCard, cardExtension, infoCard, attachControls } from "../styles/components.js";

const app = $("#content");
let entries;
let uid;
let curUserRef;
let perPage = 7;

// User data
let outgoingList = [];
let knownUsers = {};

export async function loadMyView(){
    
    await onAuthStateChanged(AU, async (user) => {
        if (user) {
            uid = user.uid;
            
            console.log('Now on first page');
            curUserRef = FS.doc(db, "users", uid);
            app.html(myView);
            entries = $("#entries");

            $(".dropdown-menu").on("click.bs.dropdown", function(e){
                e.stopPropagation();
            });

            $("#newEntryForm").submit(function(e){
                e.preventDefault();
                let title = $(this).children()[0].value;
                let amount = $(this).children()[1].value;
                let recipientName = $(this).children()[2].value;
                let date = new Date().toLocaleDateString();
                let recipientEmail = $(this).children()[3].value;
                let recipientImage = $(this).children()[4].value;

                if (validateInputs(title, amount, recipientName) &&
                    validateNewUser(recipientName, recipientEmail, knownUsers)){
                    
                    addNewEntry(title, amount, date, recipientName, recipientEmail, recipientImage);

                    $(this).children()[0].value = "";
                    $(this).children()[1].value = "";
                    $(this).children()[2].value = "";
                    $(this).children()[3].value = "";
                    $(this).children()[4].value = "";
    
                    $(this).siblings(".dropdown-toggle").trigger('click.bs.dropdown');
                }
            });

            $("#newEntryDropdown").on("hide.bs.dropdown", function(){
                $("#matches").remove();
            });

            $("#newEntryForm").on("click", function(e){
                // if not clicked on matches and not on input
                if ($(e.target).closest("#matches").length == 0
                    && $(e.target).closest("#recipientInput").length == 0){
                    $("#matches").remove();
                }
            });

            $("#newUser").on("click", function(e){
                $("#newUserForm").toggleClass("d-none");
            });

            $("#signOut").on("click", function(e){
                e.preventDefault();
                localStorage.removeItem("token");
                localStorage.removeItem("uid");
                signOut(AU).then(() => {
                    console.log("Signed out");
                    router.navigate("/login");
                });
            });

            await loadEntries();
            await attachInputAutocomplete("#recipientInput");

            // Async calls

            $(document).on("removeEntry", async function(e, id){
                try {
                    let removed = outgoingList.indexOf(id);
                    outgoingList.splice(removed, 1);
                    console.log(removed);
                    let docId = outgoingList[outgoingList.length - perPage];
                    console.log(docId);
                    if (docId){
                        let doc = await FS.getDoc(FS.doc(db, "transactions", docId));
                        addNewCard(docId, doc.data()['title'], doc.data()['amount'],
                            doc.data()['date'], doc.data()['to'], true);
                    }
                } catch (err) {
                    console.log(err);
                }
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

async function addNewUser(name, email, image){
    let id = await getRecipientId(email);
    // if 
    // let entryRef = "knownUsers." + name;
    // await FS.updateDoc(curUserRef, {
    //     entryRef: {
    //         id: id,
    //         email: email,
    //         image: image,
    //     },
    // });
}

async function addNewEntry(title, amount, date, name){
    let receiverId = await getRecipientId(name);
    
    const docRef = await FS.addDoc(FS.collection(db, "transactions"), {
        from: uid,
        to: to,
        title: title,
        amount: amount,
        date: date,
    });
    
    addNewCard(docRef.id, title, amount, date, name);
    outgoingList.push(docRef.id);

    // If there are more than 7 entries, remove the last one
    if ($(entries).children().length > perPage){
        $(entries).children().last().remove();
    }

    console.log("Document written with ID: ", docRef.id);
    
    await FS.updateDoc(curUserRef, {
        outgoingTransactions: FS.arrayUnion(docRef.id),
    });

    await toRecipient(receiverId, docRef.id);
}


async function addNewCard(id, title, amount, date, to, append=false){
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
    // let info;
    // const img = $(card).find("img");
    // const receiverId = await getRecipientId(to);
    //
    // if (receiverId == null){
    //     card.fadeIn();
    //     return;
    // } 
    // else {

    //     const receiverRef = await FS.doc(db, "users", receiverId);
    //     const receiverDoc = await FS.getDoc(receiverRef);
    //     const receiverName = await receiverDoc.data()['name'];

    //     $(img).on("mouseenter", async function(e){
    //         e.preventDefault();

    //         info = $(infoCard(receiverName, to)).appendTo($(card).parent());
    //         $(info).css({
    //             "top": e.clientY,
    //             "left": e.clientX,
    //         })
    //         info.fadeIn();
    //     });
    //     $(img).on("mouseleave", function(e){
    //         e.preventDefault();
    //         info.fadeOut();
    //         info.remove();
    //     });
    //     $(img).on("mousemove", function(e){
    //         e.preventDefault();
    //         $(info).css({
    //             "top": e.clientY,
    //             "left": e.clientX,
    //         })
    //     });

    //     card.fadeIn();

    // }
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
    knownUsers = uDoc.data()['knownUsers'];

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
}

async function toRecipient(receiverId, docId){
    if (!receiverId) return;
    const rDoc = await FS.getDoc(FS.doc(db, "users", receiverId));
    await FS.updateDoc(rDoc.ref, {
        incomingTransactions: FS.arrayUnion(docId),
    });
}

