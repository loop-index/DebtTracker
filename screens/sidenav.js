import { navView } from "../styles/navTemplates.js";
const nav = $("#nav-side");

export function loadNav(){
    nav.html(navView);
    $("#nav-side").on("click", "a", function(e){
        e.preventDefault();
        router.navigate($(this).attr("href"));
    });
}
