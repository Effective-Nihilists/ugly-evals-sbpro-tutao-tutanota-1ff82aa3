"use strict";
exports.__esModule = true;
exports.AesApp = void 0;
var tutanota_crypto_1 = require("@tutao/tutanota-crypto");
var AesApp = /** @class */ (function () {
    function AesApp(nativeCryptoFacade, random) {
        this.nativeCryptoFacade = nativeCryptoFacade;
        this.random = random;
    }
    /**
     * Encrypts a file with the provided key
     * @return Returns the URI of the decrypted file. Resolves to an exception if the encryption failed.
     */
    AesApp.prototype.aesEncryptFile = function (key, fileUrl) {
        var iv = this.random.generateRandomData(tutanota_crypto_1.IV_BYTE_LENGTH);
        var encodedKey = (0, tutanota_crypto_1.keyToUint8Array)(key);
        return this.nativeCryptoFacade.aesEncryptFile(encodedKey, fileUrl, iv);
    };
    /**
     * Decrypt bytes with the provided key
     * @return Returns the URI of the decrypted file. Resolves to an exception if the encryption failed.
     */
    AesApp.prototype.aesDecryptFile = function (key, fileUrl) {
        var encodedKey = (0, tutanota_crypto_1.keyToUint8Array)(key);
        return this.nativeCryptoFacade.aesDecryptFile(encodedKey, fileUrl);
    };
    return AesApp;
}());
exports.AesApp = AesApp;
