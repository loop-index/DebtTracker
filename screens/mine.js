import { myView, newCard } from "../styles/templates.js";
import { checkToken } from "../utils.js"
import { FS, doc, getDoc, setDoc, addDoc, updateDoc, collection, arrayRemove, arrayUnion } from "../firebase.js";

const app = $("#content");
const curUserRef = doc(FS, "users", localStorage.getItem("uid"));

export function loadMyView(){
    checkToken();
    console.log('Now on first page');
    app.html(myView);
    loadEntries();

    $("#newEntryForm").submit(function(e){
        e.preventDefault();
        let title = $(this).children()[0].value;
        let amount = $(this).children()[1].value;
        let date = new Date().toLocaleDateString();
        addNewEntry(title, amount, date);
    });

    $("#signOut").on("click", function(e){
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("uid");
        router.navigate("/login");
    });
}

async function addNewEntry(title, amount, date){
    app.append(newCard(title, date, amount));

    const docRef = await addDoc(collection(FS, "transactions"), {
        from: localStorage.getItem("uid"),
        to: "test",
        title: title,
        amount: amount,
        date: date,
    });
    console.log("Document written with ID: ", docRef.id);
    
    await updateDoc(curUserRef, {
        outgoingTransactions: arrayUnion(docRef.id),
    });
}

async function loadEntries(){
    // const docSnap = await getDoc(curUserRef);
    // if (docSnap.exists()) {
    //     let transactions = getDocs(doc(FS, "transactions", docSnap.data()["outgoingTransactions"][0]));
    //     let outgoing = docSnap.data()["outgoingTransactions"];
    //     outgoing.forEach(transaction => {
            
    //     });
    // } else {
    //     // doc.data() will be undefined in this case
    //     console.log("No such document!");
    // }

    const q = query(collection(db, "cities"), where("capital", "==", true));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    });
}