import { formatter } from '../utils.js'
import { FS, db, AU } from '../firebase.js'

export const matchDropdown = `
    <div class="list-group" id="matches">
    </div>
`;


export function newCard(title, date, amount, to, image) {
    return `
    <div class="card entry" style="display:none;">
        <div class="card-body">
            <div class="row">
                <div class="col-auto d-flex align-items-center">
                    <img class="rounded-circle" src=${image} style="max-width: 48px; width: 100%;">
                </div>
                <div class="col-auto">
                    <h5 class="entry-title">${title}</h5>
                    <p class="entry-date text-muted"><small>Since ${date}</small></p>
                </div>
                <div class="col text-end">
                    <h1 class="entry-amount">${formatter.format(amount)}</h1>
                </div>
            </div>
            <p class="text-end m-0 text-muted"><small>${to}</small></p>
        </div>
    </div> 
    `
}

export function infoCard(name, email) {
    return `
    <div class="card info-card">
        <div class="card-body">
            <div class="row">
                <div class="col-auto d-flex align-items-center">
                    <img class="img-resonsive rounded-circle" src="https://api.dicebear.com/5.x/big-smile/svg?size=48&backgroundColor=fbc324&seed=${email}">
                </div>
                <div class="col">
                    <h5>${name}</h5>
                    <p class="text-muted"><small>${email}</small></p>
                </div>
            </div>
        </div>
    </div>

    `
}

export function outCardExtension(self){
    if (self) return `
    <div class="mb-3 me-3 ms-3 text-end card-controls">
        <button class="btn btn-outline-primary" id="cardHistBtn">
            <span class="col overflow-hidden">
                <i class="col-auto fa-solid fa-clock-rotate-left"></i>
            </span>
        </button>
        <button class="btn btn-outline-success" id="cardPayBtn">
            <span class="col overflow-hidden">
                <i class="col-auto fa-solid fa-credit-card"></i>
                Pay
            </span>
        </button>
        <button class="btn btn-outline-warning" id="cardUpdateBtn">
            <span class="col overflow-hidden">
                <i class="col-auto fa-solid fa-pen-to-square"></i>
                Edit
            </span>
        </button>
        <div class="btn-group">
            <button class="btn btn-outline-danger" id="cardDelBtn">
                <span class="col overflow-hidden">
                    <i class="col-auto fa-solid fa-trash"></i>
                    Delete
                </span>
            </button>
        </div>
    </div>
    `;

    return `
    <div class="mb-3 me-3 ms-3 text-end card-controls">
        <button class="btn btn-outline-primary" id="cardHistBtn">
            <span class="col overflow-hidden">
                <i class="col-auto fa-solid fa-clock-rotate-left"></i>
            </span>
        </button>
        <button class="btn btn-outline-success" id="cardPayBtn">
            <span class="col overflow-hidden">
                <i class="col-auto fa-solid fa-credit-card"></i>
                Pay
            </span>
        </button>
    </div>
    `
}

export function inCardExtension(self){
    if (self) return `
    <div class="mb-3 me-3 ms-3 text-end card-controls">
        <button class="btn btn-outline-primary" id="cardHistBtn">
            <span class="col overflow-hidden">
                <i class="col-auto fa-solid fa-clock-rotate-left"></i>
            </span>
        </button>
        <button class="btn btn-outline-warning" id="cardUpdateBtn">
            <span class="col overflow-hidden">
                <i class="col-auto fa-solid fa-pen-to-square"></i>
                Edit
            </span>
        </button>
        <div class="btn-group">
            <button class="btn btn-outline-danger" id="cardDelBtn">
                <span class="col overflow-hidden">
                    <i class="col-auto fa-solid fa-trash"></i>
                    Delete
                </span>
            </button>
        </div>
    </div>
    `;

    return `
    <div class="mb-3 me-3 ms-3 text-end card-controls">
        <button class="btn btn-outline-primary" id="cardHistBtn">
            <span class="col overflow-hidden">
                <i class="col-auto fa-solid fa-clock-rotate-left"></i>
            </span>
        </button>
    </div>
    `
}

