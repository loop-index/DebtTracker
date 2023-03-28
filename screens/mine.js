// import { outView } from "../styles/templates.js";
// import { getRecipientIdByName, onAuthStateChanged, signOut } from "../screens/auth.js"
// import { autocomplete, validateInputs } from "../utils.js";
// import { AU, FS, db } from "../firebase.js";
// import { newCard, cardExtension, infoCard, attachControls } from "../styles/components.js";

// const app = $("#content");
// let entries;
// let uid;
// let curUserRef;
// let perPage = 7;

// // User data
// let outgoingList = [];
// let knownUsers = {};

// export async function loadMyView(){
    
//     await onAuthStateChanged(AU, async (user) => {
//         if (user) {
//             uid = user.uid;
            
//             console.log('Now on first page');
//             curUserRef = FS.doc(db, "users", uid);
//             app.html(outView);
//             entries = $("#entries");

//             $(".dropdown-menu").on("click.bs.dropdown", function(e){
//                 e.stopPropagation();
//             });

//             $("#newEntryForm").submit(async function(e){
//                 e.preventDefault();
//                 let title = $(this).children()[0].value;
//                 let amount = $(this).children()[1].value;
//                 let recipientName = $("#recipientName").val();
//                 let date = new Date().toLocaleDateString();
//                 let recipientEmail = $("#recipientEmail").val();
//                 let recipientImage = $("#recipientImage").val();
                
//                 if (validateInputs(title, amount, recipientName)){
//                     let recipientId = await validateUser(recipientName, recipientEmail, recipientImage);
//                     console.log(recipientId);
//                     if (recipientId) {
                        
//                         addNewEntry(title, amount, date, recipientId);
    
//                         $(this).children()[0].value = "";
//                         $(this).children()[1].value = "";
//                         $("#recipientName").val("");
//                         $("#recipientEmail").val("");
//                         $("#recipientImage").val("");
        
//                         $(this).siblings(".dropdown-toggle").trigger('click.bs.dropdown');
//                     }
//                 }
//             });

//             $("#newEntryDropdown").on("hide.bs.dropdown", function(){
//                 $("#matches").remove();
//             });

//             $("#newEntryForm").on("click", function(e){
//                 // if not clicked on matches and not on input
//                 if ($(e.target).closest("#matches").length == 0
//                     && $(e.target).closest("#recipientName").length == 0){
//                     $("#matches").remove();
//                 }
//             });

//             $("#newUser").on("click", function(e){
//                 $("#newUserForm").toggleClass("d-none");
//             });

//             $("#signOut").on("click", function(e){
//                 e.preventDefault();
//                 localStorage.removeItem("token");
//                 localStorage.removeItem("uid");
//                 signOut(AU).then(() => {
//                     console.log("Signed out");
//                     router.navigate("/login");
//                 });
//             });

//             await loadEntries();
//             await attachInputAutocomplete("#recipientName");

//             // Async calls

//             $(document).on("removeEntry", async function(e, id){
//                 try {
//                     let removed = outgoingList.indexOf(id);
//                     outgoingList.splice(removed, 1);
//                     console.log(removed);
//                     let docId = outgoingList[outgoingList.length - perPage];
//                     console.log(docId);
//                     if (docId){
//                         let doc = await FS.getDoc(FS.doc(db, "transactions", docId));
//                         addNewCard(docId, doc.data()['title'], doc.data()['amount'],
//                             doc.data()['date'], doc.data()['to'], true);
//                     }
//                 } catch (err) {
//                     console.log(err);
//                 }
//             });
//         }
//         else {
//             router.navigate("/login");
//             return;
//         }
//     });
// }

// async function attachInputAutocomplete(input){
//     async function getKnownUsers(){
//         let users = [];
//         for (let id in knownUsers){
//             users.push(knownUsers[id].name);
//         }
//         return users;
//     }

//     autocomplete($(input), getKnownUsers);
// }

// async function validateUser(name, email, image){
//     // Check if name is empty
//     for (let id in knownUsers){
//         if (knownUsers[id].name === name){
//             return id;
//         }
//     }

//     // If name not found then it's a new recipient
//     if (email === ""){
//         var id = "#" + Date.now();
//     }
//     else {
//         console.log("Searching for user with email: " + email)
//         const q = FS.query(FS.collection(db, "users"), 
//             FS.where("email", "==", email));
//         const querySnapshot = await FS.getDocs(q);
//         if (querySnapshot.empty){
//             alert ("No user found with this email");
//             return null;
//         }
//         for (const doc of querySnapshot.docs){
//             var id = doc.id;
//             break;
//         }
//     }

