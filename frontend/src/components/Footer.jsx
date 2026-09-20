import flag from '../assets/flag.webp'


function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <img src={flag} alt="Флаг Евпатории" className="footer-flag" />
        <p>
          Евпатория: ВДЖ — каталог государственных и муниципальных организаций города.
          Дипломный проект, {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}

export default Footer
