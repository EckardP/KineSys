using System.Net;
using System.Security;

namespace ApiPrueba.Security
{
    /// <summary>
    /// Validador de seguridad para prevenir ataques de path traversal (ruta transversal)
    /// </summary>
    public static class PathTraversalValidator
    {
        /// <summary>
        /// Valida que una ruta esté dentro del directorio base permitido
        /// </summary>
        /// <param name="ruta">Ruta a validar</param>
        /// <param name="directorioBase">Directorio base permitido</param>
        /// <returns>Ruta normalizada si es válida</returns>
        /// <exception cref="SecurityException">Si la ruta intenta escapar del directorio base</exception>
        public static string ValidarYNormalizarRuta(string ruta, string directorioBase)
        {
            if (string.IsNullOrWhiteSpace(ruta))
                throw new ArgumentException("La ruta no puede estar vacía");

            if (string.IsNullOrWhiteSpace(directorioBase))
                throw new ArgumentException("El directorio base no puede estar vacío");

            try
            {
                // Descifrar posibles rutas codificadas varias veces
                var rutaDecodificada = DecodificarRuta(ruta);

                // Verificación adicional contra caracteres peligrosos antes de normalizar
                if (ContienePatronesInseguros(rutaDecodificada))
                {
                    throw new SecurityException(
                        "La ruta contiene secuencias peligrosas (.., ~, \u0000) tras decodificación.");
                }

                var rutaNormalizada = Path.GetFullPath(rutaDecodificada);
                var directorioBaseNormalizado = Path.GetFullPath(directorioBase);
                var directorioBaseSeguro = AgregarSeparadorFinal(directorioBaseNormalizado);

                if (!rutaNormalizada.Equals(directorioBaseNormalizado, StringComparison.OrdinalIgnoreCase) &&
                    !rutaNormalizada.StartsWith(directorioBaseSeguro, StringComparison.OrdinalIgnoreCase))
                {
                    throw new SecurityException(
                        $"Intento de path traversal detectado. La ruta '{ruta}' está fuera del directorio permitido.");
                }

                return rutaNormalizada;
            }
            catch (ArgumentException ex)
            {
                throw new SecurityException($"Ruta inválida detectada: {ex.Message}", ex);
            }
        }

        private static string DecodificarRuta(string ruta)
        {
            if (string.IsNullOrEmpty(ruta))
            {
                return ruta!;
            }

            var resultado = ruta;
            for (var i = 0; i < 5; i++)
            {
                var anterior = resultado;
                resultado = Uri.UnescapeDataString(resultado);
                if (resultado == anterior)
                {
                    break;
                }
            }

            return resultado;
        }

        private static bool ContienePatronesInseguros(string ruta)
        {
            return ruta.Contains("..") || ruta.Contains("~") || ruta.IndexOf('\0') >= 0;
        }

        private static string AgregarSeparadorFinal(string ruta)
        {
            if (ruta.EndsWith(Path.DirectorySeparatorChar) || ruta.EndsWith(Path.AltDirectorySeparatorChar))
            {
                return ruta;
            }

            return ruta + Path.DirectorySeparatorChar;
        }

        /// <summary>
        /// Valida que un nombre de archivo sea seguro sin caracteres especiales
        /// </summary>
        /// <param name="nombreArchivo">Nombre del archivo a validar</param>
        /// <exception cref="SecurityException">Si el nombre contiene caracteres peligrosos</exception>
        public static void ValidarNombreArchivo(string nombreArchivo)
        {
            if (string.IsNullOrWhiteSpace(nombreArchivo))
                throw new ArgumentException("El nombre del archivo no puede estar vacío");

            // Obtener solo el nombre sin la ruta
            var nombreLimpio = Path.GetFileName(nombreArchivo);
            if (nombreLimpio != nombreArchivo)
                throw new SecurityException("El nombre del archivo no puede contener separadores de ruta");

            // Verificar caracteres inválidos del sistema de archivos
            var caracteresInvalidos = new[] { '/', '\\', ':', '*', '?', '"', '<', '>', '|' };
            if (nombreLimpio.IndexOfAny(caracteresInvalidos) >= 0)
                throw new SecurityException("El nombre del archivo contiene caracteres no permitidos");
        }

        /// <summary>
        /// Valida la extensión de archivo contra una lista de permitidas
        /// </summary>
        /// <param name="nombreArchivo">Nombre del archivo</param>
        /// <param name="extensionesPermitidas">Array de extensiones permitidas (ej: ".pdf", ".jpg")</param>
        /// <exception cref="SecurityException">Si la extensión no es permitida</exception>
        public static void ValidarExtensionArchivo(string nombreArchivo, string[] extensionesPermitidas)
        {
            var extension = Path.GetExtension(nombreArchivo).ToLower();
            if (!extensionesPermitidas.Contains(extension))
            {
                throw new SecurityException(
                    $"Extensión de archivo no permitida: {extension}. " +
                    $"Extensiones permitidas: {string.Join(", ", extensionesPermitidas)}");
            }
        }

        /// <summary>
        /// Valida que el MIME type esté en la lista de permitidos
        /// </summary>
        public static void ValidarMimeType(string mimeType, string[] mimeTypesPermitidos)
        {
            if (!mimeTypesPermitidos.Contains(mimeType.ToLower()))
            {
                throw new SecurityException(
                    $"MIME type no permitido: {mimeType}. " +
                    $"Tipos permitidos: {string.Join(", ", mimeTypesPermitidos)}");
            }
        }

        /// <summary>
        /// Valida el tamaño del archivo
        /// </summary>
        public static void ValidarTamañoArchivo(long tamañoActual, long tamañoMaximoBytes)
        {
            if (tamañoActual > tamañoMaximoBytes)
            {
                throw new ArgumentException(
                    $"El archivo excede el tamaño máximo permitido de {tamañoMaximoBytes / (1024 * 1024)} MB");
            }
        }
    }
}
