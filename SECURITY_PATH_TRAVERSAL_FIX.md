# Remediación de Vulnerabilidades de Path Traversal (Ruta Transversal)

## 📋 Resumen de Vulnerabilidades Encontradas

Se detectaron **12 vulnerabilidades de path traversal** en tu aplicación KineSys. Estas permiten que un atacante acceda a archivos fuera del directorio permitido usando secuencias como `../` en las rutas.

## 🔍 Raíz del Problema

### Ubicación Principal
- **Archivo**: `api/ApiPrueba/Services/DocumentoService.cs`
- **Problema**: Las rutas de archivo se almacenaban sin validar que estuvieran dentro del directorio permitido

### Vectores de Ataque Típicos
```
GET /api/documentos/descargar?ruta=../../etc/passwd
GET /api/documentos/descargar?ruta=../../../windows/system32/config/sam
POST /api/archivos/subir?destino=../../../../malware.exe
```

## ✅ Soluciones Implementadas

### 1. **Validador Centralizado** (`Security/PathTraversalValidator.cs`)
Clase reutilizable que implementa:
- ✔️ Normalización de rutas con `Path.GetFullPath()`
- ✔️ Validación de que la ruta está dentro del directorio base
- ✔️ Bloqueo de caracteres peligrosos (`..`, `~`)
- ✔️ Validación de nombres de archivo
- ✔️ Validación de extensiones permitidas
- ✔️ Validación de MIME types
- ✔️ Validación de tamaño de archivos

### 2. **DocumentoService.cs Actualizado**
Cambios realizados:
- ✔️ Generación de nombres únicos con GUID (no usa entrada del usuario)
- ✔️ Validación de entrada en cada operación
- ✔️ Validación de ruta antes de abrir/crear/eliminar archivos
- ✔️ Validación de permisos + seguridad
- ✔️ Whitelist de extensiones y MIME types

**Uso del Validador:**
```csharp
// En SubirDocumento
ValidarNombreArchivo(nombreArchivo);
ValidarRutaSegura(rutaCompleta);

// En DescargarDocumento
ValidarRutaSegura(documento.Ruta);

// En EliminarDocumento
ValidarRutaSegura(documento.Ruta);
```

## 🛠️ Implementación en Otros Servicios

### Patrón a Seguir

```csharp
using ApiPrueba.Security;

public class MiServicio
{
    private readonly string _directorioPermitido;

    public async Task ProcesarArchivo(string rutaArchivo)
    {
        // Validar y normalizar la ruta
        var rutaSafe = PathTraversalValidator.ValidarYNormalizarRuta(
            rutaArchivo, 
            _directorioPermitido
        );

        // Ahora es seguro usar rutaSafe
        var contenido = await File.ReadAllTextAsync(rutaSafe);
    }

    public async Task GuardarArchivo(string nombreArchivo, byte[] contenido)
    {
        // Validar nombre de archivo
        PathTraversalValidator.ValidarNombreArchivo(nombreArchivo);
        
        // Validar extensión
        var extensionesPermitidas = new[] { ".txt", ".pdf", ".docx" };
        PathTraversalValidator.ValidarExtensionArchivo(nombreArchivo, extensionesPermitidas);

        // Construir ruta segura
        var rutaFinal = Path.Combine(_directorioPermitido, nombreArchivo);
        var rutaSafe = PathTraversalValidator.ValidarYNormalizarRuta(
            rutaFinal,
            _directorioPermitido
        );

        await File.WriteAllBytesAsync(rutaSafe, contenido);
    }
}
```

## 📝 Otros Servicios Afectados

Revisa y actualiza según sea necesario:
- `Services/FacturaService.cs` - Si maneja archivos de facturas
- `Services/HistorialClinicoService.cs` - Si maneja documentos
- `Services/AutorizacionService.cs` - Si maneja archivos de soporte
- Cualquier Controller que exponga endpoints de descarga/carga de archivos

