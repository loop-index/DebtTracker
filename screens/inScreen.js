import { listScreen } from './listScreen.js';
import { FS, db } from '../firebase.js';
import { newCard, inCardExtension, infoCard, attachControls } from '../styles/components.js';
import { validateInputs, autocomplete } from '../utils.js';
import { inView } from '../styles/templates.js';

export class incomingScreen extends listScreen {
    constructor(app) {
        super(app);
        this.title = 'Out Screen';
        this.template = inView;
    }

    async render() {
        await super.render();
        this.loadEntries();

        const q = FS.doc(db, "users", this.uid);
        FS.onSnapshot(q, async (snapshot) => {
            const incoming = snapshot.get('incomingTransactions');

            // Only load new entries
            if (incoming.length > this.list.length) {
                const newEntries = incoming.slice(this.list.length);
                const entries = [];
                
                for (const docId of newEntries){
                    let doc = await FS.getDoc(FS.doc(db, "transactions", docId));
                    entries.push(doc);
                }
            
                for (const doc of entries){
                    let data = doc.data();
                    this.addNewCard(doc.id, data['title'], data['amount'],
                        data['date'], data['from'], false);
                }

                this.list = incoming;
            }
                    
        });
    }

    attachHandlers() {
        super.attachHandlers();
        var self = this;

        $(".dropdown-menu").on("click.bs.dropdown", function(e){
            e.stopPropagation();
        });

        $("#newEntryForm").submit(async function(e){
            e.preventDefault();
            let title = $(this).children()[0].value;
            let amount = $(this).children()[1].value;
            let recipientName = $("#recipientName").val();
            let date = new Date().toLocaleDateString();
            let recipientEmail = $("#recipientEmail").val();
            let recipientImage = $("#recipientImage").val();
            
            if (validateInputs(title, amount, recipientName)){
                let recipientId = await self.app.validateUser(recipientName, recipientEmail, recipientImage);
                console.log(recipientId);
                if (recipientId) {
                    
                    self.addNewEntry(title, amount, date, recipientId);

                    $(this).children()[0].value = "";
                    $(this).children()[1].value = "";
                    $("#recipientName").val("");
                    $("#recipientEmail").val("");
                    $("#recipientImage").val("");
    
                    $(this).siblings(".dropdown-toggle").trigger('click.bs.dropdown');
                }
            }
        });

        $("#newEntryDropdown").on("hide.bs.dropdown", function(){
            $("#matches").remove();
        });

        $("#newEntryForm").on("click", function(e){
            // if not clicked on matches and not on input
            if ($(e.target).closest("#matches").length == 0
                && $(e.target).closest("#recipientName").length == 0){
                $("#matches").remove();
            }
        });

        $("#newUser").on("click", function(e){
            $("#newUserForm").toggleClass("d-none");
        });

        function getKnownUsersList(){
            let users = [];
            for (let id in self.knownUsers){
                users.push(self.knownUsers[id].name);
            }
            return users;
        }

        autocomplete($("#recipientName"), getKnownUsersList);

        // Async calls
        $(document).on("removeEntry", async function(e, id){
            try {
                let removed = self.list.indexOf(id);
                self.list.splice(removed, 1);
                console.log(removed);
                let docId = self.list[self.list.length - self.perPage];
                console.log(docId);
                if (docId){
                    let doc = await FS.getDoc(FS.doc(db, "transactions", docId));
                    let data = doc.data();
                    let isSelf = data['createdBy'] == data['to'];
                    self.addNewCard(docId, data['title'], data['amount'],
                        data['date'], data['from'], isSelf, true);
                }
            } catch (err) {
                console.log(err);
            }
        });
    }

    async addNewEntry(title, amount, date, id){
        let history = [new Date().toLocaleString() + ": " + "Created."];
    
        const docRef = await FS.addDoc(FS.collection(db, "transactions"), {
            from: id,
            to: this.uid,
            title: title,
            amount: amount,
            date: date,
            history: history,
            createdBy: this.uid,
        });
        
        this.addNewCard(docRef.id, title, amount, date, id, true);
        this.list.push(docRef.id);
    
        console.log("Document written with ID: ", docRef.id);
        
        FS.updateDoc(this.curUserRef, {
            incomingTransactions: FS.arrayUnion(docRef.id),
        });
    
        this.toRecipient(id, docRef.id);
    }
    
    
    async addNewCard(id, title, amount, date, to, self, append=false){
        let card;
        let name = "from ";
        let image;

        if (!this.knownUsers[to]){
            let doc = await FS.getDoc(FS.doc(db, "users", to));
            name += doc.data()['email'];
            image = doc.data()['image'];
        } else {
            name += this.knownUsers[to].name;
            image = this.knownUsers[to].image;
        }
    
        if (!append){
            card = $(newCard(title, date, amount, name, image)).prependTo($("#entries"));
        } else {
            card = $(newCard(title, date, amount, name, image)).appendTo($("#entries"));
        }
        $(card).on("click", function(){
            if ($(this).hasClass("card-active")) return;
            
            $(".card-active").find(".card-controls").remove();
            $(".card-active").find(".card-form").remove();
            $(".card-active").removeClass("card-active");
            $(this).addClass("card-active");
    
            const controls = $(inCardExtension(self)).appendTo($(this));
            // controls.slideDown("fast");
            attachControls($(this), controls, id);
        });
        card.fadeIn();
    
        // If there are more than 7 entries, remove the last one
        if ($("#entries").children().length > this.perPage){
            $("#entries").children().last().remove();
        }
    }
    
    
    async loadEntries(){
        const page = this.list.slice(-this.perPage);
        const entries = [];
    
        for (const docId of page){
            let doc = await FS.getDoc(FS.doc(db, "transactions", docId));
            entries.push(doc);
        }
    
        for (const doc of entries){
            let data = doc.data();
            let self = data['createdBy'] == data['to'];
            this.addNewCard(doc.id, data['title'], data['amount'],
                data['date'], data['from'], self);
        }
    }
    
    async toRecipient(receiverId, docId){
        if (!receiverId || receiverId[0] == "#") return;
        const rDoc = await FS.getDoc(FS.doc(db, "users", receiverId));
        FS.updateDoc(rDoc.ref, {
            outgoingTransactions: FS.arrayUnion(docId),
        });
    }
}