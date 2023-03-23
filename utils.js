import { matchDropdown } from "/styles/components.js";

// Create our number formatter.
export const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export function autocomplete(input, arrayFn) {
    let array;
    $(input).on("focus", async function () {
        array = await arrayFn();
        $(this).parent().append(matchDropdown);
        $("#matches").offset({
            "top": $(input).offset().top + $(input).outerHeight(),
            "left": $(input).offset().left,
        })
        $("#matches").css({
            "width": $(input).outerWidth(),
        });
        match($(this));
    });

    $(input).on("input", function () {
        match($(this));
    });

    function match(input){
        let val = $(input).val();
        let matches = array.filter((item) => {
            return item.toLowerCase().startsWith(val.toLowerCase());
        });
        $("#matches").empty();
        matches.forEach((item) => {
            let option = $(`
            <button class="list-group-item list-group-item-action">
                <div class="row">
                    <img class="col-auto rounded-circle" src="https://api.dicebear.com/5.x/big-smile/svg?size=32&backgroundColor=fbc324&seed=${item}">
                    <span class="col overflow-hidden">${item}</span>
                </div>
            </button>`)
                .appendTo("#matches");
            option.on("click", function (e) {
                e.preventDefault();
                $(input).val($(this).find("span").text());
                $("#matches").remove();
                $(input).blur();
            });
        });
    }
}

export function validateInputs(title, amount, to){
    if (title === "") {
        return false;
    }
    if (amount === "") {
        return false;
    }
    if (to === "") {
        return false;
    }
    return true;
}
