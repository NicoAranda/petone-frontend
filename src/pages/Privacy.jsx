import React from 'react'

const Privacy = () => {
  return (
    <div className="container py-5">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 className="mb-3">Política de Privacidad - Pet-One</h1>

        <p className="text-muted">Última actualización: 6 de mayo de 2026</p>

        <section className="mb-4">
          <h5>1. Información que recopilamos</h5>
          <p>Recopilamos información que los usuarios proporcionan directamente (por ejemplo, nombre y correo electrónico) y datos técnicos (como cookies, dirección IP y datos de uso) para operar y mejorar la plataforma.</p>
        </section>

        <section className="mb-4">
          <h5>2. Uso de la información</h5>
          <p>Usamos la información para prestar el servicio, responder consultas, gestionar suscripciones, prevenir abusos y mejorar la experiencia de los usuarios.</p>
        </section>

        <section className="mb-4">
          <h5>3. Cookies y tecnologías similares</h5>
          <p>Utilizamos cookies para funciones esenciales, preferencias y analítica. Puedes configurar o rechazar cookies en tu navegador; ten en cuenta que algunas funcionalidades pueden verse afectadas.</p>
        </section>

        <section className="mb-4">
          <h5>4. Compartir información</h5>
          <p>No vendemos datos personales. Podemos compartir información con proveedores de servicios (hosting, analítica, pasarelas de correo) que actúen en nuestro nombre y se sujeten a obligaciones de confidencialidad.</p>
        </section>

        <section className="mb-4">
          <h5>5. Seguridad</h5>
          <p>Implementamos medidas técnicas y organizativas para proteger los datos personales. Aunque realizamos esfuerzos razonables, ningún sistema es completamente infalible.</p>
        </section>

        <section className="mb-4">
          <h5>6. Derechos del usuario</h5>
          <p>Los usuarios pueden solicitar acceso, rectificación o eliminación de sus datos, o ejercer otros derechos reconocidos por la ley, escribiendo a contacto@petone.example.</p>
        </section>

        <section className="mb-4">
          <h5>7. Menores</h5>
          <p>La plataforma no está dirigida a menores de 16 años. Si eres tutor legal y crees que se ha publicado información de un menor sin consentimiento, contáctanos para que lo revisemos.</p>
        </section>

        <section className="mb-4">
          <h5>8. Cambios en la política</h5>
          <p>Podemos actualizar esta política; publicaremos la fecha de última actualización arriba. Si los cambios son significativos, lo comunicaremos mediante la plataforma.</p>
        </section>

        <section className="mb-4">
          <h5>9. Contacto</h5>
          <p>Para consultas sobre la política de privacidad escribe a contacto@petone.example.</p>
        </section>
      </div>
    </div>
  )
}

export default Privacy
