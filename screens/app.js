import { onAuthStateChanged } from "../screens/auth.js"
import { AU, FS, db } from "../firebase.js";
import { outgoingScreen } from "./outScreen.js";
import { incomingScreen } from "./inScreen.js";

export class App {
    constructor() {
        this.title = 'App';
        this.uid;
        this.curUserRef;
        this.knownUsers = {};
        this.outgoingScreen;
        this.incomingScreen;
        this.detachListenerFn = () => {};
    }

    async init(callback) {
        await onAuthStateChanged(AU, async (user) => {
            if (user) {
                this.uid = user.uid;
                this.curUserRef = await FS.doc(db, "users", this.uid);
                
                const curUserDoc = await FS.getDoc(this.curUserRef);

                this.knownUsers = curUserDoc.data().knownUsers;

                callback();
            }
            else {
                router.navigate("/login");
                return;
            }
        });
        console.log("App initialized");
    }

    async getKnownUsers() {
        if (!this.knownUsers) {
            const curUserDoc = await FS.getDoc(curUserRef);
            this.knownUsers = curUserDoc.data().knownUsers;
        }
        return this.knownUsers;
    }

    updateKnownUsers(id, data) {
        this.knownUsers[id] = data;

        FS.updateDoc(this.curUserRef, {
            [`knownUsers.${id}`]: data,
        });
        return this.knownUsers;
    }

    getUserUID() {
        return this.uid;
    }

    getUserRef() {
        return this.curUserRef;
    }

    async validateUser(name, email, image){
        // Check if name is empty
        for (let id in this.knownUsers){
            if (this.knownUsers[id].name === name){
                return id;
            }
            else if (email != "" && this.knownUsers[id].email === email){
                alert("User with this email already exists")
            }
        }
    
        // If name not found then it's a new recipient
        if (email === ""){
            var id = "#" + Date.now();
        }
        else {
            console.log("Searching for user with email: " + email)
            const q = FS.query(FS.collection(db, "users"), 
                FS.where("email", "==", email));
            const querySnapshot = await FS.getDocs(q);
            if (querySnapshot.empty){
                alert ("No user found with this email");
                return null;
            }
            for (const doc of querySnapshot.docs){
                var id = doc.id;
                break;
            }
        }
    
        image = image === "" ? `https://api.dicebear.com/5.x/big-smile/svg?size=48&backgroundColor=fbc324&seed=${id.slice(1)}` : image;
    
        this.updateKnownUsers(id, {
            name: name,
            email: email,
            image: image,
        });
        return id;
    }

    async getOutgoingScreen() {
        if (!this.outgoingScreen) {
            this.outgoingScreen = new outgoingScreen(this);
            await this.outgoingScreen.init('outgoingTransactions');
        }
        return this.outgoingScreen;
    }

    async getIncomingScreen() {
        if (!this.incomingScreen) {
            this.incomingScreen = new incomingScreen(this);
            await this.incomingScreen.init('incomingTransactions');
        }
        return this.incomingScreen;
    }

    setDetachFunction(fn) {
        this.detachListenerFn = fn;
    }

    detachCurrentListener() {
        this.detachListenerFn();
    }

}