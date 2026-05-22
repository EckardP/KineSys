using Xunit;
using System.Security;
using ApiPrueba.Security;

namespace ApiPrueba.Tests.Security
{
    public class PathTraversalValidatorTests
    {
        private readonly string _directorioBase = Path.Combine(Path.GetTempPath(), "test_uploads");

        [Fact]
        public void ValidarYNormalizarRuta_RutaValida_RetornaRutaNormalizada()
        {
            // Arrange
            var ruta = Path.Combine(_directorioBase, "documento.pdf");

            // Act
            var resultado = PathTraversalValidator.ValidarYNormalizarRuta(ruta, _directorioBase);

            // Assert
            Assert.NotNull(resultado);
            Assert.StartsWith(_directorioBase, resultado, StringComparison.OrdinalIgnoreCase);
        }

        [Fact]
        public void ValidarYNormalizarRuta_RutaConPathTraversal_LanzaSecurityException()
        {
            // Arrange
            var ruta = Path.Combine(_directorioBase, "..", "..", "etc", "passwd");

            // Act & Assert
            Assert.Throws<SecurityException>(() =>
                PathTraversalValidator.ValidarYNormalizarRuta(ruta, _directorioBase)
            );
        }

        [Fact]
        public void ValidarYNormalizarRuta_RutaAbsoluta_LanzaSecurityException()
        {
            // Arrange
            var ruta = "/etc/passwd";

            // Act & Assert
            Assert.Throws<SecurityException>(() =>
                PathTraversalValidator.ValidarYNormalizarRuta(ruta, _directorioBase)
            );
        }

        [Theory]
        [InlineData("..\\archivo.txt")]
        [InlineData("..\\..\\archivo.txt")]
        [InlineData("../../archivo.txt")]
        [InlineData("archivo~.txt")]
        public void ValidarYNormalizarRuta_RutasConCaracteresPeligrosos_LanzaSecurityException(string rutaPeligrosa)
        {
            // Arrange
            var ruta = Path.Combine(_directorioBase, rutaPeligrosa);

            // Act & Assert
            Assert.Throws<SecurityException>(() =>
                PathTraversalValidator.ValidarYNormalizarRuta(ruta, _directorioBase)
            );
        }

        [Fact]
        public void ValidarNombreArchivo_NombreValido_NoLanzaExcepcion()
        {
            // Arrange
            var nombreArchivo = "documento.pdf";

            // Act & Assert
            PathTraversalValidator.ValidarNombreArchivo(nombreArchivo); // No debe lanzar
        }

        [Theory]
        [InlineData("../documento.pdf")]
        [InlineData("..\\documento.pdf")]
        [InlineData("/etc/passwd")]
        [InlineData("C:\\Windows\\system32.txt")]
        public void ValidarNombreArchivo_NombreConRuta_LanzaSecurityException(string nombreInvalido)
        {
            // Act & Assert
            Assert.Throws<SecurityException>(() =>
                PathTraversalValidator.ValidarNombreArchivo(nombreInvalido)
            );
        }

        [Theory]
        [InlineData("documento*.pdf")]
        [InlineData("archivo?.txt")]
        [InlineData("file<script>.pdf")]
        [InlineData("file>output.txt")]
        [InlineData("file|pipe.pdf")]
        [InlineData("file:stream.txt")]
        public void ValidarNombreArchivo_CaracteresEspeciales_LanzaSecurityException(string nombreEspecial)
        {
            // Act & Assert
            Assert.Throws<SecurityException>(() =>
                PathTraversalValidator.ValidarNombreArchivo(nombreEspecial)
            );
        }

        [Fact]
        public void ValidarExtensionArchivo_ExtensionPermitida_NoLanzaExcepcion()
        {
            // Arrange
            var extensionesPermitidas = new[] { ".pdf", ".jpg", ".png" };
            var archivo = "documento.pdf";

            // Act & Assert
            PathTraversalValidator.ValidarExtensionArchivo(archivo, extensionesPermitidas);
        }

        [Fact]
        public void ValidarExtensionArchivo_ExtensionNoPermitida_LanzaSecurityException()
        {
            // Arrange
            var extensionesPermitidas = new[] { ".pdf", ".jpg", ".png" };
            var archivo = "malware.exe";

            // Act & Assert
            Assert.Throws<SecurityException>(() =>
                PathTraversalValidator.ValidarExtensionArchivo(archivo, extensionesPermitidas)
            );
        }

        [Fact]
        public void ValidarMimeType_MimeTypePermitido_NoLanzaExcepcion()
        {
            // Arrange
            var mimeTypesPermitidos = new[] { "application/pdf", "image/jpeg", "image/png" };
            var mimeType = "application/pdf";

            // Act & Assert
            PathTraversalValidator.ValidarMimeType(mimeType, mimeTypesPermitidos);
        }

        [Fact]
        public void ValidarMimeType_MimeTypeNoPermitido_LanzaSecurityException()
        {
            // Arrange
            var mimeTypesPermitidos = new[] { "application/pdf", "image/jpeg" };
            var mimeType = "application/x-msdownload"; // .exe

            // Act & Assert
            Assert.Throws<SecurityException>(() =>
                PathTraversalValidator.ValidarMimeType(mimeType, mimeTypesPermitidos)
            );
        }

        [Fact]
        public void ValidarTamañoArchivo_TamañoValido_NoLanzaExcepcion()
        {
            // Arrange
            long tamañoMaximo = 10 * 1024 * 1024; // 10 MB
            long tamañoArchivo = 5 * 1024 * 1024; // 5 MB

            // Act & Assert
            PathTraversalValidator.ValidarTamañoArchivo(tamañoArchivo, tamañoMaximo);
        }

        [Fact]
        public void ValidarTamañoArchivo_TamañoExcedido_LanzaArgumentException()
        {
            // Arrange
            long tamañoMaximo = 10 * 1024 * 1024; // 10 MB
            long tamañoArchivo = 15 * 1024 * 1024; // 15 MB

            // Act & Assert
            Assert.Throws<ArgumentException>(() =>
                PathTraversalValidator.ValidarTamañoArchivo(tamañoArchivo, tamañoMaximo)
            );
        }

        [Theory]
        [InlineData("..%2F..%2Fetc%2Fpasswd")] // URL encoded path traversal
        [InlineData("....//....//etc//passwd")] // Double encoding bypass attempt
        [InlineData(".%252e%252f.%252e%252fetc")] // Double encoded
        [InlineData("..%5C..%5Cwindows%5Csystem32")] // Encoded backslash
        public void ValidarYNormalizarRuta_EncodedPathTraversal_LanzaSecurityException(string rutaEncodificada)
        {
            // Act & Assert
            Assert.Throws<SecurityException>(() =>
                PathTraversalValidator.ValidarYNormalizarRuta(
                    rutaEncodificada,
                    _directorioBase
                )
            );
        }
    }
}
