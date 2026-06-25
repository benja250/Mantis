export default function PrivacidadPage() {
  return (
    <main>
      <div style={{
        padding: '80px 48px 60px',
        background: 'var(--crema-dark)',
        borderBottom: '0.5px solid rgba(28,61,46,0.1)',
      }}>
        <div style={{
          fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase',
          color: 'var(--dorado)', marginBottom: '20px',
        }}>
          Legal
        </div>
        <h1 style={{
          fontFamily: 'var(--ff-serif)', fontSize: '52px', fontWeight: 300, color: 'var(--verde)',
        }}>
          Política de privacidad<br />y términos de uso
        </h1>
        <p style={{ marginTop: '16px', fontSize: '11px', color: '#3a6b52', letterSpacing: '0.06em' }}>
          Última actualización: junio de 2026
        </p>
      </div>

      <div style={{ padding: '64px 48px', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {[
          {
            title: '1. Datos que recopilamos',
            body: `Al realizar una compra recopilamos: nombre completo, correo electrónico, número de teléfono y dirección de despacho. También podemos recopilar datos de navegación de forma anónima para mejorar la experiencia del sitio.`,
          },
          {
            title: '2. Uso de los datos',
            body: `Usamos tus datos únicamente para procesar y despachar tu pedido, enviarte información sobre el estado del envío y — si lo autorizas — enviarte comunicaciones de marketing. Nunca vendemos tu información a terceros.`,
          },
          {
            title: '3. Newsletter',
            body: `Si te suscribes al newsletter, recibirás novedades, lanzamientos y ofertas. Puedes darte de baja en cualquier momento haciendo clic en el enlace al pie de cada email.`,
          },
          {
            title: '4. Seguridad',
            body: `Protegemos tus datos con medidas de seguridad razonables. Las transferencias bancarias se realizan directamente al banco — nunca almacenamos datos de tarjetas.`,
          },
          {
            title: '5. Cookies',
            body: `Usamos cookies esenciales para el funcionamiento del carrito y preferencias. No usamos cookies publicitarias de terceros.`,
          },
          {
            title: '6. Términos de compra',
            body: `Al realizar una compra aceptas que: (a) los precios están en pesos chilenos (CLP), (b) el despacho se coordina según la información proporcionada, (c) la garantía de 30 días aplica solo a defectos de fabricación y no a desgaste por uso.`,
          },
          {
            title: '7. Derecho a retracto',
            body: `De acuerdo con la Ley N° 19.496 sobre Protección de los Derechos de los Consumidores (art. 3 bis), tienes derecho a retractarte de tu compra dentro de los 10 días hábiles siguientes a la recepción del producto, sin necesidad de expresar causa. Para ejercer este derecho escríbenos a hola@mantisjoyas.cl con tu número de orden. El producto debe ser devuelto en las mismas condiciones en que fue recibido. Los gastos de devolución corren por tu cuenta salvo que el motivo sea un defecto de fabricación o un error nuestro.`,
          },
          {
            title: '8. Cambios y devoluciones',
            body: `Además del derecho a retracto legal (sección 7), aceptamos cambios por talla o modelo dentro de los 10 días corridos desde la recepción, siempre que la joya esté sin uso y en su empaque original. Los gastos de envío del cambio corren por cuenta del cliente salvo que el motivo sea un defecto de fabricación.`,
          },
          {
            title: '9. Contacto',
            body: `Para cualquier consulta sobre privacidad o términos escríbenos a hola@mantisjoyas.cl.`,
          },
        ].map(({ title, body }) => (
          <div key={title}>
            <h2 style={{
              fontFamily: 'var(--ff-serif)', fontSize: '22px', fontWeight: 300,
              color: 'var(--verde)', marginBottom: '14px',
            }}>
              {title}
            </h2>
            <p style={{ fontSize: '13px', color: '#3a6b52', lineHeight: 1.9 }}>{body}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
