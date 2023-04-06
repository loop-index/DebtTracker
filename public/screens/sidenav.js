import { navView } from "../styles/navTemplates.js";
const nav = $("#nav-side");

import { db, FS } from "../firebase.js";

export function loadNav(){
    nav.html(navView);
    $("#nav-side").on("click", "a", function(e){
        e.preventDefault();
        router.navigate($(this).attr("href"));
    });

    $("#test").one("click", function(e){
        e.preventDefault();
        // loop through all transactions
        const allDocs = FS.collection(db, "transactions");
        FS.getDocs(allDocs).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                FS.updateDoc(doc.ref, {
                    status: "",
                });
                console.log(doc.id);
            });
        });
    });
}
