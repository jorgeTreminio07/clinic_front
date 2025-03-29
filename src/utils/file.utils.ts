export class FileUtils {
  static convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // Cuando la lectura del archivo se complete, se ejecutará esta función
      reader.onloadend = () => {
        // reader.result contiene el archivo en formFileato Data URL
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert file to Base64"));
        }
      };

      // Si ocurre un error, lo manejamos aquí
      reader.onerror = (error) => {
        reject(error);
      };

      // Leemos el archivo como Data URL
      reader.readAsDataURL(file);
    });
  };
}
