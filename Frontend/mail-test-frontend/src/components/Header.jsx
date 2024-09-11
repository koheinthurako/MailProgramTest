import './Header.css';

const Header = () => {
  return (
    <div id="header">
        <nav className="navbar navbar-expand-lg px-lg-4" style={{backgroundColor: "#fff", boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px"}}>
            <div className="container-fluid d-flex justify-content-between">
                <a className="navbar-brand" href="">
                    <img src="../../public/img/Logo.png" alt="" className="logo" />
                </a>
                <p className="mb-0"><strong>Mail Sender Program</strong></p>
            </div>
        </nav>
    </div>
  )
}

export default Header