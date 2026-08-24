import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button/Button'
import styles from './About.module.css'

const steps = [
  {
    number: '01',
    title: 'Descubrí',
    description: 'Explorá los eventos publicados y encontrá propuestas para disfrutar en Villaguay.',
  },
  {
    number: '02',
    title: 'Participá',
    description: 'Guardá los eventos que te interesan y compartilos con otras personas.',
  },
  {
    number: '03',
    title: 'Proponé',
    description: 'Creá una propuesta y enviála para que pueda ser revisada antes de publicarse.',
  },
]

function About() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Una agenda para la comunidad</p>
        <h1>VillaguayConectado</h1>
        <p className={styles.lead}>Todos los eventos de nuestra ciudad, en un solo lugar.</p>
        <div className={styles.actions}>
          <Button as={Link} to="/eventos" variant="primary">
            Explorar eventos
          </Button>
          <Button as={Link} to="/proponer-evento" variant="accent">
            Proponer evento
          </Button>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="problem-title">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>El punto de partida</p>
          <h2 id="problem-title">Que ningún evento se pierda entre tantos mensajes</h2>
        </div>
        <p className={styles.text}>
          La información sobre actividades locales suele estar repartida entre redes sociales,
          flyers, mensajes y distintos canales. VillaguayConectado busca reunirla en una agenda
          clara, fácil de consultar y pensada para la comunidad.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="steps-title">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>Así funciona</p>
          <h2 id="steps-title">Una forma simple de estar al tanto</h2>
        </div>
        <ol className={styles.steps}>
          {steps.map((step) => (
            <li key={step.number} className={styles.step}>
              <span className={styles.stepNumber}>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.vision} aria-labelledby="vision-title">
        <div>
          <p className={styles.eyebrow}>Nuestra visión</p>
          <h2 id="vision-title">Un punto de encuentro digital para Villaguay</h2>
        </div>
        <p>
          Queremos que ciudadanos, organizaciones y quienes impulsan actividades locales tengan un
          espacio común para descubrir propuestas, participar y hacer circular lo que pasa en la
          ciudad.
        </p>
      </section>
    </div>
  )
}

export default About
