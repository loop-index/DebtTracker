import { formatter } from '../utils.js'

export const matchDropdown = `
    <div class="list-group" id="matches">
    </div>
`;


export function newCard(id, title, date, amount, to) {
    return `
    <div class="card entry" id="${id}">
        <div class="card-body">
            <div class="row">
                <div class="col-auto d-flex align-items-center">
                    <img class="img-resonsive rounded-circle" src="https://api.dicebear.com/5.x/big-smile/svg?size=48&backgroundColor=fbc324&seed=${to}">
                </div>
                <div class="col">
                    <h5 class="entry-title">${title}</h5>
                    <p class="entry-date"><small>Since ${date}</small></p>
                </div>
                <div class="col text-end">
                    <h1 class="entry-amount">${formatter.format(amount)}</h1>
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

        $($(form).children()[1]).on("click", function (e) {
            e.preventDefault();
            let amount = $(card).find(".entry-amount").text().replace("$", "");
            let amountPaid = $(form).find("input").val();
            if (amountPaid === "") {
                amountPaid = 0;
            }
            $(card).find(".entry-amount").text(formatter.format(amount - $(form).find("input").val()));
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

        $($(form).find("button")).on("click", function (e) {
            e.preventDefault();

            let title = $(form).find("input")[0].value;
            let amount = $(form).find("input")[1].value;

            if (title !== "") {
                $(card).find(".entry-title").text(title);
            }
            if (amount !== "") {
                $(card).find(".entry-amount").text(formatter.format(amount));
            }
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

        $(form).on("click", function (e) {
            e.preventDefault();
            $(document).trigger("removeEntry", $(card).attr("id"));
            $(card).remove();
        });
    });
}