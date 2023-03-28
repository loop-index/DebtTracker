import { signOut } from "../screens/auth.js"
import { AU, FS, db } from "../firebase.js";

export class listScreen {
    constructor (app) {
        this.app = app;
        this.title = 'List Screen';
        this.uid;
        this.list = [];
        this.knownUsers = {};
        this.perPage = 7;
        this.curUserRef;
        this.template;
        this.username;
        this.userimage;
    }

    async init(listName) {
        this.uid = await this.app.uid;
        this.curUserRef = await this.app.getUserRef();
        this.knownUsers = await this.app.getKnownUsers();

        const userDoc = await FS.getDoc(this.curUserRef);
        this.list = userDoc.data()[listName];
        this.username = userDoc.data().name;
        this.userimage = userDoc.data().image;
    }

    async render() {
        $('#content').html(this.template(this.username, this.userimage));
        this.attachHandlers();

    }

    attachHandlers() {
        $("#signOut").on("click", function(e){
            e.preventDefault();
            localStorage.removeItem("token");
            localStorage.removeItem("uid");
            signOut(AU).then(() => {
                console.log("Signed out");
                router.navigate("/login");
            });
        });
    }

}