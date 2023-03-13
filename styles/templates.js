export const myView = `
<div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="newEntryBtn" data-bs-toggle="dropdown" aria-expanded="false">
        New Entry
    </button>
    <form class="dropdown-menu p-4">
        <input type="text" class="form-control mb-2" placeholder="Title">
        <input type="text" class="form-control mb-2" placeholder="Amount">
        <button type="submit" class="btn btn-primary">Sign in</button>
    </form>
</div>
`

export function newCard(title, date, amount) {
    return `
    <div class="card entry">
        <div class="card-body">
            <div class="row">
                <div class="col-8">
                    <h5 class="entry-title">${title}</h5>
                    <h1 class="entry-amount">${amount}</h1>
                    <p class="entry-date">Since ${date}</p>
                </div>
                <div class="col-4 d-flex align-items-center">
                    <img src="https://via.placeholder.com/100" class="container-fluid rounded-circle entry-person" alt="...">
                </div>
            </div>
        </div>
    </div> 
    `
} 