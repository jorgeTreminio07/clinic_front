export class RolEntity {
  id: string;
  name: string;
  rolId: string;

  constructor(id: string, name: string, rolId: string) {
    this.id = id;
    this.name = name;
    this.rolId = rolId;
  }

  // from json
  static fromJson(json: any): RolEntity {
    return new RolEntity(json.id, json.name, json.rolId);
  }
}
