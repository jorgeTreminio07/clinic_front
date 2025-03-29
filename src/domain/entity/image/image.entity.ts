export class ImageEntity {
  id: string;
  originalUrl: string;
  compactUrl: string;

  constructor(id: string, originalUrl: string, compactUrl: string) {
    this.id = id;
    this.originalUrl = originalUrl;
    this.compactUrl = compactUrl;
  }

  // from json
  static fromJson(json: any): ImageEntity {
    return new ImageEntity(json.id, json.originalUrl, json.compactUrl);
  }
  
}
