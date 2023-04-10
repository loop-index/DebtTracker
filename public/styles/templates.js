export function outView (name, image) {
    return `
    <div class="sticky-top pb-2" style="background-color: white;">
        <div class="d-flex justify-content-between align-items-center px-2 pt-2">
            <div>
                <h1 class="text-start my-0">Outgoing</h1>
                <small class="text-start my-0 ps-1">What you owe to other people.</small>
            </div>
            ${ userInfo(name, image) }
        </div>
        ${ newEntryButton("Entry") }
        ${ filterMenu() }
    </div>
    <div class="container-fluid overflow-auto px-0" id="entries">
    </div>
    <div class="d-flex justify-content-center">
        <button class="btn btn-outline-secondary" id="loadMoreBtn">Load More</button>
    </div>
    `
}

export function inView (name, image) {
    return `
    <div class="sticky-top pb-2" style="background-color: white;">
        <div class="d-flex justify-content-between align-items-center px-2 pt-2">
            <div>
                <h1 class="text-start my-0">Incoming</h1>
                <small class="text-start my-0 ps-1">What other people owe you.</small>
            </div>
            ${ userInfo(name, image) }
        </div>
        ${ newEntryButton("Request") }
        ${ filterMenu() }
    </div>
    <div class="container-fluid overflow-auto px-0" id="entries">
    </div>
    <div class="d-flex justify-content-center">
        <button class="btn btn-outline-secondary" id="loadMoreBtn">Load More</button>
    </div>
    `
}

function newEntryButton(name){
    return `
        <div class="dropdown my-2 px-2" id="newEntryDropdown">
            <div class="input-group w-100">
                <button class="btn btn-outline-secondary" type="button" id="newEntryBtn" data-bs-toggle="dropdown" aria-expanded="false">
                    <span class="d-none d-sm-block">New ${name}</span>
                    <i class="fa-solid fa-plus d-block d-sm-none"></i>
                </button>
                <form class="dropdown-menu p-4" id="newEntryForm">
                    <input type="text" class="form-control mb-2 vw-30" placeholder="Title">
                    <input type="text" class="form-control mb-2" placeholder="Amount">
                    <div class="input-group mb-2">
                        <input type="text" class="form-control" id="recipientName" placeholder="Recipient" autocomplete="off">
                        <button class="btn btn-outline-secondary" type="button" id="newUser"> More </button>
                    </div>
                    <div class="d-none" id="newUserForm">
                        <span class="input-group mb-2">
                            <input type="text" id="recipientEmail" class="form-control" placeholder="Recipient email">
                            <div class="input-group-text">
                                <i class="fa-regular fa-circle-question" data-bs-toggle="tooltip" data-bs-placement="right" title="If your receiver is an existing user, enter their email here."></i>
                            </div>
                        </span>
                        <input type="text" id="recipientImage" class="form-control mb-2" placeholder="Optional avatar URL">
                    </div>
                    <button type="submit" id="newEntrySubmit" class="btn btn-primary">Create entry</button>
                </form>
                <input type="text" class="form-control text-end" id="search" placeholder="Search" autocomplete="off">
                <button class="btn btn-outline-secondary" type="button" id="searchBtn">
                    <i class="fa-solid fa-search"></i>
                </button>
                <button class="btn btn-outline-secondary" type="button" id="filterBtn" data-bs-toggle="collapse" data-bs-target="#filterMenu" aria-expanded="false" aria-controls="filterMenu">
                    <i class="fa-solid fa-filter"></i>
                </button>
                <button class="btn btn-outline-secondary" type="button" id="reloadBtn">
                    <i class="fa-solid fa-sync"></i>
                </button>
            </div>
        </div>
    `
}

function filterMenu(){
    return `
        <div class="input-group w-100 my-2 px-2 collapse" id="filterMenu">
            <button class="btn btn-outline-secondary dropdown-toggle" id="sortBy" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Date
            </button>
            <ul class="dropdown-menu" id="sortOptions">
                <li><a class="dropdown-item" href="#">Date</a></li>
                <li><a class="dropdown-item" href="#">Title</a></li>
                <li><a class="dropdown-item" href="#">Amount</a></li>
            </ul>
            <button class="btn btn-outline-secondary" type="button" id="sortOrder">
                <i class="fa-solid fa-sort-amount-down"></i>
            </button>
        </div>
        `
}

function userInfo(name, image){
    return `
        <div class="dropdown my-0">
            <img src="${image}" class="rounded-circle" alt="User image" width="40" height="40" data-bs-toggle="dropdown" aria-expanded="false">
            <ul class="dropdown-menu text-end">
                <li class="dropdown-item-text">${name}</li>
                <li><a class="dropdown-item" href="#">Account</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" id="signOut">Sign Out</a></li>
            </ul>
        </div>
    `
}


export const mainView = `
    <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="newEntryBtn" data-bs-toggle="dropdown" aria-expanded="false">
            New Entry
        </button>
        <form class="dropdown-menu p-4" id="newEntryForm">
            <input type="text" class="form-control mb-2" placeholder="Title">
            <input type="text" class="form-control mb-2" placeholder="Amount">
            <button type="submit" class="btn btn-primary">Create entry</button>
        </form>
</div>
`

export const loginView = `
<h1>Login</h1>
<form id="loginForm">
    <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">Email address</label>
        <input type="email" class="form-control" id="email" placeholder="name@example.com">
    </div>
    <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">Password</label>
        <input type="password" class="form-control" id="password" placeholder="password@pass">
    </div>
    <span>
    <button type="submit" class="btn btn-primary">Login</button>
    <button type="button" id="signup" class="btn btn-primary">Sign Up</button>
    </span>
</form>
    `

export const signupView = `
<h1>Signup</h1>
<form id="signupForm">
    <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">Email address</label>
        <input type="email" class="form-control" id="email" placeholder="name@example.com">
    </div>
    <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">Password</label>
        <input type="password" class="form-control" id="password" placeholder="password@pass">
    </div>
    <span>
    <button type="submit" class="btn btn-primary">Sign Up</button>
    <button type="button" id="login" class="btn btn-primary">Login</button>
    </span>
</form>
    `