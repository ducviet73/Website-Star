
import "./public/bootstrap/css/bootstrap.min.css"
import "./public/css/style.css";
import "./public/css/fontawesome.css";
import Leftbar from "./components/leftbar";
import Link from "next/link";
import Providers from "@/redux/provider";


export const metadata = {
  title: 'Admin shopShoe',
  description: 'Trang quản lý bằng Next.js',
}
export default function RootLayout({ children }) {
  
  return (
    <html lang="vi">
      <body style={{ background: "#eff8ff" }}>
      <Providers>
        <div className="d-flex min-vh-100">
          <div className="d-flex flex-column flex-shrink-0 p-3 text-bg-primary" style={{ maxwidth: 280 + "px" }} data-bs-theme="dark">
            <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none justify-content-center">
              <img src=" # " />
              <span className="fs-4 d-none d-sm-inline-block">BS ADMIN</span>
            </a>
            <hr />
            <Leftbar />
          </div>
          <div className="w-100">
            <nav className="navbar navbar-expand-md text-bg-primary" data-bs-theme="dark">
              <div className="container-fluid ps-0">
                <div className="d-flex justify-content-between w-100">
                  <form className="d-flex w-100" role="search" data-bs-theme="light">
                    <div className="input-group">
                      <button type="submit" className="btn btn-primary rounded-0 border-white">
                        <i className="far fa-search"></i>
                      </button>
                      <input className="form-control me-2 rounded-0 border-white" type="search" placeholder="Search" />
                    </div>
                  </form>
                  <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                  </button>
                </div>
                <div className="collapse navbar-collapse w-100" id="navbarSupportedContent">
                  <ul className="navbar-nav ms-auto" data-bs-theme="light">
                    <li className="nav-item dropdown">
                      <a className="nav-link dropdown-toggle  thongbao" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <strong className=" thongbao-1  " data-text="10" > <i className="fas fa-bell"></i></strong>
                      </a>
                      <ul className="dropdown-menu rounded-0 dropdown-menu-md-end">
                        <li><a className="dropdown-item" href="#">Profile</a></li>
                        <li><a className="dropdown-item" href="#">Settings action</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" href="#">Sign out</a></li>
                      </ul>
                    </li>
                    <li className="nav-item dropdown">
                      <Link className="nav-link dropdown-toggle" href="#"  role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="https://i1-giaitri.vnecdn.net/2020/03/29/991816090-56782878-2.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=FalyTpb6BDBE3vFkujJ-TQ" alt="" width="32" height="32" className="rounded-circle me-2" />
                        <i class= "bi bi-person fs-5  fw-bolder text-dark"  />
                        <strong>NGuyễn CÔng Bền </strong>
                      </Link>
                      <ul className="dropdown-menu rounded-0 dropdown-menu-md-end">
                        <li><a className="dropdown-item" href="#">Profile</a></li>
                        <li><a className="dropdown-item" href="#">Settings action</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" href="#">Sign out</a></li>
                      </ul>
                    </li>
                  </ul>

                </div>
              </div>
            </nav>
            <div className="container-fluid p-4">
              {children}
            </div>
          </div>
        </div>
        <script src="/bootstrap/js/google.chart.js"></script>
        <script src="/bootstrap/js/bootstrap.bundle.min.js"></script>
        </Providers>
      </body>
    </html>
  )
}