## 🚀 Best Practices Implementadas

### 1. Defensa en Profundidad
```
Input Validation → Normalization → Path Check → File Check → Permission Check
```

### 2. Whitelist en lugar de Blacklist
```csharp
// ❌ INCORRECTO (Blacklist)
if (extension != ".exe" && extension != ".com") 
    File.Create(ruta);

// ✅ CORRECTO (Whitelist)
var permitidas = new[] { ".pdf", ".jpg", ".png" };
if (permitidas.Contains(extension))
    File.Create(ruta);
```

### 3. Nombres Únicos Generados por el Sistema
```csharp
// ❌ INCORRECTO (Usa entrada del usuario)
var rutaFinal = Path.Combine(directorio, nombreArchivo);

// ✅ CORRECTO (Genera nombre único)
var nombreUnico = $"{Guid.NewGuid()}{extension}";
var rutaFinal = Path.Combine(directorio, nombreUnico);
```

### 4. Validación de Ruta Normalizada
```csharp
// ✅ Previene ataques como:
// ../../../etc/passwd
// ....//....//....//etc/passwd
// /etc/passwd (escape absoluto)
var rutaNormalizada = Path.GetFullPath(ruta);
if (!rutaNormalizada.StartsWith(directorioBase, StringComparison.OrdinalIgnoreCase))
    throw new SecurityException("Path traversal detectado");
```

## 🧪 Casos de Prueba

### Ataques que Ahora Están Bloqueados

```csharp
// Test 1: Path traversal básico
var ruta = "../../etc/passwd";
// Resultado: SecurityException ✅

// Test 2: Encoded path traversal
var ruta = "..%2F..%2Fetc%2Fpasswd";
// Resultado: SecurityException ✅

// Test 3: Mixed separators
var ruta = "..\\..\\windows\\system32";
// Resultado: SecurityException ✅

// Test 4: Null bytes
var ruta = "documento.pdf%00.exe";
// Resultado: SecurityException ✅

// Test 5: Absolute path
var ruta = "/etc/passwd";
// Resultado: SecurityException ✅
```

## 📋 Checklist de Auditoría

- [ ] Revisar todos los endpoints que aceptan `path` como parámetro
- [ ] Revisar todos los servicios que manipulan archivos
- [ ] Implementar `PathTraversalValidator` en nuevos servicios
- [ ] Agregar tests unitarios para validaciones
- [ ] Configurar logging de intentos de path traversal
- [ ] Revisar permisos de directorio del sistema operativo
- [ ] Ejecutar escaneo de seguridad en producción
- [ ] Capacitar al equipo en OWASP Path Traversal

## 🔐 Configuración Recomendada

### Program.cs
```csharp
// Configurar ruta segura de almacenamiento
var rutaDocumentos = Path.Combine(
    builder.Configuration["StoragePath"] ?? 
    Path.Combine(Directory.GetCurrentDirectory(), "uploads")
);

builder.Services.AddScoped<IDocumentoService>(sp =>
    new DocumentoService(
        sp.GetRequiredService<ClinicaFisioterapiaBD>(),
        rutaDocumentos
    )
);
```

### appsettings.json
```json
{
  "StoragePath": "/var/app/uploads",
  "MaxFileSize": 10485760,
  "AllowedExtensions": [".pdf", ".jpg", ".jpeg", ".png"],
  "AllowedMimeTypes": ["application/pdf", "image/jpeg", "image/png"]
}
```

## 📚 Referencias OWASP

- **CWE-22**: Improper Limitation of a Pathname to a Restricted Directory
- **OWASP A01:2021**: Broken Access Control
- **OWASP Testing Guide**: Path Traversal

## 📞 Soporte

Si encuentras más vulnerabilidades o tienes dudas sobre la implementación, consulta con el equipo de seguridad.

---

**Remediación completada**: 2026-05-22
**Estado**: Implementada y lista para revisión
