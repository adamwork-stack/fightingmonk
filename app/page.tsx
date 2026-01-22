import Image from 'next/image'
import styles from './page.module.css'
import Search from './components/Search'

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.logo}>
            <Image
              src="/images/fightingmonkLogo.png"
              alt="Fighting Monk"
              width={200}
              height={60}
              priority
            />
          </div>
          <ul className={styles.navList}>
            <li><a href="#about">ABOUT</a></li>
            <li><a href="#team">TEAM</a></li>
            <li><a href="#work">WORK</a></li>
            <li><a href="#directors">DIRECTORS</a></li>
            <li><a href="#contact">CONTACT</a></li>
            <li><a href="#news">NEWS</a></li>
          </ul>
        </nav>
      </header>

      <section id="about" className={styles.section}>
        <div className={styles.container}>
          <Search />
          <h1 className={styles.title}>Fighting Monk</h1>
          <p className={styles.description}>
            Fighting Monk is a full-service commercial, film, and video content production company based in Austin and New York.
          </p>
          <p className={styles.description}>
            Our first film production "Lemonade" was a project by and about those affected by layoffs during the great recession. Since then, we've grown to create international, award-winning advertising campaigns, feature films, and social good projects for partners of all sizes.
          </p>
          <p className={styles.description}>
            Whether it's for agencies or brands, non-profits or our own original content, Fighting Monk's mission is to kick ass and do good through impeccable visual and emotional storytelling.
          </p>
        </div>
      </section>

      <section id="team" className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Team</h2>
          <div className={styles.teamGrid}>
            <div className={styles.teamMember}>
              <Image
                src="/images/HeadShotWeb_BW.jpg"
                alt="Team Member"
                width={300}
                height={300}
                className={styles.teamImage}
              />
              <h3>Leadership</h3>
            </div>
            <div className={styles.teamMember}>
              <Image
                src="/images/ira-brooks.png"
                alt="Ira Brooks"
                width={300}
                height={300}
                className={styles.teamImage}
              />
              <h3>Ira Brooks</h3>
            </div>
            <div className={styles.teamMember}>
              <Image
                src="/images/paul-raila.png"
                alt="Paul Raila"
                width={300}
                height={300}
                className={styles.teamImage}
              />
              <h3>Paul Raila</h3>
            </div>
            <div className={styles.teamMember}>
              <Image
                src="/images/Sara_BlacknWhite-500x299.jpg"
                alt="Sara"
                width={300}
                height={300}
                className={styles.teamImage}
              />
              <h3>Sara</h3>
            </div>
          </div>
        </div>
      </section>

      <section id="directors" className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Directors</h2>
          <div className={styles.directorImage}>
            <Image
              src="/images/New-Director-Image-01-1.jpg"
              alt="Directors"
              width={800}
              height={600}
              className={styles.directorImg}
            />
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>&copy; {new Date().getFullYear()} Fighting Monk. All rights reserved.</p>
          <a href="#top" className={styles.backToTop}>
            <Image
              src="/images/arrow-up.png"
              alt="Back to top"
              width={30}
              height={30}
            />
          </a>
        </div>
      </footer>
    </main>
  )
}
