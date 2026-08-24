import styles from './Contact.module.css'

const contactChannels = [
  {
    title: 'Correo electrónico',
    description: 'Escribinos para consultas, sugerencias o comentarios sobre la plataforma.',
    label: 'TobiL8485@gmail.com',
    href: 'mailto:TobiL8485@gmail.com',
  },
  {
    title: 'WhatsApp',
    description: 'Un canal directo para ponerte en contacto y compartir una consulta.',
    label: '3455 436036',
    href: 'https://wa.me/5493455436036',
  },
  {
    title: 'Instagram',
    description: 'Seguinos para conocer las novedades del proyecto.',
    label: '@tobias.linares',
    href: 'https://instagram.com/tobias.linares',
  },
]

const socialChannels = [
  { label: 'GitHub', href: 'https://github.com/saibotli' },
  { label: 'Repositorio del proyecto', href: 'https://github.com/SaibotLi/villaguay-conectado' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/valentin-linares-411a3b3ba/?locale=es' },
]

function Contact() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Estamos para escucharte</p>
        <h1>Contacto</h1>
        <p className={styles.lead}>
          ¿Tenés una consulta, una sugerencia o querés conocer más sobre VillaguayConectado?
          Elegí el canal que te resulte más cómodo.
        </p>
      </section>

      <section aria-labelledby="contact-channels-title">
        <h2 id="contact-channels-title" className={styles.sectionTitle}>Canales de contacto</h2>
        <ul className={styles.cards}>
          {contactChannels.map((channel) => (
            <li key={channel.title} className={styles.card}>
              <h3>{channel.title}</h3>
              <p>{channel.description}</p>
              <a href={channel.href} target={channel.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                {channel.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.project} aria-labelledby="project-title">
        <div>
          <p className={styles.eyebrow}>Proyecto académico</p>
          <h2 id="project-title">Conocé más sobre el desarrollo</h2>
        </div>
        <div className={styles.projectContent}>
          <p>
            VillaguayConectado es un Proyecto Final de la Universidad Nacional del Litoral. También
            podés consultar el código y el recorrido del proyecto en estos espacios.
          </p>
          <ul className={styles.socialLinks}>
            {socialChannels.map((channel) => (
              <li key={channel.label}>
                <a href={channel.href} target="_blank" rel="noreferrer">
                  {channel.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

export default Contact
