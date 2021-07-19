using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using Backend.Configuration;

namespace Backend.Extensions
{
    public static class ExtensionEncryption
    {
        public static string Encrypt(this string value)
        {
            byte[] plainText = Encoding.UTF8.GetBytes(value);

            using (RijndaelManaged rijndaelCipher = new RijndaelManaged())
            {
                PasswordDeriveBytes secretKey = new PasswordDeriveBytes(Encoding.ASCII.GetBytes(Constants.EncryptionKey), Encoding.ASCII.GetBytes(Constants.SaltKey));
                using (ICryptoTransform encryptor = rijndaelCipher.CreateEncryptor(secretKey.GetBytes(32), secretKey.GetBytes(16)))
                {
                    using (MemoryStream memoryStream = new MemoryStream())
                    {
                        using (CryptoStream cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                        {
                            cryptoStream.Write(plainText, 0, plainText.Length);
                            cryptoStream.FlushFinalBlock();
                            return Convert.ToBase64String(memoryStream.ToArray());
                        }
                    }
                }
            }
        }

        public static string Decrypt(this string value)
        {
            byte[] encryptedData = Convert.FromBase64String(value);
            PasswordDeriveBytes secretKey = new PasswordDeriveBytes(Encoding.ASCII.GetBytes(Constants.EncryptionKey), Encoding.ASCII.GetBytes(Constants.SaltKey));

            using (RijndaelManaged rijndaelCipher = new RijndaelManaged())
            {
                using (ICryptoTransform decryptor = rijndaelCipher.CreateDecryptor(secretKey.GetBytes(32), secretKey.GetBytes(16)))
                {
                    using (MemoryStream memoryStream = new MemoryStream(encryptedData))
                    {
                        using (CryptoStream cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read))
                        {
                            byte[] plainText = new byte[encryptedData.Length];
                            cryptoStream.Read(plainText, 0, plainText.Length);

                           
                            return Encoding.UTF8.GetString(plainText, 0, plainText.Length).TrimEnd("\0".ToCharArray());
                        }
                    }
                }
            }
        }

        public static string Base64Encode(this string plainText)
        {
            var plainTextBytes = Encoding.UTF8.GetBytes(plainText);
            return Convert.ToBase64String(plainTextBytes);
        }

        public static string Base64Decode(this string base64EncodedData)
        {
            if (string.IsNullOrEmpty(base64EncodedData) || base64EncodedData.Length % 4 != 0
                                                   || base64EncodedData.Contains(" ") || base64EncodedData.Contains("\t") || base64EncodedData.Contains("\r") || base64EncodedData.Contains("\n"))
                return base64EncodedData;

            var base64EncodedBytes = Convert.FromBase64String(base64EncodedData);
            return Encoding.UTF8.GetString(base64EncodedBytes);
        }
    }
}
