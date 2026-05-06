import React from 'react'

const Terms = () => {
  return (
    <div className="container py-5">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 className="mb-3">Términos y Condiciones - Pet-One</h1>

        <p className="text-muted">Última actualización: 6 de mayo de 2026</p>

        <section className="mb-4">
          <h5>1. Aceptación</h5>
          <p>Al utilizar Pet-One aceptas estos Términos y Condiciones y todas las políticas aplicables. Si no estás de acuerdo, no utilices la plataforma.</p>
        </section>

        <section className="mb-4">
          <h5>2. Uso de la plataforma</h5>
          <p>Pet-One es una plataforma para publicar información sobre mascotas (adopciones, perdidas, encontradas) y para conectar a usuarios con servicios. Los usuarios son responsables del contenido que publiquen y deben cumplir la normativa vigente.</p>
        </section>

        <section className="mb-4">
          <h5>3. Contenido y responsabilidades</h5>
          <p>Los usuarios garantizan que el contenido que publiquen no infringe derechos de terceros, no es fraudulento ni ilegal. Pet-One se reserva el derecho de eliminar publicaciones que violen estas normas.</p>
        </section>

        <section className="mb-4">
          <h5>4. Prohibiciones</h5>
          <p>Queda prohibido usar la plataforma para estafas, publicaciones con información falsa, venta de animales en condiciones ilegales, o la compartición de datos sensibles sin consentimiento.</p>
        </section>

        <section className="mb-4">
          <h5>5. Limitación de responsabilidad</h5>
          <p>Pet-One actúa como intermediario y no garantiza resultados de adopciones ni la veracidad completa de terceros. En ningún caso Pet-One será responsable por daños indirectos, pérdidas económicas o acciones de terceros.</p>
        </section>

        <section className="mb-4">
          <h5>6. Modificaciones</h5>
          <p>Podemos modificar estos Términos. Publicaremos cambios en esta página y la fecha de «Última actualización» indicará la vigencia.</p>
        </section>

        <section className="mb-4">
          <h5>7. Contacto</h5>
          <p>Para consultas sobre estos términos puedes escribir a contacto@petone.example.</p>
        </section>
      </div>
    </div>
  )
}

export default Terms
