import { formatter } from '../utils.js'

export const myView = `
<div class="dropdown">
    <span class="mb-3">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="newEntryBtn" data-bs-toggle="dropdown" aria-expanded="false">
            New Entry
        </button>
        <form class="dropdown-menu p-4" id="newEntryForm">
            <input type="text" class="form-control mb-2" placeholder="Title">
            <input type="text" class="form-control mb-2" placeholder="Amount">
            <input type="text" class="form-control mb-2" id="recipientInput" placeholder="Recipient" autocomplete="off">
            <button type="submit" id="newEntrySubmit" class="btn btn-primary">Create entry</button>
        </form>
        <button class="btn btn-secondary" type="button" id="signOut">
            Sign Out
        </button>
    </span>
    
</div>
`

export function newCard(title, date, amount) {
    return `
    <div class="card entry">
        <div class="card-body">
            <div class="row">
                <div class="col">
                    <h5 class="entry-title">${title}</h5>
                    <h1 class="entry-amount">${formatter.format(amount)}</h1>
                    <p class="entry-date">Since ${date}</p>
                </div>
                <div class="col-auto d-flex align-items-center">
                    <img src="https://via.placeholder.com/100" class="rounded-circle entry-person" alt="...">
                </div>
            </div>
        </div>
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