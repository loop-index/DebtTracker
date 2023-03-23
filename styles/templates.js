export const myView = `
<div class="d-flex justify-content-between">
    <div class="dropdown my-2 px-2">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="newEntryBtn" data-bs-toggle="dropdown" aria-expanded="false">
            New Entry
        </button>
        <form class="dropdown-menu p-4" id="newEntryForm">
            <input type="text" class="form-control mb-2" placeholder="Title">
            <input type="text" class="form-control mb-2" placeholder="Amount">
            <input type="text" class="form-control mb-2" id="recipientInput" placeholder="Recipient" autocomplete="off">
            <button type="submit" id="newEntrySubmit" class="btn btn-primary">Create entry</button>
        </form>
    </div>
    <div class="my-2">
        <button class="btn btn-secondary" type="button" id="signOut">
            Sign Out 
        </button>
    </div>
</div>
<div class="container-fluid overflow-auto" id="entries">
</div>
`


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