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
        this.sortAsc = true;
    }

    async init(listName) {
        this.uid = await this.app.uid;
        this.curUserRef = await this.app.getUserRef();
        this.knownUsers = await this.app.getKnownUsers();

        const userDoc = await FS.getDoc(this.curUserRef);

        this.username = userDoc.data().name;
        this.userimage = userDoc.data().image;
    }

    async render() {
        this.app.detachCurrentListener();
        $('#content').html(this.template(this.username, this.userimage));
        console.log(this.list);
        this.attachHandlers();

    }

    async updateList(listName) {
        const userDoc = await FS.getDoc(this.curUserRef);
        
        this.list = [];
        let list = userDoc.data()[listName];
        for (const docId of list){
            let doc = await FS.getDoc(FS.doc(db, "transactions", docId));
            let data = doc.data();
            data.id = doc.id;
            this.list.push(data);
        }
    }

    attachHandlers() {
        let self = this;
        let filteredList = [];
        let oldResults = filteredList;

        console.log(filteredList);
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

            sort = sort.toLowerCase();
            if (sort == "date"){
                filteredList = self.list;
            } else if (sort == "amount"){
                filteredList = self.list.sort((a, b) => {
                    return (parseInt(a[sort]) < parseInt(b[sort])) ? 1 : -1;
                });
                console.log(filteredList);
            } else {
                filteredList = self.list.sort((a, b) => {
                    return (a[sort] < b[sort]) ? 1 : -1;
                });
                console.log(filteredList);
            }
            $("#entries").empty();
            if (!self.sortAsc){
                filteredList = filteredList.reverse();
            }
            self.loadEntries(filteredList);
        });

        $("#sortOrder").on("click", function(e){
            e.preventDefault();
            if (filteredList.length == 0){
                filteredList = self.list;
            }

            if (self.sortAsc){
                self.sortAsc = false;
                $("#sortOrder").html('<i class="fas fa-sort-amount-down"></i>');
            } else {
                self.sortAsc = true;
                $("#sortOrder").html('<i class="fas fa-sort-amount-up"></i>');
            }
            $("#entries").empty();
            filteredList = filteredList.reverse();
            self.loadEntries(filteredList);
        });

        $("#search").on("keydown", function(e){
            if (filteredList.length == 0){
                filteredList = self.list;
            }

            if (e.key.length == 1){
                // e.preventDefault();
                let search = $(this).val();
                let results = filteredList.filter((entry) => {
                    return entry.title.toLowerCase().includes(search.toLowerCase());
                });
                if (oldResults.length != results.length){
                    $("#entries").empty();
                    self.loadEntries(results);
                    oldResults = results;
                }
            }
        });
    }

}