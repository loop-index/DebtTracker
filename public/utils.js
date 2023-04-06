import { matchDropdown } from "./styles/components.js";

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
        $(this).parent().parent().append(matchDropdown);
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
        if (matches.length == 0){
            $("#matches").remove();
            return;
        }
        matches.forEach((item) => {
            let option = $(`
            <button class="list-group-item list-group-item-action">
                <div class="row">
                    <span class="col overflow-hidden">${item}</span>
                </div>
            </button>`)
                .appendTo("#matches");
            option.on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                $(input).val($(this).find("span").text());
                $("#matches").remove();
                $(input).blur();
            });
        });
    }

    //Arrow keys for navigation
    $(input).on("keydown", function (e) {
        if ($("#matches").length == 0) return;

        if (e.key == "ArrowDown") {
            e.preventDefault();
            e.stopPropagation();
            let active = $("#matches").find(".active");
            if (active.length == 0) {
                $("#matches").find("button").first().addClass("active");
            } else {
                active.removeClass("active");
                active.next().addClass("active");
            }
        } else if (e.key == "ArrowUp") {
            e.preventDefault();
            e.stopPropagation();
            let active = $("#matches").find(".active");
            if (active.length == 0) {
                $("#matches").find("button").last().addClass("active");
            } else {
                active.removeClass("active");
                active.prev().addClass("active");
            }
        } else if (e.key == "Enter") {
            e.preventDefault();
            e.stopPropagation();
            let active = $("#matches").find(".active");
            if (active.length != 0) {
                active.trigger("click");
            }
        }
    });
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


