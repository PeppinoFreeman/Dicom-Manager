using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Net.Http.Headers;
namespace WebApplication1.Helpers;

public static class FileHelper
{
    private const int FileSizeLimit = 256 * 1024 * 1024; // 256 MB

    // If you require a check on specific characters in the IsValidFileExtensionAndSignature
    // method, supply the characters in the _allowedChars field.
    private static readonly byte[] AllowedChars = { };

    private static readonly List<string> PermittedExtensions = new() { ".dcm", ".gif", ".png", ".jpg", ".jpeg" };
    private static readonly Dictionary<string, List<byte[]>> FileSignature = new()
    {
        { ".gif", new List<byte[]> { new byte[] { 0x47, 0x49, 0x46, 0x38 } } },
        { ".png", new List<byte[]> { new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A } } },
        {
            ".jpeg", new List<byte[]>
            {
                new byte[] { 0xFF, 0xD8, 0xFF, 0xE0 },
                new byte[] { 0xFF, 0xD8, 0xFF, 0xE2 },
                new byte[] { 0xFF, 0xD8, 0xFF, 0xE3 }
            }
        },
        {
            ".jpg", new List<byte[]>
            {
                new byte[] { 0xFF, 0xD8, 0xFF, 0xE0 },
                new byte[] { 0xFF, 0xD8, 0xFF, 0xE1 },
                new byte[] { 0xFF, 0xD8, 0xFF, 0xE8 }
            }
        },
        { ".dcm", new List<byte[]> { new byte[]{ 0x44, 0x49, 0x43, 0x4D } } }
    };

    // **WARNING!**
    // In the following file processing methods, the file's content isn't scanned.
    // In most production scenarios, an anti-virus/anti-malware scanner API is
    // used on the file before making the file available to users or other
    // systems. For more information, see the topic that accompanies this sample
    // app.
    
    public static async Task<byte[]> ProcessStreamedFile(
        MultipartSection section, ContentDispositionHeaderValue? contentDisposition)
    {
        try
        {
            using var memoryStream = new MemoryStream();
            await section.Body.CopyToAsync(memoryStream);

            // Check if the file is empty or exceeds the size limit.
            if (memoryStream.Length == 0)
            {
                throw new InvalidDataException("File is empty");
            }
            if (memoryStream.Length > FileSizeLimit)
            {
                const int megabyteSizeLimit = FileSizeLimit / 1048576;
                throw new InvalidDataException($"The file exceeds {megabyteSizeLimit:N1} MB.");
            }
            if (contentDisposition?.FileName.Value != null && !IsValidFileExtensionAndSignature(
                         contentDisposition.FileName.Value, memoryStream))
            {
                throw new InvalidDataException("The file type isn't permitted or the file's signature doesn't match the file's extension.");
            }
            return memoryStream.ToArray();
        }
        catch (Exception ex)
        {
            throw new InvalidDataException($"FormData is not valid: {ex}");
        }
    }

    private static bool IsValidFileExtensionAndSignature(string fileName, Stream? data)
    {
        if (string.IsNullOrEmpty(fileName) || data == null || data.Length == 0) return false;

        var ext = Path.GetExtension(fileName).ToLowerInvariant();

        if (string.IsNullOrEmpty(ext) || !PermittedExtensions.Contains(ext)) return false;

        data.Position = 0;

        using var reader = new BinaryReader(data);
        if (ext.Equals(".txt") || ext.Equals(".csv") || ext.Equals(".prn"))
        {
            if (AllowedChars.Length == 0)
            {
                // Limits characters to ASCII encoding.
                for (var i = 0; i < data.Length; i++)
                    if (reader.ReadByte() > sbyte.MaxValue)
                        return false;
            }
            else
            {
                // Limits characters to ASCII encoding and
                // values of the _allowedChars array.
                for (var i = 0; i < data.Length; i++)
                {
                    var b = reader.ReadByte();
                    if (b > sbyte.MaxValue ||
                        !AllowedChars.Contains(b))
                        return false;
                }
            }

            return true;
        }

        // Uncomment the following code block if you must permit
        // files whose signature isn't provided in the _fileSignature
        // dictionary. We recommend that you add file signatures
        // for files (when possible) for all file types you intend
        // to allow on the system and perform the file signature
        // check.
        /*
            if (!_fileSignature.ContainsKey(ext))
            {
                return true;
            }
            */

        // File signature check
        // --------------------
        // With the file signatures provided in the _fileSignature
        // dictionary, the following code tests the input content's
        // file signature.
        var signatures = FileSignature[ext];
        var headerBytes = reader.ReadBytes(signatures.Max(m => m.Length));

        return ext == ".dcm" || signatures.Any(signature =>
            headerBytes.Take(signature.Length).SequenceEqual(signature));
    }
}