import { signOut } from "../screens/auth.js"
import { AU, FS, db } from "../firebase.js";

export class listScreen {
    constructor (app) {
        this.app = app;
        this.title = 'List Screen';
        this.uid;
        this.list = [];
        this.knownUsers = {};
        this.curEntryIndex = 0;
        this.perPage = 7;
        this.curUserRef;
        this.template;
        this.username;
        this.userimage;
        this.sender;
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
        this.app.detachCurrentListener();
        $('#content').html(this.template(this.username, this.userimage));
        this.attachHandlers();

    }

    attachHandlers() {
        let self = this;
        let filteredList = [];
        $("#signOut").on("click", function(e){
            e.preventDefault();
            signOut(AU).then(() => {
                router.navigate("/login");
            });
            self.app.reset();
        });

        $("#loadMoreBtn").on("click", function(e){
            e.preventDefault();
            if (-self.curEntryIndex + self.perPage < self.list.length){
                self.curEntryIndex -= self.perPage;
                self.loadEntries(self.list, true);
            }
        });

        $("#sortOptions").on("click", "a", async function(e){
            e.preventDefault();
            let sort = $(e.target).text();
            $("#sortBy").text(sort);

            // if (filter == "Date"){
            //     filteredList = self.list;
            // } else {
            //     filteredList 
            // }
        });
    }

}