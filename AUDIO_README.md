# Audio en el Portafolio Pixel Art

## ¿Dónde está el audio?

El audio en este proyecto está implementado usando la **Web Audio API** de JavaScript, no hay archivos de audio externos. Se genera dinámicamente en el navegador.

### Ubicación del código de audio:
- **Archivo**: `src/main.js`
- **Funciones principales**:
  - `playSound8Bit()` - Sonidos de introducción
  - `playClickSound()` - Sonidos de clic
  - `initializeAudioContext()` - Inicialización del contexto de audio

## ¿Por qué a veces funciona y otras no?

### Problemas comunes:

1. **Política de autoplay de navegadores**
   - Los navegadores modernos bloquean el audio automático
   - Requiere interacción del usuario para activar el audio
   - Chrome, Firefox, Safari tienen políticas estrictas

2. **AudioContext suspendido**
   - El contexto de audio puede estar en estado "suspended"
   - Necesita ser resumido por interacción del usuario

3. **Configuración del navegador**
   - Algunos navegadores tienen el audio deshabilitado
   - Extensiones pueden bloquear el audio

## Soluciones implementadas:

### ✅ Mejoras recientes:

1. **Manejo de errores mejorado**
   ```javascript
   try {
       // código de audio
   } catch (error) {
       console.log('Error de audio:', error);
   }
   ```

2. **Inicialización en interacción del usuario**
   ```javascript
   initializeAudioContext() {
       if (this.audioContext.state === 'suspended') {
           this.audioContext.resume();
       }
   }
   ```

3. **Verificación de estado del audio**
   ```javascript
   if (this.audioContext && this.audioContext.state === 'running') {
       // reproducir sonido
   }
   ```

## Cómo probar el audio:

1. **Abrir la página**
2. **Hacer clic en cualquier lugar** (esto activa el audio)
3. **Navegar por los enlaces** (deberías escuchar sonidos de clic)
4. **Verificar la consola** para mensajes de error

## Tipos de sonidos:

- **Sonidos de introducción**: Secuencia de 3 beeps (440Hz, 554Hz, 659Hz)
- **Sonidos de clic**: Beep agudo (800Hz) al hacer clic en elementos interactivos

## Debugging:

Si el audio no funciona:

1. **Abrir las herramientas de desarrollador** (F12)
2. **Ir a la pestaña Console**
3. **Buscar mensajes de error** relacionados con audio
4. **Verificar que el navegador permita audio**

## Compatibilidad:

- ✅ Chrome (versión 66+)
- ✅ Firefox (versión 60+)
- ✅ Safari (versión 11+)
- ✅ Edge (versión 79+)

## Notas técnicas:

- Los sonidos son generados usando osciladores de onda cuadrada
- Simulan el estilo de audio 8-bit retro
- El volumen está configurado bajo (0.05-0.1) para no ser molesto
- Los sonidos son muy cortos (0.1-0.15 segundos) 