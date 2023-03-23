import { formatter } from '../utils.js'
import { FS, db, AU } from '../firebase.js'
import { getRecipientId } from '../screens/mine.js';

export const matchDropdown = `
    <div class="list-group" id="matches">
    </div>
`;


export function newCard(id, title, date, amount, to, name) {
    return `
    <div class="card entry" id="${id}" style="display:none;">
        <div class="card-body">
            <div class="row">
                <div class="col-auto d-flex align-items-center">
                    <img class="img-resonsive rounded-circle" src="https://api.dicebear.com/5.x/big-smile/svg?size=48&backgroundColor=fbc324&seed=${to}">
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
            <p class="d-none entry-to"><small>${to}</small></p>
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

export function cardExtension(){
    return `
    <div class="mb-3 me-3 ms-3 text-end card-controls">
        <button class="btn btn-outline-primary">
            <span class="col overflow-hidden">
                <i class="col-auto fa-solid fa-clock-rotate-left"></i>
            </span>
        </button>
        <button class="btn btn-outline-success">
            <span class="col overflow-hidden">
                <i class="col-auto fa-solid fa-credit-card"></i>
                Pay
            </span>
        </button>
        <button class="btn btn-outline-warning">
            <span class="col overflow-hidden">
                <i class="col-auto fa-solid fa-pen-to-square"></i>
                Edit
            </span>
        </button>
        <div class="btn-group">
            <button class="btn btn-outline-danger">
                <span class="col overflow-hidden">
                    <i class="col-auto fa-solid fa-trash"></i>
                    Delete
                </span>
            </button>
        </div>
    </div>
    `
}

export function attachControls(card, controls){
    const buttons = $(controls).children();

    // Pay
    $(buttons[1]).on("click", function (e) {
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
            const entryRef = await FS.doc(db, "transactions", $(card).attr("id"));
            await FS.updateDoc(entryRef, {
                amount: amount - amountPaid,
            });
            $(form).remove();
        });

        $($(form).children()[2]).on("click", function (e) {
            $($(form).children()[0]).val($(card).find(".entry-amount").text().replace("$", ""));
        });
    });

    // Edit
    $(buttons[2]).on("click", function (e) {
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

            if (title !== "") {
                $(card).find(".entry-title").text(title);
            }
            if (amount !== "") {
                $(card).find(".entry-amount").text(formatter.format(amount));
            }

            const entryRef = await FS.doc(db, "transactions", $(card).attr("id"));
            await FS.updateDoc(entryRef, {
                title: $(card).find(".entry-title").text(),
                amount: $(card).find(".entry-amount").text().replace("$", ""),
            });

            $(form).remove();
        });
    });

    // Delete
    $($(buttons[3]).children()[0]).on("click", function (e) {
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
            const entryId = $(card).attr("id");
            const entryRef = await FS.doc(db, "transactions", entryId);
            const userId = await AU.currentUser.uid;
            const userRef = await FS.doc(db, "users", userId);

            // Removing the entry from the user's list
            await FS.updateDoc(userRef, {
                outgoingTransactions: FS.arrayRemove(entryId),
            });

            const receiverId = await getRecipientId($(card).find(".entry-to").text());
            if (receiverId !== null && receiverId !== "") {
                const receiverRef = await FS.doc(db, "users", receiverId);
                await FS.updateDoc(receiverRef, {
                    incomingTransactions: FS.arrayRemove(entryId),
                });
            }

            console.log("Deleting entry" + entryId);
            await FS.deleteDoc(entryRef);

            $(document).trigger("removeEntry", [entryId]);
            $(card).remove();
        });
    });
}