export function attachControls(card, controls, id){
    const buttons = $(controls).children();

    // History
    $("#cardHistBtn").on("click", async function (e) {
        e.preventDefault();
        $(card).find(".card-form").remove();
        let changes = "";
        await FS.getDoc(FS.doc(db, "transactions", id)).then((doc) => {
            if (doc.exists) {
                const changeList = doc.data().history;
                for (let i = 0; i < changeList.length; i++) {
                    changes += `<small>${changeList[i]}</small><br>`
                }
                changes = `<div class="card-form mb-2 text-start fw-light">${changes}</div>`;
                $(controls).prepend($(changes));
            }
        });
    });

    // Pay
    $("#cardPayBtn").on("click", function (e) {
        e.preventDefault();
        $(card).find(".card-form").remove();
        const form = $(`
        <div class="input-group mb-2 card-form">
            <input type="text" class="form-control" placeholder="$10.00">
            <button class="btn btn-outline-success">Pay</button>
            <button class="btn btn-outline-success">full</button>
        </div>
        `).prependTo($(controls));

        $($(form).children()[1]).on("click", async function (e) {
            e.preventDefault();
            let amount = $(card).find(".entry-amount").text().replace("$", "");
            let amountPaid = $(form).find("input").val();
            if (amountPaid === "") {
                amountPaid = 0;
            }
            $(card).find(".entry-amount").text(formatter.format(amount - $(form).find("input").val()));

            // Updating the database
            const entryRef = await FS.doc(db, "transactions", id);
            await FS.updateDoc(entryRef, {
                amount: amount - amountPaid,
                history: FS.arrayUnion(`${new Date().toLocaleString()}: Paid ${formatter.format(amountPaid)}, ${formatter.format(amount-amountPaid)} remained.`)
            });
            $(form).remove();
        });

        $($(form).children()[2]).on("click", function (e) {
            $($(form).children()[0]).val($(card).find(".entry-amount").text().replace("$", ""));
        });
    });

    // Edit
    $("#cardUpdateBtn").on("click", function (e) {
        e.preventDefault();
        $(card).find(".card-form").remove();
        const form = $(`
        <div class="input-group mb-2 card-form">
            <input type="text" class="form-control" placeholder="New title">
            <input type="text" class="form-control" placeholder="New amount">
            <button class="btn btn-outline-warning">Update</button>
        </div>
        `).prependTo($(controls));

        $($(form).find("button")).on("click", async function (e) {
            e.preventDefault();

            let title = $(form).find("input")[0].value;
            let amount = $(form).find("input")[1].value;

            if (title === "" && amount === "") {
                return;
            }

            let changes = "Changed ";

            if (title !== "") {
                changes += "title from " + $(card).find(".entry-title").text() + " to " + title;
                $(card).find(".entry-title").text(title);
            }
            if (amount !== "") {
                //add comma if title was changed
                if (title !== "") {
                    changes += ", ";
                }
                changes += "amount from " + formatter.format($(card).find(".entry-amount").text().replace("$", "")) + " to " + formatter.format(amount);
                $(card).find(".entry-amount").text(formatter.format(amount));
            }

            const entryRef = await FS.doc(db, "transactions", id);
            await FS.updateDoc(entryRef, {
                title: $(card).find(".entry-title").text(),
                amount: $(card).find(".entry-amount").text().replace("$", ""),
                history: FS.arrayUnion(`${new Date().toLocaleString()}: ${changes}.`)
            });

            $(form).remove();
        });
    });

    // Delete
    $($("#cardDelBtn").children()[0]).on("click", function (e) {
        e.preventDefault();
        $(card).find(".card-form").remove();
        // Making sure the user wants to delete the card
        const form = $(`
        <button class="btn btn-danger card-form">
            Sure?
        </button>
        `).appendTo($(this).parent());

        $(form).on("click", async function (e) {
            e.preventDefault();
            const entryRef = await FS.doc(db, "transactions", id);
            const userId = await AU.currentUser.uid;
            const userRef = await FS.doc(db, "users", userId);

            // Removing the entry from the user's list
            await FS.updateDoc(userRef, {
                outgoingTransactions: FS.arrayRemove(id),
            });

            const receiverId = await FS.getDoc(entryRef).then((doc) => {
                return doc.data()['to'];
            });
            if (receiverId[0] != '#') {
                const receiverRef = await FS.doc(db, "users", receiverId);
                await FS.updateDoc(receiverRef, {
                    incomingTransactions: FS.arrayRemove(id),
                });
            }
            $(card).remove();

            console.log("Deleting entry " + id);
            $(document).trigger("removeEntry", [id]);
            
            await FS.deleteDoc(entryRef);
        });
    });
}