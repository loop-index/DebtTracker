export const navView = 
`
<div class="d-flex flex-column flex-shrink-0">
  <a href="/" class="d-flex text-dark text-decoration-none mt-3">
    <img src="../images/logo.png" alt="logo" class="img-fluid d-none d-sm-block">
    <img src="../images/clock.png" alt="logo" class="img-fluid d-block d-sm-none">
  </a>
  <hr>
  <ul class="nav nav-pills justify-content-center">
    <li>
      <a href="outgoing" class="nav-link fw-bold text-dark">
        <i class="fa-solid fa-arrow-trend-down"></i>
        <span class="d-none d-sm-none d-md-inline ms-1">outgoing</span>
      </a>
    </li>
    <li>
      <a href="incoming" class="nav-link fw-bold text-dark">
        <i class="fa-solid fa-arrow-trend-up"></i>
        <span class="d-none d-sm-none d-md-inline ms-1">incoming</span>
      </a>
    </li>
  </ul>
</div>
`