//     image = image === "" ? `https://api.dicebear.com/5.x/big-smile/svg?size=48&backgroundColor=fbc324&seed=${id.slice(1)}` : image;

//     knownUsers[id] = {
//         name: name,
//         email: email,
//         image: image,
//     };
//     await FS.updateDoc(curUserRef, {
//         [`knownUsers.${id}`]: {
//             name: name,
//             email: email,
//             image: image,
//         },
//     });
//     return id;
// }

// async function addNewEntry(title, amount, date, id){
//     let history = [new Date().toLocaleString() + ": " + "Created."];

//     const docRef = await FS.addDoc(FS.collection(db, "transactions"), {
//         from: uid,
//         to: id,
//         title: title,
//         amount: amount,
//         date: date,
//         history: history
//     });
    
//     addNewCard(docRef.id, title, amount, date, id);
//     outgoingList.push(docRef.id);

//     // If there are more than 7 entries, remove the last one
//     if ($(entries).children().length > perPage){
//         $(entries).children().last().remove();
//     }

//     console.log("Document written with ID: ", docRef.id);
    
//     await FS.updateDoc(curUserRef, {
//         outgoingTransactions: FS.arrayUnion(docRef.id),
//     });

//     await toRecipient(id, docRef.id);
// }


// async function addNewCard(id, title, amount, date, to, append=false){
//     let card;
//     let name = knownUsers[to].name;
//     let image = knownUsers[to].image;

//     if (!append){
//         card = $(newCard(title, date, amount, name, image)).prependTo($(entries));
//     } else {
//         card = $(newCard(title, date, amount, name, image)).appendTo($(entries));
//     }
//     $(card).on("click", function(){
//         if ($(this).hasClass("card-active")) return;
        
//         $(".card-active").find(".card-controls").remove();
//         $(".card-active").find(".card-form").remove();
//         $(".card-active").removeClass("card-active");
//         $(this).addClass("card-active");

//         const controls = $(cardExtension()).appendTo($(this));
//         // controls.slideDown("fast");
//         attachControls($(this), controls, id);
//     });
//     card.fadeIn();
//     // let info;
//     // const img = $(card).find("img");
//     // const receiverId = await getRecipientId(to);
//     //
//     // if (receiverId == null){
//     //     card.fadeIn();
//     //     return;
//     // } 
//     // else {

//     //     const receiverRef = await FS.doc(db, "users", receiverId);
//     //     const receiverDoc = await FS.getDoc(receiverRef);
//     //     const receiverName = await receiverDoc.data()['name'];

//     //     $(img).on("mouseenter", async function(e){
//     //         e.preventDefault();

//     //         info = $(infoCard(receiverName, to)).appendTo($(card).parent());
//     //         $(info).css({
//     //             "top": e.clientY,
//     //             "left": e.clientX,
//     //         })
//     //         info.fadeIn();
//     //     });
//     //     $(img).on("mouseleave", function(e){
//     //         e.preventDefault();
//     //         info.fadeOut();
//     //         info.remove();
//     //     });
//     //     $(img).on("mousemove", function(e){
//     //         e.preventDefault();
//     //         $(info).css({
//     //             "top": e.clientY,
//     //             "left": e.clientX,
//     //         })
//     //     });

//     //     card.fadeIn();

//     // }
// }


// async function loadEntries(){
//     console.time("loading from firestore");

//     // let curUser = localStorage.getItem("uid");
//     // const q = FS.query(FS.collection(db, "transactions"), FS.where("from", "==", curUser));

//     // const querySnapshot = await FS.getDocs(q);
//     // querySnapshot.forEach((doc) => {
//     //     addNewEntry(doc.data()['title'], doc.data()['amount'], 
//     //         doc.data()['date'], doc.data()['to'], false);
//     // });

//     const uDoc = await FS.getDoc(curUserRef);
//     outgoingList = uDoc.data()['outgoingTransactions'];
//     knownUsers = uDoc.data()['knownUsers'];

//     const page = outgoingList.slice(-perPage);
//     const entries = [];

//     for (const docId of page){
//         let doc = await FS.getDoc(FS.doc(db, "transactions", docId));
//         entries.push(doc);
//     }
    
//     console.timeEnd("loading from firestore");

//     for (const doc of entries){
//         addNewCard(doc.id, doc.data()['title'], doc.data()['amount'],
//             doc.data()['date'], doc.data()['to']);
//     }
// }

// async function toRecipient(receiverId, docId){
//     if (!receiverId || receiverId[0] == "#") return;
//     const rDoc = await FS.getDoc(FS.doc(db, "users", receiverId));
//     await FS.updateDoc(rDoc.ref, {
//         incomingTransactions: FS.arrayUnion(docId),
//     });
// }

