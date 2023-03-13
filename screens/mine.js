import { myView, newCard } from "../styles/templates.js";

const app = $("#content");

export function loadMyView(){
    console.log('Now on first page');
    app.html(myView);
    app.append(newCard("Rent", "12/12/2019", "$100.00"));
    app.append(newCard("Food", "01/15/2020", "$15.67"));

    // $("#newEntryBtn").click(function(){
    //     app.append(newCard("Rent", "12/12/2019", "$100.00"));
    // });
}